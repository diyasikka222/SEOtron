from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict
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
class AnalyzeRequest(BaseModel):
    url: str

class AnalyzeResponse(BaseModel):
    title: str
    metaTags: Dict[str, str]
    score: int
    keywords: List[str]
    links: List[str]

# -------------------------
# URL SEO Analysis Endpoint
# -------------------------
@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_website(request: AnalyzeRequest):
    """
    Analyze a website URL and return SEO metrics:
    title, meta tags, score, keywords, links.
    """
    return analyze_url(request.url)
