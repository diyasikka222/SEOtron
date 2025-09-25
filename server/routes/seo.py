from fastapi import APIRouter
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from services.seo_service import analyze_keyword, analyze_url  # your service functions

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
class LinksModel(BaseModel):
    internal: List[str] = []
    external: List[str] = []
    broken: List[str] = []

class MetaTagsModel(BaseModel):
    description: Optional[str] = None
    keywords: Optional[str] = None
    robots: Optional[str] = None
    canonical: Optional[str] = None
    og_tags: Optional[Dict[str, Any]] = None

class ContentModel(BaseModel):
    word_count: Optional[int] = None
    image_count: Optional[int] = None
    images_without_alt: Optional[List[str]] = []

class PerformanceModel(BaseModel):
    page_size_kb: Optional[float] = None
    load_time_ms: Optional[int] = None
    https: Optional[bool] = None

class GoogleScoresModel(BaseModel):
    seo_score: Optional[int] = None
    performance_score: Optional[int] = None
    best_practices: Optional[int] = None
    accessibility: Optional[int] = None
    error: Optional[str] = None

class AnalyzeRequest(BaseModel):
    url: str

class AnalyzeResponse(BaseModel):
    title: str
    metaTags: Optional[MetaTagsModel] = None
    headings: Optional[Dict[str, List[str]]] = None
    content: Optional[ContentModel] = None
    links: LinksModel = LinksModel()
    performance: Optional[PerformanceModel] = None
    structured_data: Optional[List[Any]] = []
    google_scores: Optional[GoogleScoresModel] = None
    score: Optional[int] = None
    keywords: Optional[List[str]] = []

# -------------------------
# URL SEO Analysis Endpoint
# -------------------------
@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_website(request: AnalyzeRequest):
    """
    Analyze a website URL and return SEO metrics:
    title, meta tags, headings, content stats, links, performance, structured data, Google scores.
    """
    return analyze_url(request.url)

