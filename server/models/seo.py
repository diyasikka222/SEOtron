from typing import Optional, Dict, List, Any
from pydantic import BaseModel


# -------------------------
# Meta Tags
# -------------------------
class MetaTags(BaseModel):
    description: Optional[str] = None
    keywords: Optional[str] = None
    robots: Optional[str] = None
    canonical: Optional[str] = None
    og_tags: Optional[Dict[str, str]] = None  # Open Graph tags


# -------------------------
# Headings
# -------------------------
class Headings(BaseModel):
    h1: Optional[List[str]] = []
    h2: Optional[List[str]] = []
    h3: Optional[List[str]] = []


# -------------------------
# Links
# -------------------------
class Links(BaseModel):
    internal: Optional[List[str]] = []
    external: Optional[List[str]] = []
    broken: Optional[List[str]] = []


# -------------------------
# Content
# -------------------------
class Content(BaseModel):
    word_count: Optional[int] = None
    readability_score: Optional[float] = None
    language: Optional[str] = None
    main_topics: Optional[List[str]] = None


# -------------------------
# Performance (Lighthouse/Custom)
# -------------------------
class Performance(BaseModel):
    speed_index: Optional[float] = None
    time_to_first_byte: Optional[float] = None
    mobile_friendly: Optional[bool] = None
    accessibility_score: Optional[float] = None


# -------------------------
# Google Scores
# -------------------------
class GoogleScores(BaseModel):
    performance: Optional[int] = None
    accessibility: Optional[int] = None
    best_practices: Optional[int] = None
    seo: Optional[int] = None


# -------------------------
# Final Response Model
# -------------------------
class ResponseModel(BaseModel):
    title: Optional[str] = None
    metaTags: Optional[MetaTags] = None
    headings: Optional[Headings] = None
    content: Optional[Content] = None
    links: Optional[Links] = None
    performance: Optional[Performance] = None
    structured_data: Optional[List[Dict[str, Any]]] = None
    google_scores: Optional[GoogleScores] = None
    score: Optional[int] = None
    keywords: Optional[List[str]] = None

