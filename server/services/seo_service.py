import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
import os
from dotenv import load_dotenv

# Load .env
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_PAGESPEED_API_KEY")

# -------------------- Keyword Analysis (dummy for now) --------------------
def analyze_keyword(keyword: str):
    """
    Dummy keyword analysis (placeholder).
    Extend later with Google Trends or 3rd party keyword APIs.
    """
    return {
        "keyword": keyword,
        "search_volume": 1200,
        "competition": 0.75,
        "related_keywords": [f"{keyword} example", f"{keyword} tutorial"]
    }


# -------------------- Google PageSpeed Insights --------------------
def get_pagespeed_insights(url: str, strategy: str = "desktop"):
    """
    Get real SEO & performance scores from Google PageSpeed Insights API.
    strategy = "mobile" or "desktop"
    """
    endpoint = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    params = {
        "url": url,
        "strategy": strategy,
        "key": GOOGLE_API_KEY
    }
    try:
        res = requests.get(endpoint, params=params, timeout=15)
        data = res.json()

        lighthouse = data.get("lighthouseResult", {}).get("categories", {})
        return {
            "seo_score": int(lighthouse.get("seo", {}).get("score", 0) * 100),
            "performance_score": int(lighthouse.get("performance", {}).get("score", 0) * 100),
            "best_practices": int(lighthouse.get("best-practices", {}).get("score", 0) * 100),
            "accessibility": int(lighthouse.get("accessibility", {}).get("score", 0) * 100),
        }

    except Exception as e:
        return {"error": str(e)}


# -------------------- URL Analysis --------------------
def analyze_url(url: str):
    """
    Perform SEO analysis of a given URL.
    Combines metadata, headings, links, images, content stats + Google PSI scores.
    """
    try:
        res = requests.get(url, timeout=10)
        load_time = res.elapsed.total_seconds() * 1000  # ms
        page_size = len(res.content) / 1024  # KB

        soup = BeautifulSoup(res.text, "html.parser")

        # --- Metadata ---
        title = soup.title.string.strip() if soup.title else "No Title"
        description_tag = soup.find("meta", attrs={"name": "description"})
        description = description_tag["content"].strip() if description_tag and description_tag.get("content") else None

        keywords = []
        meta_kw = soup.find("meta", attrs={"name": "keywords"})
        if meta_kw and meta_kw.get("content"):
            keywords = [kw.strip() for kw in meta_kw["content"].split(",") if kw]

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
        image_count = len(images)
        images_without_alt = [img.get("src") for img in images if not img.get("alt")]

        # --- Canonical ---
        canonical = None
        canon_tag = soup.find("link", attrs={"rel": "canonical"})
        if canon_tag and canon_tag.get("href"):
            canonical = canon_tag["href"]

        # --- Robots ---
        robots_meta = soup.find("meta", attrs={"name": "robots"})
        robots_content = robots_meta["content"].lower() if robots_meta and robots_meta.get("content") else None

        # --- Open Graph ---
        og_tags = {
            tag.get("property"): tag.get("content")
            for tag in soup.find_all("meta")
            if tag.get("property", "").startswith("og:")
        }

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

        # --- Real Google PSI Scores ---
        google_scores = get_pagespeed_insights(url, "desktop")

        # --- Return fully valid ResponseModel dict ---
        return {
            "title": title,
            "metaTags": {
                "description": description,
                "keywords": ",".join(keywords) if keywords else None,
                "robots": robots_content,
                "canonical": canonical,
                "og_tags": og_tags if og_tags else None,
            },
            "headings": {
                "h1": h1_tags,
                "h2": h2_tags,
                "h3": h3_tags,
            },
            "content": {
                "word_count": word_count,
                "image_count": image_count,
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
            "score": None,
            "keywords": keywords or [],
        }

    except Exception as e:
        # Always return the correct structure, even on error
        return {
            "title": "Error fetching URL",
            "metaTags": None,
            "headings": None,
            "content": None,
            "links": {"internal": [], "external": [], "broken": []},
            "performance": None,
            "structured_data": [],
            "google_scores": None,
            "score": 0,
            "keywords": [],
            "error": str(e),
        }

