// Demo data for initial CMS setup - structured like a real API response
export const createDemoData = () => {
  const demoPageId = 'demo-page-1';
  const demoWidget1Id = 'demo-widget-1';
  const demoWidget2Id = 'demo-widget-2';
  const demoWidget3Id = 'demo-widget-3';
  const demoWidget4Id = 'demo-widget-4';
  const demoWidget5Id = 'demo-widget-5';

  return {
    success: true,
    message: "Data loaded successfully",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    data: {
      pages: [
        {
          id: demoPageId,
          title: 'Welcome to Your Contento',
          slug: 'welcome-to-your-contento',
          status: 'published',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: new Date().toISOString(),
          author: {
            id: 'user-1',
            name: 'Admin User',
            email: 'admin@example.com'
          },
          meta: {
            description: 'Welcome page for the enhanced CMS',
            keywords: ['cms', 'content', 'management'],
            seo_title: 'Enhanced CMS - Welcome'
          },
          widgets: [demoWidget1Id, demoWidget2Id, demoWidget3Id, demoWidget4Id, demoWidget5Id],
          settings: {
            layout: 'default',
            theme: 'light',
            show_header: true,
            show_footer: true
          }
        }
      ],
      widgets: {
        [demoWidget1Id]: {
          id: demoWidget1Id,
          type: 'heading',
          page_id: demoPageId,
          order: 0,
          props: {
            level: 1,
            text: 'Welcome to Your Contents!',
            alignment: 'center',
            color: '#1f2937',
            font_size: '3xl',
            font_weight: 'bold'
          },
          layout: { 
            x: 0, 
            y: 0, 
            width: 'auto', 
            height: 'auto',
            margin: { top: 0, right: 0, bottom: 16, left: 0 },
            padding: { top: 0, right: 0, bottom: 0, left: 0 }
          },
          created_at: '2024-01-15T10:30:00Z',
          updated_at: new Date().toISOString()
        },
        [demoWidget2Id]: {
          id: demoWidget2Id,
          type: 'richText',
          page_id: demoPageId,
          order: 1,
          props: {
            content: '<p>This is a demo page showcasing the enhanced CMS features. You can now:</p><ul><li>Drag and drop widgets with visual feedback</li><li>Edit widgets inline with better controls</li><li>Use a floating toolbar for quick actions</li><li>Add more widget types like headings, spacers, and dividers</li><li>Search and categorize widgets in the palette</li></ul>',
            text_align: 'left',
            font_size: 'base',
            line_height: 'relaxed'
          },
          layout: { 
            x: 0, 
            y: 1, 
            width: 'auto', 
            height: 'auto',
            margin: { top: 16, right: 0, bottom: 16, left: 0 },
            padding: { top: 0, right: 0, bottom: 0, left: 0 }
          },
          created_at: '2024-01-15T10:30:00Z',
          updated_at: new Date().toISOString()
        },
        [demoWidget3Id]: {
          id: demoWidget3Id,
          type: 'button',
          page_id: demoPageId,
          order: 2,
          props: {
            label: 'Get Started',
            link: 'https://github.com',
            target: '_blank',
            variant: 'primary',
            size: 'md',
            color: '#3b82f6',
            background_color: '#3b82f6',
            text_color: '#ffffff',
            border_radius: 'md',
            padding: { top: 12, right: 24, bottom: 12, left: 24 }
          },
          layout: { 
            x: 0, 
            y: 2, 
            width: 'auto', 
            height: 'auto',
            margin: { top: 16, right: 0, bottom: 16, left: 0 },
            padding: { top: 0, right: 0, bottom: 0, left: 0 }
          },
          created_at: '2024-01-15T10:30:00Z',
          updated_at: new Date().toISOString()
        },
        [demoWidget4Id]: {
          id: demoWidget4Id,
          type: 'spacer',
          page_id: demoPageId,
          order: 3,
          props: {
            height: 60,
            background_color: 'transparent',
            border_style: 'none'
          },
          layout: { 
            x: 0, 
            y: 3, 
            width: 'auto', 
            height: 60,
            margin: { top: 16, right: 0, bottom: 16, left: 0 },
            padding: { top: 0, right: 0, bottom: 0, left: 0 }
          },
          created_at: '2024-01-15T10:30:00Z',
          updated_at: new Date().toISOString()
        },
        [demoWidget5Id]: {
          id: demoWidget5Id,
          type: 'divider',
          page_id: demoPageId,
          order: 4,
          props: {
            style: 'dashed',
            thickness: 2,
            color: '#3b82f6',
            width: '100%',
            opacity: 0.8
          },
          layout: { 
            x: 0, 
            y: 4, 
            width: 'auto', 
            height: 'auto',
            margin: { top: 16, right: 0, bottom: 16, left: 0 },
            padding: { top: 0, right: 0, bottom: 0, left: 0 }
          },
          created_at: '2024-01-15T10:30:00Z',
          updated_at: new Date().toISOString()
        }
      },
      media: [
        {
          id: 'media-1',
          filename: 'hero-image.jpg',
          original_name: 'hero-image.jpg',
          url: '/media/hero-image.jpg',
          thumbnail_url: '/media/thumbnails/hero-image.jpg',
          mime_type: 'image/jpeg',
          size: 245760,
          width: 1920,
          height: 1080,
          alt_text: 'Hero image for the CMS',
          caption: 'Welcome to our CMS',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: new Date().toISOString(),
          uploaded_by: {
            id: 'user-1',
            name: 'Admin User'
          },
          tags: ['hero', 'welcome', 'cms']
        }
      ],
      links: [
        {
          id: 'demo-link-1',
          title: 'GitHub',
          url: 'https://github.com',
          target: '_blank',
          rel: 'noopener noreferrer',
          type: 'external',
          status: 'active',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: new Date().toISOString(),
          created_by: {
            id: 'user-1',
            name: 'Admin User'
          }
        },
        {
          id: 'demo-link-2',
          title: 'Documentation',
          url: 'https://reactjs.org',
          target: '_blank',
          rel: 'noopener noreferrer',
          type: 'external',
          status: 'active',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: new Date().toISOString(),
          created_by: {
            id: 'user-1',
            name: 'Admin User'
          }
        }
      ],
      users: [
        {
          id: 'user-1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          avatar_url: '/avatars/admin.jpg',
          created_at: '2024-01-15T10:30:00Z',
          last_login: new Date().toISOString(),
          status: 'active'
        }
      ],
      settings: {
        site_name: 'Enhanced CMS',
        site_description: 'A modern content management system',
        site_url: 'https://cms.example.com',
        default_language: 'en',
        timezone: 'UTC',
        date_format: 'YYYY-MM-DD',
        time_format: '24h',
        theme: {
          primary_color: '#3b82f6',
          secondary_color: '#6b7280',
          background_color: '#ffffff',
          text_color: '#1f2937'
        },
        features: {
          drag_and_drop: true,
          real_time_preview: true,
          media_library: true,
          link_manager: true,
          export_import: true
        }
      }
    },
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_items: 1,
      items_per_page: 10
    },
    meta: {
      api_version: 'v1',
      request_id: 'req_' + Math.random().toString(36).substr(2, 9),
      response_time: '45ms'
    }
  };
};

// Helper function to check if demo data exists
export const hasDemoData = () => {
  const stored = localStorage.getItem('cms-storage');
  return stored && JSON.parse(stored).pages?.length > 0;
};

// Helper function to extract data from API response (for future backend integration)
export const extractDataFromResponse = (apiResponse) => {
  if (apiResponse.success && apiResponse.data) {
    return {
      pages: apiResponse.data.pages || [],
      widgets: apiResponse.data.widgets || {},
      media: apiResponse.data.media || [],
      links: apiResponse.data.links || [],
      users: apiResponse.data.users || [],
      settings: apiResponse.data.settings || {}
    };
  }
  return {
    pages: [],
    widgets: {},
    media: [],
    links: [],
    users: [],
    settings: {}
  };
};

// Helper function to create API request payload
export const createApiPayload = (data) => {
  return {
    data: data,
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  };
};

// Mock API response structure for future backend integration
export const mockApiResponse = {
  success: true,
  message: "Operation completed successfully",
  timestamp: new Date().toISOString(),
  version: "1.0.0",
  data: {},
  pagination: {
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10
  },
  meta: {
    api_version: 'v1',
    request_id: '',
    response_time: '0ms'
  }
};
