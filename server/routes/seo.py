# routes/seo.py
from fastapi import APIRouter
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from services.seo_service import analyze_keyword, analyze_url

router = APIRouter(
    prefix="/api",
    tags=["SEO"]
)

# -------------------------
# Keyword Models
# -------------------------
class KeywordRequest(BaseModel):
    keyword: str

class KeywordResponse(BaseModel):
    keyword: str
    search_volume: int
    competition: float
    related_keywords: List[str]

@router.post("/keyword", response_model=KeywordResponse)
async def keyword_analysis(request: KeywordRequest):
    return analyze_keyword(request.keyword)

# -------------------------
# URL Analysis Models
# -------------------------
class LinksModel(BaseModel):
    internal: List[str] = []
    external: List[str] = []
    broken: List[str] = []
    nofollow: List[str] = []
    mailto: List[str] = []
    tel: List[str] = []

class MetaTagsModel(BaseModel):
    description: Optional[str] = None
    keywords: Optional[str] = None

class ContentModel(BaseModel):
    word_count: Optional[int] = None
    image_count: Optional[int] = None
    images_without_alt: Optional[List[str]] = []
    images_missing_dimensions: Optional[List[str]] = []
    images_long_names: Optional[List[str]] = []

class AnalyzeRequest(BaseModel):
    url: str

class AnalyzeResponse(BaseModel):
    title: str
    metaTags: Optional[MetaTagsModel] = None
    headings: Optional[Dict[str, List[str]]] = None
    content: Optional[ContentModel] = None
    links: LinksModel = LinksModel()
    structured_data: Optional[List[Any]] = []
    google_scores: Optional[Dict[str, Any]] = None
    score: Optional[int] = None
    keywords: Optional[List[str]] = []

# -------------------------
# URL SEO Analysis Endpoint
# -------------------------
@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_website(request: AnalyzeRequest):
    return await analyze_url(request.url)


