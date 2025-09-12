# server/services/seo_service.py
from bs4 import BeautifulSoup
import requests

def analyze_keyword(keyword: str):
    # Dummy keyword analysis
    return {
        "keyword": keyword,
        "search_volume": 1200,
        "competition": 0.75,
        "related_keywords": [f"{keyword} example", f"{keyword} tutorial"]
    }

def analyze_url(url: str):
    # Dummy URL SEO analysis
    try:
        res = requests.get(url, timeout=5)
        soup = BeautifulSoup(res.text, "html.parser")
        title = soup.title.string if soup.title else "No Title"
        description = soup.find("meta", attrs={"name":"description"})
        description = description["content"] if description else ""
        keywords = [kw.strip() for kw in (soup.find("meta", attrs={"name":"keywords"}) or {}).get("content", "").split(",") if kw] or ["example", "SEO"]
        links = [a["href"] for a in soup.find_all("a", href=True)][:10]
        score = 80  # dummy score
        return {
            "title": title,
            "metaTags": {"description": description, "keywords": ",".join(keywords)},
            "score": score,
            "keywords": keywords,
            "links": links
        }
    except Exception as e:
        return {
            "title": "Error fetching URL",
            "metaTags": {},
            "score": 0,
            "keywords": [],
            "links": []
        }
