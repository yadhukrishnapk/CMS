# Backend Integration Guide

This document explains how to integrate the CMS frontend with a Python backend.

## API Response Structure

The frontend expects API responses in the following format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "data": {
    "pages": [...],
    "widgets": {...},
    "media": [...],
    "links": [...],
    "users": [...],
    "settings": {...}
  },
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_items": 0,
    "items_per_page": 10
  },
  "meta": {
    "api_version": "v1",
    "request_id": "req_abc123",
    "response_time": "45ms"
  }
}
```

## Data Models

### Page Model
```json
{
  "id": "page-uuid",
  "title": "Page Title",
  "slug": "page-slug",
  "status": "published|draft",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "author": {
    "id": "user-uuid",
    "name": "Author Name",
    "email": "author@example.com"
  },
  "meta": {
    "description": "Page description",
    "keywords": ["keyword1", "keyword2"],
    "seo_title": "SEO Title"
  },
  "widgets": ["widget-id-1", "widget-id-2"],
  "settings": {
    "layout": "default",
    "theme": "light",
    "show_header": true,
    "show_footer": true
  }
}
```

### Widget Model
```json
{
  "id": "widget-uuid",
  "type": "richText|image|button|heading|spacer|divider",
  "page_id": "page-uuid",
  "order": 0,
  "props": {
    // Widget-specific properties
  },
  "layout": {
    "x": 0,
    "y": 0,
    "width": "auto",
    "height": "auto",
    "margin": {"top": 0, "right": 0, "bottom": 16, "left": 0},
    "padding": {"top": 0, "right": 0, "bottom": 0, "left": 0}
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Media Model
```json
{
  "id": "media-uuid",
  "filename": "image.jpg",
  "original_name": "image.jpg",
  "url": "/media/image.jpg",
  "thumbnail_url": "/media/thumbnails/image.jpg",
  "mime_type": "image/jpeg",
  "size": 245760,
  "width": 1920,
  "height": 1080,
  "alt_text": "Image description",
  "caption": "Image caption",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "uploaded_by": {
    "id": "user-uuid",
    "name": "User Name"
  },
  "tags": ["tag1", "tag2"]
}
```

### Link Model
```json
{
  "id": "link-uuid",
  "title": "Link Title",
  "url": "https://example.com",
  "target": "_self|_blank",
  "rel": "noopener noreferrer",
  "type": "external|internal",
  "status": "active|inactive",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "created_by": {
    "id": "user-uuid",
    "name": "User Name"
  }
}
```

## Required API Endpoints

### Pages
- `GET /api/v1/pages` - Get all pages
- `GET /api/v1/pages/{id}` - Get page by ID
- `POST /api/v1/pages` - Create new page
- `PUT /api/v1/pages/{id}` - Update page
- `DELETE /api/v1/pages/{id}` - Delete page
- `POST /api/v1/pages/{id}/publish` - Publish page
- `POST /api/v1/pages/{id}/unpublish` - Unpublish page

### Widgets
- `GET /api/v1/pages/{page_id}/widgets` - Get widgets for page
- `GET /api/v1/widgets/{id}` - Get widget by ID
- `POST /api/v1/widgets` - Create new widget
- `PUT /api/v1/widgets/{id}` - Update widget
- `DELETE /api/v1/widgets/{id}` - Delete widget
- `POST /api/v1/pages/{page_id}/widgets/reorder` - Reorder widgets
- `POST /api/v1/widgets/{id}/duplicate` - Duplicate widget

### Media
- `GET /api/v1/media` - Get all media
- `GET /api/v1/media/{id}` - Get media by ID
- `POST /api/v1/media/upload` - Upload media file
- `PUT /api/v1/media/{id}` - Update media metadata
- `DELETE /api/v1/media/{id}` - Delete media
- `POST /api/v1/media/{id}/thumbnail` - Generate thumbnail

### Links
- `GET /api/v1/links` - Get all links
- `GET /api/v1/links/{id}` - Get link by ID
- `POST /api/v1/links` - Create new link
- `PUT /api/v1/links/{id}` - Update link
- `DELETE /api/v1/links/{id}` - Delete link
- `POST /api/v1/links/validate` - Validate link URL

### Settings
- `GET /api/v1/settings` - Get site settings
- `PUT /api/v1/settings` - Update site settings
- `POST /api/v1/settings/reset` - Reset settings to default

### Export/Import
- `GET /api/v1/export` - Export all data
- `POST /api/v1/import` - Import data
- `GET /api/v1/export/history` - Get export history
- `GET /api/v1/export/{id}/download` - Download export file

## Frontend Integration

### Environment Variables
Set these environment variables in your frontend:

```env
REACT_APP_API_URL=http://localhost:8000/api/v1
```

### Using the API Service
The frontend includes a complete API service in `src/services/apiService.js`:

```javascript
import apiService from './services/apiService';

// Get all pages
const pages = await apiService.pages.getAll();

// Create a new page
const newPage = await apiService.pages.create({
  title: 'New Page',
  slug: 'new-page',
  // ... other page data
});

// Upload media
const media = await apiService.media.upload(file, {
  alt_text: 'Image description'
});
```

### Error Handling
The API service includes comprehensive error handling:

```javascript
try {
  const data = await apiService.pages.getAll();
} catch (error) {
  const errorInfo = apiService.handleApiError(error);
  console.error('API Error:', errorInfo.message);
}
```

## Python Backend Example

See `backend-example.py` for a complete FastAPI implementation that matches the expected API structure.

### Key Features:
- FastAPI framework
- Pydantic models for data validation
- CORS middleware for frontend integration
- Comprehensive API endpoints
- Proper error handling
- File upload support
- WebSocket support for real-time updates

### Database Integration
The example shows the API structure. You'll need to integrate with your preferred database:

- **SQLAlchemy** for SQL databases
- **MongoDB** for NoSQL databases
- **Redis** for caching
- **PostgreSQL/MySQL** for production

### Authentication
Add authentication middleware to protect your API:

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user(token: str = Depends(security)):
    # Validate token and return user
    pass
```

## Deployment

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or any static hosting

### Backend
- Use Docker for containerization
- Deploy to AWS, Google Cloud, or any cloud provider
- Use nginx for reverse proxy
- Set up SSL certificates

## Real-time Updates

The frontend supports WebSocket connections for real-time updates:

```javascript
const ws = apiService.createWebSocketConnection(token);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle real-time updates
};
```

## Testing

### Frontend Testing
```bash
npm test
```

### Backend Testing
```python
import pytest
from fastapi.testclient import TestClient

client = TestClient(app)

def test_get_pages():
    response = client.get("/api/v1/pages")
    assert response.status_code == 200
```

This structure ensures seamless integration between your React frontend and Python backend while maintaining the ReactBricks-style user experience.
