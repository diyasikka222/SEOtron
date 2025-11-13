from typing import Any, Dict, List, Optional

from database import get_user_reports, save_seo_report
from fastapi import APIRouter, Depends

# ✨ FIX: Cleaned up unused and potentially crashing imports
# from models.seo import ResponseModel
from models.user import User
from pydantic import BaseModel
from services.seo_service import analyze_keyword, analyze_url
from utils.auth import get_current_user

router = APIRouter(prefix="/api", tags=["SEO"])


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
# Dashboard / User Progress
# -------------------------
@router.get("/dashboard/progress")
async def get_progress(current_user: User = Depends(get_current_user)):
    # FIX: Corrected parameters passed to get_user_reports
    analyses = get_user_reports(current_user["_id"])
    total_audits = len(analyses)

    if total_audits == 0:
        return {"message": "No data yet", "average_score": 0, "total_audits": 0}

    # Compute average score
    scores = [
        a["data"].get("score", 0)
        for a in analyses
        if a["data"].get("score") is not None
    ]
    avg_score = sum(scores) / len(scores) if scores else 0

    return {
        "average_score": avg_score,
        "total_audits": total_audits,
        "analyses": [
            {
                "url": a["url"],
                "score": a["data"].get("score", 0),
                "created_at": a.get("created_at"),
            }
            for a in analyses
        ],
    }


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
    robots: Optional[str] = None
    canonical: Optional[str] = None
    favicon: Optional[str] = None


class ContentModel(BaseModel):
    word_count: Optional[int] = None
    paragraph_count: Optional[int] = None
    image_count: Optional[int] = None
    images_without_alt: Optional[List[str]] = []
    images_missing_dimensions: Optional[List[str]] = []
    images_long_names: Optional[List[str]] = []


class PerformanceModel(BaseModel):
    page_size_kb: Optional[float] = None
    https: Optional[bool] = None
    gzip_enabled: Optional[bool] = None
    cache_control: Optional[str] = None
    expires: Optional[str] = None


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
    google_scores: Optional[Dict[str, Any]] = None
    score: Optional[int] = None
    keywords: Optional[List[str]] = []
    error: Optional[str] = None


# -------------------------
# URL SEO Analysis Endpoint
# -------------------------
@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_website(
    request: AnalyzeRequest, current_user: User = Depends(get_current_user)
):
    result = await analyze_url(request.url)

    if "error" in result:
        return result

    save_seo_report(current_user["_id"], request.url, result)
    return result
