# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import users, seo  # ✅ Import routers
from schemas import ResponseModel  # ✅ Import Pydantic models

# -----------------------------
# Create FastAPI app
# -----------------------------
app = FastAPI(
    title="SEOtron API",
    version="1.0",
    description="Backend for SEOtron project"
)

# -----------------------------
# Middleware (CORS for frontend)
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:5173"] for stricter security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Routers
# -----------------------------
# Users-related endpoints (/users/...)
app.include_router(users.router, prefix="/users", tags=["Users"])

# SEO-related endpoints (/api/...)
# Ensure seo.py endpoints use response_model=ResponseModel
app.include_router(seo.router)  # prefix="/api" is already inside seo.py

# -----------------------------
# Root + Test endpoints
# -----------------------------
@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to SEOtron API!"}

@app.get("/api/hello", tags=["Test"])
async def hello():
    return {"message": "Hello from FastAPI"}

# -----------------------------
# Example test endpoint using ResponseModel
# -----------------------------
@app.get("/api/example", response_model=ResponseModel, tags=["Test"])
async def example_response():
    """
    Example endpoint to demonstrate Pydantic response validation.
    """
    return {
        "title": "YouTube",
        "metaTags": {
            "description": "Enjoy the videos and music that you love, upload original content and share it all with friends, family and the world on YouTube.",
            "keywords": "video,sharing,camera phone,video phone,free,upload",
            "robots": "",
            "canonical": "https://www.youtube.com/",
            "og_tags": {
                "og:image": "https://www.youtube.com/img/desktop/yt_1200.png"
            }
        },
        "score": 95,
        "keywords": "video,sharing",
        "headings": {"h1": [], "h2": [], "h3": []},
        "content": {
            "word_count": 11,
            "image_count": 0,
            "images_without_alt": []
        },
        "links": {
            "internal": [
                "https://www.youtube.com/",
                "https://www.youtube.com/about/"
            ],
            "external": ["https://developers.google.com/youtube"],
            "broken": []
        },
        "performance": {
            "page_size_kb": 649.6,
            "load_time_ms": 296,
            "https": True
        },
        "structured_data": [],
        "google_scores": {
            "error": "Expecting value: line 1 column 1 (char 0)"
        }
    }
