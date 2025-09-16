import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { createDemoData, hasDemoData, extractDataFromResponse } from '../utils/demoData';

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

      // Initialize demo data if no data exists
      initializeDemoData: () => {
        if (!hasDemoData()) {
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
        }
      },

      // Pages actions
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
      },

      deletePage: (id) => {
        set((state) => {
          const page = state.pages.find((p) => p.id === id);
          if (page) {
            // Remove widgets associated with this page
            const newWidgets = { ...state.widgets };
            page.widgets.forEach((widgetId) => {
              delete newWidgets[widgetId];
            });
            return {
              pages: state.pages.filter((p) => p.id !== id),
              widgets: newWidgets,
              currentPageId: state.currentPageId === id ? null : state.currentPageId,
            };
          }
          return state;
        });
      },

      // Widgets actions
      addWidget: (type, pageId, insertIndex = -1) => {
        const id = uuidv4();
        const newWidget = {
          id,
          type,
          page_id: pageId,
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
            page.id === pageId
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

        return newId;
      },

      reorderWidgets: (pageId, newOrder) => {
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === pageId ? { ...page, widgets: newOrder } : page
          ),
        }));
      },

      // Media actions
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
      },

      // Links actions
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
      },

      deleteLink: (id) => {
        set((state) => ({
          links: state.links.filter((link) => link.id !== id),
        }));
      },

      // UI actions
      selectWidget: (id) => {
        set({ selectedWidgetId: id });
      },

      setCurrentPage: (id) => {
        set({ currentPageId: id });
      },

      // Utility actions
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
          currentPageId: null,
        });
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
      }),
    }
  )
);

const getDefaultWidgetProps = (type) => {
  switch (type) {
    case 'richText':
      return { 
        content: '', // Empty content initially
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
        label: 'Button Text', // More neutral placeholder
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
        text: '', // Empty initially
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
    default:
      return {};
  }
};

export default useCMSStore;