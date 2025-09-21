import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { createDemoData, extractDataFromResponse } from '../utils/demoData';

const useCMSStore = create(
  persist(
    (set, get) => ({
      // State
      pages: [],
      widgets: {},
      media: [],
      links: [],
      users: [],
      settings: {},
      selectedWidgetId: null,
      currentPageId: null,
      showTemplateSelector: false,
      insertPosition: null,

      // Initialize demo data if no data exists
      initializeDemoData: () => {
        const state = get();
        if (!state.pages || state.pages.length === 0) {
          const apiResponse = createDemoData();
          const extractedData = extractDataFromResponse(apiResponse);
          set({
            pages: extractedData.pages,
            widgets: extractedData.widgets,
            media: extractedData.media,
            links: extractedData.links,
            users: extractedData.users,
            settings: extractedData.settings,
            currentPageId: extractedData.pages[0]?.id || null,
          });
          
          setTimeout(() => {
            const newState = get();
            localStorage.setItem('cms-storage', JSON.stringify({
              state: {
                pages: newState.pages,
                widgets: newState.widgets,
                media: newState.media,
                links: newState.links,
                users: newState.users,
                settings: newState.settings,
                currentPageId: newState.currentPageId,
              },
              version: 0,
            }));
          }, 100);
        } else {
          if (!state.currentPageId && state.pages.length > 0) {
            set({ currentPageId: state.pages[0].id });
          }
        }
      },

      setShowTemplateSelector: (show, position = null) => {
        set({ 
          showTemplateSelector: show, 
          insertPosition: position,
          selectedWidgetId: show ? null : get().selectedWidgetId
        });
      },

      forceSave: () => {
        const state = get();
        const dataToSave = {
          pages: state.pages,
          widgets: state.widgets,
          media: state.media,
          links: state.links,
          users: state.users,
          settings: state.settings,
          currentPageId: state.currentPageId,
        };
        
        try {
          localStorage.setItem('cms-storage', JSON.stringify({
            state: dataToSave,
            version: 0,
          }));
          console.log('Data successfully saved to localStorage');
        } catch (error) {
          console.error('Failed to save data to localStorage:', error);
        }
      },

      createPage: (title = 'New Page') => {
        const id = uuidv4();
        const slug = title.toLowerCase().replace(/\s+/g, '-');
        const newPage = { 
          id, 
          title, 
          slug, 
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author: {
            id: 'user-1',
            name: 'Current User',
            email: 'user@example.com'
          },
          meta: {
            description: '',
            keywords: [],
            seo_title: title
          },
          widgets: [],
          settings: {
            layout: 'default',
            theme: 'light',
            show_header: true,
            show_footer: true
          }
        };
        set((state) => ({
          pages: [...state.pages, newPage],
          currentPageId: id,
        }));
        
        setTimeout(() => get().forceSave(), 0);
        return id;
      },

      updatePage: (id, updates) => {
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === id ? { 
              ...page, 
              ...updates, 
              updated_at: new Date().toISOString() 
            } : page
          ),
        }));
        
        setTimeout(() => get().forceSave(), 0);
      },

      deletePage: (id) => {
        set((state) => {
          const page = state.pages.find((p) => p.id === id);
          if (page) {
            const newWidgets = { ...state.widgets };
            page.widgets.forEach((widgetId) => {
              delete newWidgets[widgetId];
            });
            const remainingPages = state.pages.filter((p) => p.id !== id);
            return {
              pages: remainingPages,
              widgets: newWidgets,
              currentPageId: state.currentPageId === id ? 
                (remainingPages.length > 0 ? remainingPages[0].id : null) : 
                state.currentPageId,
            };
          }
          return state;
        });
        
        setTimeout(() => get().forceSave(), 0);
      },

      addWidget: (type, pageId, insertIndex = -1) => {
        const state = get();
        const targetPageId = pageId || state.currentPageId;
        
        if (!targetPageId) {
          console.error('No page ID available for adding widget');
          return null;
        }

        const id = uuidv4();
        const newWidget = {
          id,
          type,
          page_id: targetPageId,
          order: 0,
          props: getDefaultWidgetProps(type),
          layout: { 
            x: 0, 
            y: 0, 
            width: 'auto', 
            height: 'auto',
            margin: { top: 0, right: 0, bottom: 16, left: 0 },
            padding: { top: 0, right: 0, bottom: 0, left: 0 }
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        set((state) => {
          const updatedPages = state.pages.map((page) =>
            page.id === targetPageId
              ? {
                  ...page,
                  widgets: insertIndex >= 0
                    ? [...page.widgets.slice(0, insertIndex), id, ...page.widgets.slice(insertIndex)]
                    : [...page.widgets, id]
                }
              : page
          );
          return {
            widgets: { ...state.widgets, [id]: newWidget },
            pages: updatedPages,
            selectedWidgetId: id,
          };
        });

        setTimeout(() => get().forceSave(), 0);
        return id;
      },

      updateWidget: (id, updates) => {
        set((state) => ({
          widgets: {
            ...state.widgets,
            [id]: { 
              ...state.widgets[id], 
              ...updates,
              updated_at: new Date().toISOString()
            },
          },
        }));
        
        setTimeout(() => get().forceSave(), 100);
      },

      changeWidgetType: (id, newType) => {
        set((state) => ({
          widgets: {
            ...state.widgets,
            [id]: { 
              ...state.widgets[id], 
              type: newType,
              props: getDefaultWidgetProps(newType),
              updated_at: new Date().toISOString()
            },
          },
        }));
        
        setTimeout(() => get().forceSave(), 0);
      },

      deleteWidget: (id) => {
        set((state) => {
          const newWidgets = { ...state.widgets };
          delete newWidgets[id];
          return {
            widgets: newWidgets,
            pages: state.pages.map((page) => ({
              ...page,
              widgets: page.widgets.filter((widgetId) => widgetId !== id),
            })),
            selectedWidgetId: state.selectedWidgetId === id ? null : state.selectedWidgetId,
          };
        });
        
        setTimeout(() => get().forceSave(), 0);
      },

      duplicateWidget: (id, pageId) => {
        const state = get();
        const originalWidget = state.widgets[id];
        if (!originalWidget) return null;

        const newId = uuidv4();
        const duplicatedWidget = {
          ...originalWidget,
          id: newId,
          page_id: pageId,
          props: { ...originalWidget.props },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        set((state) => ({
          widgets: { ...state.widgets, [newId]: duplicatedWidget },
          pages: state.pages.map((page) =>
            page.id === pageId
              ? { ...page, widgets: [...page.widgets, newId] }
              : page
          ),
          selectedWidgetId: newId,
        }));

        setTimeout(() => get().forceSave(), 0);
        return newId;
      },

      reorderWidgets: (pageId, newOrder) => {
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === pageId ? { ...page, widgets: newOrder } : page
          ),
        }));
        
        setTimeout(() => get().forceSave(), 0);
      },

      addMedia: (file) => {
        const id = uuidv4();
        const url = URL.createObjectURL(file);
        const newMedia = {
          id,
          filename: file.name,
          original_name: file.name,
          url,
          thumbnail_url: url,
          mime_type: file.type,
          size: file.size,
          width: null,
          height: null,
          alt_text: '',
          caption: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          uploaded_by: {
            id: 'user-1',
            name: 'Current User'
          },
          tags: []
        };

        set((state) => ({
          media: [...state.media, newMedia],
        }));

        setTimeout(() => get().forceSave(), 0);
        return id;
      },

      deleteMedia: (id) => {
        set((state) => {
          const media = state.media.find((m) => m.id === id);
          if (media) {
            URL.revokeObjectURL(media.url);
          }
          return {
            media: state.media.filter((m) => m.id !== id),
          };
        });
        
        setTimeout(() => get().forceSave(), 0);
      },

      addLink: (title, url, target = '_self') => {
        const id = uuidv4();
        const newLink = { 
          id, 
          title, 
          url, 
          target,
          rel: target === '_blank' ? 'noopener noreferrer' : '',
          type: 'external',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: {
            id: 'user-1',
            name: 'Current User'
          }
        };
        set((state) => ({
          links: [...state.links, newLink],
        }));
        
        setTimeout(() => get().forceSave(), 0);
        return id;
      },

      updateLink: (id, updates) => {
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { 
              ...link, 
              ...updates,
              updated_at: new Date().toISOString()
            } : link
          ),
        }));
        
        setTimeout(() => get().forceSave(), 0);
      },

      deleteLink: (id) => {
        set((state) => ({
          links: state.links.filter((link) => link.id !== id),
        }));
        
        setTimeout(() => get().forceSave(), 0);
      },

      selectWidget: (id) => {
        set({ selectedWidgetId: id });
      },

      setCurrentPage: (id) => {
        set({ currentPageId: id });
        setTimeout(() => get().forceSave(), 0);
      },

      exportData: () => {
        const state = get();
        return {
          success: true,
          message: "Data exported successfully",
          timestamp: new Date().toISOString(),
          version: "1.0.0",
          data: {
            pages: state.pages,
            widgets: state.widgets,
            media: state.media,
            links: state.links,
            users: state.users,
            settings: state.settings
          }
        };
      },

      importData: (apiResponse) => {
        const extractedData = extractDataFromResponse(apiResponse);
        set({
          pages: extractedData.pages,
          widgets: extractedData.widgets,
          media: extractedData.media,
          links: extractedData.links,
          users: extractedData.users,
          settings: extractedData.settings,
          selectedWidgetId: null,
          currentPageId: extractedData.pages[0]?.id || null,
        });
        
        setTimeout(() => get().forceSave(), 0);
      },

      clearAllData: () => {
        set({
          pages: [],
          widgets: {},
          media: [],
          links: [],
          users: [],
          settings: {},
          selectedWidgetId: null,
          currentPageId: null,
        });
        
        localStorage.removeItem('cms-storage');
      },
    }),
    {
      name: 'cms-storage',
      partialize: (state) => ({
        pages: state.pages,
        widgets: state.widgets,
        media: state.media,
        links: state.links,
        users: state.users,
        settings: state.settings,
        currentPageId: state.currentPageId,
      }),
      serialize: (state) => JSON.stringify(state),
      deserialize: (str) => {
        try {
          return JSON.parse(str);
        } catch (error) {
          console.error('Failed to deserialize localStorage data:', error);
          return {};
        }
      },
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('Failed to rehydrate state:', error);
          } else {
            if (state && state.pages && state.pages.length > 0 && !state.currentPageId) {
              const store = useCMSStore.getState();
              store.setCurrentPage(state.pages[0].id);
            }
          }
        };
      },
    }
  )
);

const getDefaultWidgetProps = (type) => {
  switch (type) {
    case 'richText':
      return { 
        content: '',
        text_align: 'left',
        font_size: 'base',
        line_height: 'relaxed'
      };
    case 'image':
      return { 
        src: '', 
        alt: '', 
        width: '100%', 
        height: 'auto',
        border_radius: 'none',
        object_fit: 'cover'
      };
    case 'button':
      return { 
        label: 'Button Text',
        link: '', 
        target: '_self',
        variant: 'primary',
        size: 'md',
        color: '#3b82f6',
        background_color: '#3b82f6',
        text_color: '#ffffff',
        border_radius: 'md',
        padding: { top: 12, right: 24, bottom: 12, left: 24 }
      };
    case 'heading':
      return { 
        level: 2, 
        text: '',
        alignment: 'left',
        color: '#1f2937',
        font_size: '2xl',
        font_weight: 'bold'
      };
    case 'spacer':
      return { 
        height: 40,
        background_color: 'transparent',
        border_style: 'none'
      };
    case 'divider':
      return { 
        style: 'solid', 
        thickness: 1, 
        color: '#e5e7eb',
        width: '100%',
        opacity: 1
      };
    case 'webPageInterface':
      return {
        title: "Add magic to your components",
        subtitle: "DESIGN SYSTEM",
        description: "With little changes you can turn your React design system into visually editable content blocks your marketing will love.",
        primaryButtonText: "Learn more",
        secondaryButtonText: "Sign up",
        primaryButtonColor: "#EC4899",
        secondaryButtonColor: "#EC4899",
        backgroundGradient: "linear-gradient(135deg, #FDF2F8 0%, #FFFFFF 50%, #F3E8FF 100%)",
        imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      };
    default:
      return {};
  }
};

export default useCMSStore;