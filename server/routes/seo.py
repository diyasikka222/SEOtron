# routes/seo.py
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from services.seo_service import analyze_keyword, analyze_url  # your service functions
from schemas import ResponseModel  # ✅ Import the new Pydantic model

router = APIRouter(
    prefix="/api",
    tags=["SEO"]
)

# -------------------------
# Keyword Analysis Models
# -------------------------
class KeywordRequest(BaseModel):
    keyword: str

class KeywordResponse(BaseModel):
    keyword: str
    search_volume: int
    competition: float
    related_keywords: List[str]

# -------------------------
# Keyword Analysis Endpoint
# -------------------------
@router.post("/keyword", response_model=KeywordResponse)
async def keyword_analysis(request: KeywordRequest):
    """
    Analyze a single keyword and return SEO metrics.
    """
    return analyze_keyword(request.keyword)

# -------------------------
# URL SEO Analysis Models
# -------------------------
class AnalyzeRequest(BaseModel):
    url: str

# -------------------------
# URL SEO Analysis Endpoint using ResponseModel
# -------------------------
@router.post("/analyze", response_model=ResponseModel)
async def analyze_website(request: AnalyzeRequest):
    """
    Analyze a website URL and return SEO metrics using ResponseModel:
    title, meta tags, score, keywords, headings, content, links, performance, structured_data, google_scores
    """
    # Call your service function
    data = analyze_url(request.url)

    # Ensure data matches ResponseModel structure
    response_data = {
        "title": data.get("title", ""),
        "metaTags": data.get("metaTags", {
            "description": "",
            "keywords": "",
            "robots": "",
            "canonical": "",
            "og_tags": {}
        }),
        "score": data.get("score", 0),
        "keywords": data.get("keywords", ""),
        "headings": data.get("headings", {"h1": [], "h2": [], "h3": []}),
        "content": data.get("content", {"word_count": 0, "image_count": 0, "images_without_alt": []}),
        "links": data.get("links", {"internal": [], "external": [], "broken": []}),
        "performance": data.get("performance", {"page_size_kb": 0, "load_time_ms": 0, "https": True}),
        "structured_data": data.get("structured_data", []),
        "google_scores": data.get("google_scores", {})
    }

    return response_data
