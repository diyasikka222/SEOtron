# routes/seo.py
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Optional, Any, Union
from services.seo_service import analyze_keyword, analyze_url
from schemas import ResponseModel

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
    data = analyze_url(request.url)

    # Safely map all fields to match ResponseModel
    response_data = {
        "title": data.get("title", ""),
        "metaTags": {
            "description": data.get("metaTags", {}).get("description", "") or "",
            "keywords": data.get("metaTags", {}).get("keywords", "") or "",
            "robots": data.get("metaTags", {}).get("robots", "") or "",
            "canonical": data.get("metaTags", {}).get("canonical", "") or "",
            "og_tags": data.get("metaTags", {}).get("og_tags", {}) or {}
        },
        "score": data.get("score", 0),
        "keywords": ", ".join(data.get("keywords", [])) if isinstance(data.get("keywords"), list) else data.get("keywords", ""),
        "headings": data.get("headings", {"h1": [], "h2": [], "h3": []}),
        "content": data.get("content", {"word_count": 0, "image_count": 0, "images_without_alt": []}),
        "links": data.get("links", {"internal": [], "external": [], "broken": []}),
        "performance": data.get("performance", {"page_size_kb": 0, "load_time_ms": 0, "https": True}),
        "structured_data": data.get("structured_data", []),
        "google_scores": {
            "seo_score": str(data.get("google_scores", {}).get("seo_score", "0")),
            "performance_score": str(data.get("google_scores", {}).get("performance_score", "0")),
            "best_practices": str(data.get("google_scores", {}).get("best_practices", "0")),
            "accessibility": str(data.get("google_scores", {}).get("accessibility", "0")),
        }
    }

    return response_data
