from pydantic import BaseModel
from typing import List, Dict, Optional, Union

class MetaTags(BaseModel):
    description: str
    keywords: str
    robots: str
    canonical: str
    og_tags: Dict[str, str]

class Links(BaseModel):
    internal: List[str]
    external: List[str]
    broken: List[str]

class Content(BaseModel):
    word_count: int
    image_count: int
    images_without_alt: List[str]

class ResponseModel(BaseModel):
    title: str
    metaTags: MetaTags
    score: Optional[int]
    keywords: Optional[str]
    headings: Dict[str, List[str]]
    content: Content
    links: Links
    performance: Dict[str, float]
    structured_data: List[Dict]
    google_scores: Dict[str, Union[str, int]] 
