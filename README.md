# CMS - Content Management System

A frontend-only Content Management System built with React, Vite, and Tailwind CSS.

## Features

- **Pages Management**: Create, edit, delete, and organize pages
- **Widget System**: Drag and drop widgets (Rich Text, Image, Button)
- **Media Library**: Upload and manage images
- **Link Manager**: Create and manage reusable links
- **Preview Mode**: Preview pages in read-only mode
- **Local Storage**: All data persists in browser localStorage
- **Export/Import**: Backup and restore your CMS data

## Tech Stack

- React 19 with hooks and functional components
- React Router for navigation
- Zustand for state management
- dnd-kit for drag and drop functionality
- React Quill for rich text editing
- Tailwind CSS for styling
- UUID for unique IDs
- IndexedDB support for media storage

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Sidebar, Topbar)
│   ├── widgets/         # Widget-related components
│   └── ui/              # Reusable UI components
├── pages/               # Page components
├── store/               # Zustand store
├── widgets/             # Individual widget components
├── utils/               # Utility functions
└── hooks/               # Custom React hooks
```

## Usage

1. **Create Pages**: Go to the Pages section and click "Create New Page"
2. **Edit Pages**: Click "Edit" on any page to open the page editor
3. **Add Widgets**: Drag widgets from the left panel to your page
4. **Edit Widgets**: Click on any widget to select and edit its properties
5. **Upload Media**: Go to Media Library to upload images
6. **Manage Links**: Use Link Manager to create reusable links
7. **Preview**: Click "Preview" to see how your page looks to visitors

## Widget Types

- **Rich Text**: WYSIWYG text editor with formatting options
- **Image**: Display images with customizable dimensions
- **Button**: Interactive buttons with links

## Data Persistence

All data is automatically saved to localStorage. You can also:
- Export your data as JSON
- Import previously exported data
- All changes are saved automatically

## Development

This is a scaffold/skeleton implementation. You can extend it by:
- Adding new widget types
- Implementing more advanced drag and drop
- Adding more styling options
- Integrating with a backend API
- Adding user authentication
- Implementing page templates

## License

MIT License
