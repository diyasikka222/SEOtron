import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
import os
from dotenv import load_dotenv
import json

# -------------------- Load environment variables --------------------
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_PAGESPEED_API_KEY")

if not GOOGLE_API_KEY:
    print("⚠️ WARNING: GOOGLE_PAGESPEED_API_KEY is not set! Check your .env file.")
else:
    print("✅ Google API key loaded successfully")


# -------------------- Keyword Analysis (dummy for now) --------------------
def analyze_keyword(keyword: str):
    """Dummy keyword analysis (placeholder)."""
    return {
        "keyword": keyword,
        "search_volume": 1200,
        "competition": 0.75,
        "related_keywords": [f"{keyword} example", f"{keyword} tutorial"]
    }


# -------------------- Google PageSpeed Insights --------------------
def get_pagespeed_insights(url: str, strategy: str = "desktop"):
    """Get SEO & performance scores from Google PageSpeed Insights API."""
    if not GOOGLE_API_KEY:
        return {"error": "API key not set"}

    endpoint = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    params = {"url": url, "strategy": strategy, "key": GOOGLE_API_KEY}

    try:
        res = requests.get(endpoint, params=params, timeout=15)
        data = res.json()

        lighthouse = data.get("lighthouseResult", {}).get("categories", {})

        # Safely extract score or None if missing
        def safe_score(category: str):
            cat = lighthouse.get(category)
            if cat and isinstance(cat.get("score"), (int, float)):
                return int(cat["score"] * 100)
            return None

        return {
            "seo_score": safe_score("seo"),
            "performance_score": safe_score("performance"),
            "best_practices": safe_score("best-practices"),
            "accessibility": safe_score("accessibility"),
        }

    except Exception as e:
        return {"error": str(e)}


# -------------------- URL Analysis --------------------
def analyze_url(url: str):
    """Perform SEO analysis of a given URL."""
    try:
        res = requests.get(url, timeout=10)
        load_time = res.elapsed.total_seconds() * 1000  # ms
        page_size = len(res.content) / 1024  # KB
        soup = BeautifulSoup(res.text, "html.parser")

        # --- Metadata ---
        title = soup.title.string.strip() if soup.title else "No Title"
        description_tag = soup.find("meta", attrs={"name": "description"})
        description = description_tag.get("content", "").strip() if description_tag else None

        keywords_tag = soup.find("meta", attrs={"name": "keywords"})
        keywords = [kw.strip() for kw in keywords_tag.get("content", "").split(",") if kw] if keywords_tag else []

        # --- Headings ---
        h1_tags = [h.get_text(strip=True) for h in soup.find_all("h1")]
        h2_tags = [h.get_text(strip=True) for h in soup.find_all("h2")]
        h3_tags = [h.get_text(strip=True) for h in soup.find_all("h3")]

        # --- Links ---
        all_links = [a["href"] for a in soup.find_all("a", href=True)]
        internal_links, external_links, broken_links = [], [], []
        parsed_url = urlparse(url)

        for link in all_links[:20]:  # limit for speed
            abs_url = urljoin(url, link)
            if urlparse(abs_url).netloc == parsed_url.netloc:
                internal_links.append(abs_url)
            else:
                external_links.append(abs_url)
            try:
                link_res = requests.head(abs_url, timeout=3)
                if link_res.status_code >= 400:
                    broken_links.append(abs_url)
            except Exception:
                broken_links.append(abs_url)

        # --- Images ---
        images = soup.find_all("img")
        images_without_alt = [img.get("src") for img in images if not img.get("alt")]

        # --- Canonical ---
        canonical_tag = soup.find("link", attrs={"rel": "canonical"})
        canonical = canonical_tag.get("href") if canonical_tag else None

        # --- Robots ---
        robots_tag = soup.find("meta", attrs={"name": "robots"})
        robots_content = robots_tag.get("content").lower() if robots_tag else None

        # --- Open Graph ---
        og_tags = {tag.get("property"): tag.get("content") for tag in soup.find_all("meta") if tag.get("property", "").startswith("og:")}

        # --- Structured data ---
        structured_data = [script.get_text() for script in soup.find_all("script", attrs={"type": "application/ld+json"})]

        # --- Content ---
        word_count = len(soup.get_text().split())

        # --- Performance (basic request data) ---
        performance_data = {
            "page_size_kb": round(page_size, 2),
            "load_time_ms": int(load_time),
            "https": url.startswith("https"),
        }

        # --- Google PSI Scores ---
        google_scores = get_pagespeed_insights(url, "desktop")

        # --- Average score ---
        avg_score = None
        if isinstance(google_scores, dict) and not google_scores.get("error"):
            valid_scores = [v for v in google_scores.values() if isinstance(v, int)]
            if valid_scores:
                avg_score = sum(valid_scores) // len(valid_scores)

        return {
            "title": title,
            "metaTags": {
                "description": description,
                "keywords": ",".join(keywords) if keywords else None,
                "robots": robots_content,
                "canonical": canonical,
                "og_tags": og_tags if og_tags else None,
            },
            "headings": {"h1": h1_tags, "h2": h2_tags, "h3": h3_tags},
            "content": {
                "word_count": word_count,
                "image_count": len(images),
                "images_without_alt": images_without_alt,
            },
            "links": {
                "internal": internal_links,
                "external": external_links,
                "broken": broken_links,
            },
            "performance": performance_data,
            "structured_data": structured_data,
            "google_scores": google_scores,
            "score": avg_score,
            "keywords": keywords or [],
        }

    except Exception as e:
        return {
            "title": "Error fetching URL",
            "metaTags": None,
            "headings": None,
            "content": None,
            "links": {"internal": [], "external": [], "broken": []},
            "performance": None,
            "structured_data": [],
            "google_scores": None,
            "score": None,
            "keywords": [],
            "error": str(e),
        }
