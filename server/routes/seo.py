from fastapi import APIRouter
from models.seo import KeywordRequest, KeywordResponse
from services.seo_service import analyze_keyword

router = APIRouter()

@router.post("/keyword", response_model=KeywordResponse)
async def keyword_analysis(request: KeywordRequest):
    return analyze_keyword(request.keyword)
