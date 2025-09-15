import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { createDemoData, hasDemoData } from '../utils/demoData';

const useCMSStore = create(
  persist(
    (set, get) => ({
      // State
      pages: [],
      widgets: {},
      media: [],
      links: [],
      selectedWidgetId: null,
      currentPageId: null,

      // Initialize demo data if no data exists
      initializeDemoData: () => {
        if (!hasDemoData()) {
          const demoData = createDemoData();
          set({
            pages: demoData.pages,
            widgets: demoData.widgets,
            media: demoData.media,
            links: demoData.links,
            currentPageId: demoData.pages[0]?.id || null,
          });
        }
      },

      // Pages actions
      createPage: (title = 'New Page') => {
        const id = uuidv4();
        const slug = title.toLowerCase().replace(/\s+/g, '-');
        const newPage = { id, title, slug, widgets: [] };
        set((state) => ({
          pages: [...state.pages, newPage],
          currentPageId: id,
        }));
        return id;
      },

      updatePage: (id, updates) => {
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === id ? { ...page, ...updates } : page
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
      addWidget: (type, pageId) => {
        const id = uuidv4();
        const newWidget = {
          id,
          type,
          props: getDefaultWidgetProps(type),
          layout: { x: 0, y: 0, width: 'auto', height: 'auto' },
        };

        set((state) => ({
          widgets: { ...state.widgets, [id]: newWidget },
          pages: state.pages.map((page) =>
            page.id === pageId
              ? { ...page, widgets: [...page.widgets, id] }
              : page
          ),
          selectedWidgetId: id,
        }));

        return id;
      },

      updateWidget: (id, updates) => {
        set((state) => ({
          widgets: {
            ...state.widgets,
            [id]: { ...state.widgets[id], ...updates },
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
          name: file.name,
          url,
          size: file.size,
          type: file.type,
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
        const newLink = { id, title, url, target };
        set((state) => ({
          links: [...state.links, newLink],
        }));
        return id;
      },

      updateLink: (id, updates) => {
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { ...link, ...updates } : link
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
          pages: state.pages,
          widgets: state.widgets,
          media: state.media,
          links: state.links,
        };
      },

      importData: (data) => {
        set({
          pages: data.pages || [],
          widgets: data.widgets || {},
          media: data.media || [],
          links: data.links || [],
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
      }),
    }
  )
);

// Helper function to get default widget props
const getDefaultWidgetProps = (type) => {
  switch (type) {
    case 'richText':
      return { content: '<p>Click to edit text...</p>' };
    case 'image':
      return { src: '', alt: '', width: '100%', height: 'auto' };
    case 'button':
      return { label: 'Click me', link: '', target: '_self' };
    default:
      return {};
  }
};

export default useCMSStore;
