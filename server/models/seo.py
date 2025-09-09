from pydantic import BaseModel

class KeywordRequest(BaseModel):
    keyword: str

class KeywordResponse(BaseModel):
    keyword: str
    volume: int
    difficulty: str
