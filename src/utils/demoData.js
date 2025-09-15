// Demo data for initial CMS setup
export const createDemoData = () => {
  const demoPageId = 'demo-page-1';
  const demoWidget1Id = 'demo-widget-1';
  const demoWidget2Id = 'demo-widget-2';
  const demoWidget3Id = 'demo-widget-3';

  return {
    pages: [
      {
        id: demoPageId,
        title: 'Welcome to Your CMS',
        slug: 'welcome-to-your-cms',
        widgets: [demoWidget1Id, demoWidget2Id, demoWidget3Id]
      }
    ],
    widgets: {
      [demoWidget1Id]: {
        id: demoWidget1Id,
        type: 'richText',
        props: {
          content: '<h1>Welcome to Your CMS!</h1><p>This is a demo page to show you how the CMS works. You can edit this text by selecting it and using the rich text editor.</p><p>Try adding more widgets from the left panel!</p>'
        },
        layout: { x: 0, y: 0, width: 'auto', height: 'auto' }
      },
      [demoWidget2Id]: {
        id: demoWidget2Id,
        type: 'button',
        props: {
          label: 'Get Started',
          link: 'https://github.com',
          target: '_blank'
        },
        layout: { x: 0, y: 1, width: 'auto', height: 'auto' }
      },
      [demoWidget3Id]: {
        id: demoWidget3Id,
        type: 'richText',
        props: {
          content: '<h2>Features</h2><ul><li>Drag and drop widgets</li><li>Rich text editing</li><li>Media management</li><li>Link management</li><li>Preview mode</li><li>Export/Import data</li></ul>'
        },
        layout: { x: 0, y: 2, width: 'auto', height: 'auto' }
      }
    },
    media: [],
    links: [
      {
        id: 'demo-link-1',
        title: 'GitHub',
        url: 'https://github.com',
        target: '_blank'
      },
      {
        id: 'demo-link-2',
        title: 'Documentation',
        url: 'https://reactjs.org',
        target: '_blank'
      }
    ]
  };
};

export const hasDemoData = () => {
  const stored = localStorage.getItem('cms-storage');
  return stored && JSON.parse(stored).pages?.length > 0;
};
