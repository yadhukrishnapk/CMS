# 🚀 Enhanced CMS - ReactBricks-Style Content Management System

A modern, ReactBricks-inspired Content Management System built with React, Vite, and Tailwind CSS. Features advanced drag-and-drop, inline editing, and a professional user interface.

## ✨ Features

### �� **Advanced Drag & Drop**
- **Visual feedback** during drag operations
- **Drop zones** with clear indicators
- **Smooth animations** and transitions
- **Widget reordering** with visual cues

### 🧩 **Enhanced Widget System**
- **Rich Text Editor** with React Quill
- **Image Widget** with URL input and dimensions
- **Button Widget** with link management
- **Heading Widget** with levels and alignment
- **Spacer Widget** for vertical spacing
- **Divider Widget** with customizable styles

### 🎯 **Professional UI/UX**
- **Floating Toolbar** for quick actions
- **Enhanced Widget Palette** with search and categories
- **Properties Panel** for detailed widget editing
- **Visual Selection** with overlay indicators
- **Responsive Design** for all screen sizes

### 📱 **Core Functionality**
- **Pages Management** - Create, edit, delete, and organize pages
- **Media Library** - Upload, preview, and manage images
- **Link Manager** - Create and manage reusable links
- **Preview Mode** - Read-only page preview
- **Export/Import** - Backup and restore your data
- **Local Storage** - Automatic data persistence

## 🛠️ Tech Stack

- **React 19** with hooks and functional components
- **React Router** for navigation
- **Zustand** for state management with persistence
- **dnd-kit** for advanced drag and drop functionality
- **React Quill** for rich text editing
- **Tailwind CSS** for modern styling
- **UUID** for unique IDs
- **IndexedDB** support for media storage

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/              # Layout components
│   │   ├── Layout.jsx       # Main layout wrapper
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   └── Topbar.jsx       # Top toolbar
│   └── widgets/             # Widget-related components
│       ├── AdvancedWidgetContainer.jsx    # Enhanced widget wrapper
│       ├── EnhancedWidgetPalette.jsx      # Advanced widget palette
│       ├── FloatingToolbar.jsx            # Quick actions toolbar
│       └── PropertiesPanel.jsx            # Widget properties editor
├── pages/                   # Page components
│   ├── EnhancedPageEditor.jsx    # Main page editor
│   ├── PagesList.jsx             # Pages management
│   ├── MediaLibrary.jsx          # Media management
│   ├── LinkManager.jsx           # Link management
│   └── Preview.jsx               # Page preview
├── widgets/                 # Individual widget components
│   ├── RichTextWidget.jsx   # Rich text editor
│   ├── ImageWidget.jsx      # Image display
│   ├── ButtonWidget.jsx     # Interactive buttons
│   ├── HeadingWidget.jsx    # Page headings
│   ├── SpacerWidget.jsx     # Vertical spacing
│   └── DividerWidget.jsx    # Content dividers
├── store/                   # Zustand store
│   └── useCMSStore.js       # Main state management
├── utils/                   # Utility functions
│   ├── storage.js           # LocalStorage utilities
│   └── demoData.js          # Demo data initialization
└── hooks/                   # Custom React hooks
    └── useDragAndDrop.js    # Drag and drop utilities
```

## 🎯 Usage Guide

### **Creating Pages**
1. Go to the **Pages** section
2. Click **"Create New Page"**
3. Enter a page title
4. Click **"Edit"** to open the page editor

### **Adding Widgets**
1. **From the Widget Palette:**
   - Click on any widget to add it to your page
   - Drag widgets to the canvas for more control
   - Use the search bar to find specific widgets
   - Filter by category (Content, Media, Interactive, Layout)

2. **Widget Types Available:**
   - **Rich Text** - WYSIWYG text editor
   - **Image** - Display images with controls
   - **Button** - Interactive call-to-action buttons
   - **Heading** - Page titles and headings (H1-H6)
   - **Spacer** - Add vertical spacing
   - **Divider** - Visual content separators

### **Editing Widgets**
1. **Click on any widget** to select it
2. **Use the Properties Panel** on the right to edit settings
3. **Inline editing** for text content
4. **Visual feedback** shows selected widgets

### **Managing Content**
1. **Media Library** - Upload and manage images
2. **Link Manager** - Create reusable links
3. **Preview Mode** - See how your page looks to visitors
4. **Export/Import** - Backup and restore your data

### **Advanced Features**
- **Floating Toolbar** - Quick actions for selected widgets
- **Widget Duplication** - Copy widgets with one click
- **Drag to Reorder** - Rearrange widgets by dragging
- **Visual Selection** - Clear indication of selected widgets
- **Responsive Design** - Works on all screen sizes

## 🎨 Customization

### **Adding New Widget Types**
1. Create a new widget component in `src/widgets/`
2. Add it to the `AdvancedWidgetContainer.jsx`
3. Update the `getDefaultWidgetProps` function in the store
4. Add it to the widget palette

### **Styling**
- All styles use **Tailwind CSS**
- Custom CSS classes in `src/index.css`
- Responsive design with mobile-first approach
- Dark/light theme support ready

### **State Management**
- **Zustand** store with persistence
- Automatic localStorage saving
- Export/import functionality
- Demo data initialization

## 🔧 Development

### **Available Scripts**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### **Key Features for Developers**
- **TypeScript ready** (can be added)
- **Hot reload** for development
- **ESLint** configuration
- **Vite** for fast builds
- **Modular architecture** for easy extension

## 🚀 Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to any static hosting service:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3
   - Any web server

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🎉 Demo

The application includes demo data to showcase all features. When you first load the CMS, you'll see a sample page with various widgets demonstrating the capabilities.

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
