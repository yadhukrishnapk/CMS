"""
Example Python Backend Structure for CMS
This shows how your Python backend should be structured to work with the frontend
"""

from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

app = FastAPI(title="CMS API", version="1.0.0")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models matching the frontend structure
class Author(BaseModel):
    id: str
    name: str
    email: str

class PageMeta(BaseModel):
    description: Optional[str] = ""
    keywords: List[str] = []
    seo_title: Optional[str] = ""

class PageSettings(BaseModel):
    layout: str = "default"
    theme: str = "light"
    show_header: bool = True
    show_footer: bool = True

class Page(BaseModel):
    id: str
    title: str
    slug: str
    status: str = "draft"
    created_at: datetime
    updated_at: datetime
    author: Author
    meta: PageMeta
    widgets: List[str] = []
    settings: PageSettings

class WidgetLayout(BaseModel):
    x: int = 0
    y: int = 0
    width: str = "auto"
    height: str = "auto"
    margin: Dict[str, int] = {"top": 0, "right": 0, "bottom": 16, "left": 0}
    padding: Dict[str, int] = {"top": 0, "right": 0, "bottom": 0, "left": 0}

class Widget(BaseModel):
    id: str
    type: str
    page_id: str
    order: int = 0
    props: Dict[str, Any]
    layout: WidgetLayout
    created_at: datetime
    updated_at: datetime

class Media(BaseModel):
    id: str
    filename: str
    original_name: str
    url: str
    thumbnail_url: Optional[str] = None
    mime_type: str
    size: int
    width: Optional[int] = None
    height: Optional[int] = None
    alt_text: str = ""
    caption: str = ""
    created_at: datetime
    updated_at: datetime
    uploaded_by: Author
    tags: List[str] = []

class Link(BaseModel):
    id: str
    title: str
    url: str
    target: str = "_self"
    rel: str = ""
    type: str = "external"
    status: str = "active"
    created_at: datetime
    updated_at: datetime
    created_by: Author

class User(BaseModel):
    id: str
    name: str
    email: str
    role: str = "user"
    avatar_url: Optional[str] = None
    created_at: datetime
    last_login: Optional[datetime] = None
    status: str = "active"

class SiteSettings(BaseModel):
    site_name: str = "Enhanced CMS"
    site_description: str = "A modern content management system"
    site_url: str = "https://cms.example.com"
    default_language: str = "en"
    timezone: str = "UTC"
    date_format: str = "YYYY-MM-DD"
    time_format: str = "24h"
    theme: Dict[str, str] = {
        "primary_color": "#3b82f6",
        "secondary_color": "#6b7280",
        "background_color": "#ffffff",
        "text_color": "#1f2937"
    }
    features: Dict[str, bool] = {
        "drag_and_drop": True,
        "real_time_preview": True,
        "media_library": True,
        "link_manager": True,
        "export_import": True
    }

class Pagination(BaseModel):
    current_page: int = 1
    total_pages: int = 1
    total_items: int = 0
    items_per_page: int = 10

class ApiResponse(BaseModel):
    success: bool = True
    message: str = "Operation completed successfully"
    timestamp: datetime
    version: str = "1.0.0"
    data: Dict[str, Any] = {}
    pagination: Optional[Pagination] = None
    meta: Dict[str, Any] = {}

# API Endpoints

@app.get("/api/v1/pages", response_model=ApiResponse)
async def get_pages():
    """Get all pages"""
    # Your database logic here
    pages = []  # Fetch from database
    
    return ApiResponse(
        timestamp=datetime.now(),
        data={"pages": pages},
        pagination=Pagination(total_items=len(pages))
    )

@app.get("/api/v1/pages/{page_id}", response_model=ApiResponse)
async def get_page(page_id: str):
    """Get page by ID"""
    # Your database logic here
    page = None  # Fetch from database
    
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    
    return ApiResponse(
        timestamp=datetime.now(),
        data={"page": page}
    )

@app.post("/api/v1/pages", response_model=ApiResponse)
async def create_page(page_data: Page):
    """Create new page"""
    # Your database logic here
    page_data.id = str(uuid.uuid4())
    page_data.created_at = datetime.now()
    page_data.updated_at = datetime.now()
    
    # Save to database
    
    return ApiResponse(
        timestamp=datetime.now(),
        data={"page": page_data},
        message="Page created successfully"
    )

@app.put("/api/v1/pages/{page_id}", response_model=ApiResponse)
async def update_page(page_id: str, page_data: Page):
    """Update page"""
    # Your database logic here
    page_data.updated_at = datetime.now()
    
    # Update in database
    
    return ApiResponse(
        timestamp=datetime.now(),
        data={"page": page_data},
        message="Page updated successfully"
    )

@app.delete("/api/v1/pages/{page_id}", response_model=ApiResponse)
async def delete_page(page_id: str):
    """Delete page"""
    # Your database logic here
    # Delete from database
    
    return ApiResponse(
        timestamp=datetime.now(),
        message="Page deleted successfully"
    )

@app.get("/api/v1/pages/{page_id}/widgets", response_model=ApiResponse)
async def get_page_widgets(page_id: str):
    """Get all widgets for a page"""
    # Your database logic here
    widgets = {}  # Fetch from database
    
    return ApiResponse(
        timestamp=datetime.now(),
        data={"widgets": widgets}
    )

@app.post("/api/v1/widgets", response_model=ApiResponse)
async def create_widget(widget_data: Widget):
    """Create new widget"""
    # Your database logic here
    widget_data.id = str(uuid.uuid4())
    widget_data.created_at = datetime.now()
    widget_data.updated_at = datetime.now()
    
    # Save to database
    
    return ApiResponse(
        timestamp=datetime.now(),
        data={"widget": widget_data},
        message="Widget created successfully"
    )

@app.put("/api/v1/widgets/{widget_id}", response_model=ApiResponse)
async def update_widget(widget_id: str, widget_data: Widget):
    """Update widget"""
    # Your database logic here
    widget_data.updated_at = datetime.now()
    
    # Update in database
    
    return ApiResponse(
        timestamp=datetime.now(),
        data={"widget": widget_data},
        message="Widget updated successfully"
    )

@app.delete("/api/v1/widgets/{widget_id}", response_model=ApiResponse)
async def delete_widget(widget_id: str):
    """Delete widget"""
    # Your database logic here
    # Delete from database
    
    return ApiResponse(
        timestamp=datetime.now(),
        message="Widget deleted successfully"
    )

@app.post("/api/v1/pages/{page_id}/widgets/reorder", response_model=ApiResponse)
async def reorder_widgets(page_id: str, widget_ids: List[str]):
    """Reorder widgets on a page"""
    # Your database logic here
    # Update widget order in database
    
    return ApiResponse(
        timestamp=datetime.now(),
        message="Widgets reordered successfully"
    )

@app.post("/api/v1/media/upload", response_model=ApiResponse)
async def upload_media(file: UploadFile = File(...)):
    """Upload media file"""
    # Your file handling logic here
    # Save file and create media record
    
    media = Media(
        id=str(uuid.uuid4()),
        filename=file.filename,
        original_name=file.filename,
        url=f"/media/{file.filename}",
        mime_type=file.content_type,
        size=0,  # Get actual file size
        created_at=datetime.now(),
        updated_at=datetime.now(),
        uploaded_by=Author(id="user-1", name="Current User", email="user@example.com")
    )
    
    return ApiResponse(
        timestamp=datetime.now(),
        data={"media": media},
        message="Media uploaded successfully"
    )

@app.get("/api/v1/links", response_model=ApiResponse)
async def get_links():
    """Get all links"""
    # Your database logic here
    links = []  # Fetch from database
    
    return ApiResponse(
        timestamp=datetime.now(),
        data={"links": links}
    )

@app.post("/api/v1/links", response_model=ApiResponse)
async def create_link(link_data: Link):
    """Create new link"""
    # Your database logic here
    link_data.id = str(uuid.uuid4())
    link_data.created_at = datetime.now()
    link_data.updated_at = datetime.now()
    
    # Save to database
    
    return ApiResponse(
        timestamp=datetime.now(),
        data={"link": link_data},
        message="Link created successfully"
    )

@app.get("/api/v1/settings", response_model=ApiResponse)
async def get_settings():
    """Get site settings"""
    # Your database logic here
    settings = SiteSettings()  # Fetch from database
    
    return ApiResponse(
        timestamp=datetime.now(),
        data={"settings": settings}
    )

@app.put("/api/v1/settings", response_model=ApiResponse)
async def update_settings(settings_data: SiteSettings):
    """Update site settings"""
    # Your database logic here
    # Update settings in database
    
    return ApiResponse(
        timestamp=datetime.now(),
        data={"settings": settings_data},
        message="Settings updated successfully"
    )

@app.get("/api/v1/export", response_model=ApiResponse)
async def export_data(format: str = "json"):
    """Export all data"""
    # Your export logic here
    # Gather all data and return in requested format
    
    export_data = {
        "pages": [],
        "widgets": {},
        "media": [],
        "links": [],
        "users": [],
        "settings": {}
    }
    
    return ApiResponse(
        timestamp=datetime.now(),
        data=export_data,
        message="Data exported successfully"
    )

@app.post("/api/v1/import", response_model=ApiResponse)
async def import_data(data: Dict[str, Any]):
    """Import data"""
    # Your import logic here
    # Process and save imported data
    
    return ApiResponse(
        timestamp=datetime.now(),
        message="Data imported successfully"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
