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
    Perform detailed SEO analysis of a given URL.
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

        # Additional metadata
        favicon_tag = soup.find("link", rel="icon")
        favicon = urljoin(url, favicon_tag.get("href")) if favicon_tag and favicon_tag.get("href") else None

        viewport_tag = soup.find("meta", attrs={"name": "viewport"})
        viewport = viewport_tag.get("content") if viewport_tag and viewport_tag.get("content") else None

        author_tag = soup.find("meta", attrs={"name": "author"})
        author = author_tag.get("content") if author_tag and author_tag.get("content") else None

        charset_tag = soup.find("meta", charset=True)
        charset = charset_tag.get("charset") if charset_tag else None

        robots_meta = soup.find("meta", attrs={"name": "robots"})
        robots_content = robots_meta.get("content").lower() if robots_meta and robots_meta.get("content") else None

        canonical_tag = soup.find("link", rel="canonical")
        canonical = canonical_tag.get("href") if canonical_tag and canonical_tag.get("href") else None

        # --- Headings ---
        headings = {f"h{i}": [h.get_text(strip=True) for h in soup.find_all(f"h{i}")] for i in range(1,7)}
        paragraph_count = len(soup.find_all("p"))
        list_count = len(soup.find_all(["ul","ol"]))
        bold_count = len(soup.find_all("b")) + len(soup.find_all("strong"))
        italic_count = len(soup.find_all("i")) + len(soup.find_all("em"))

        # --- Links ---
        all_links = [a["href"] for a in soup.find_all("a", href=True)]
        internal_links, external_links, broken_links = [], [], []
        nofollow_links, mailto_links, tel_links = [], [], []
        parsed_url = urlparse(url)

        for link in all_links[:50]:  # limit for speed
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
            # Check rel
            a_tag = soup.find("a", href=link)
            if a_tag and a_tag.get("rel") and "nofollow" in a_tag.get("rel"):
                nofollow_links.append(abs_url)
            if abs_url.startswith("mailto:"):
                mailto_links.append(abs_url)
            if abs_url.startswith("tel:"):
                tel_links.append(abs_url)

        # --- Images ---
        images = soup.find_all("img")
        image_count = len(images)
        images_without_alt = [img.get("src") for img in images if not img.get("alt")]
        images_missing_dimensions = [img.get("src") for img in images if not img.get("width") or not img.get("height")]
        images_long_names = [img.get("src") for img in images if img.get("src") and len(img.get("src")) > 50]

        # --- Social & Structured Data ---
        og_tags = {tag.get("property"): tag.get("content") for tag in soup.find_all("meta") if tag.get("property", "").startswith("og:")}
        twitter_tags = {tag.get("name"): tag.get("content") for tag in soup.find_all("meta") if tag.get("name", "").startswith("twitter:")}
        structured_data = [script.get_text() for script in soup.find_all("script", attrs={"type": "application/ld+json"})]

        # --- Content Stats ---
        all_text = soup.get_text()
        word_count = len(all_text.split())
        unique_words = len(set(all_text.split()))

        # --- Performance ---
        performance_data = {
            "page_size_kb": round(page_size, 2),
            "load_time_ms": int(load_time),
            "https": url.startswith("https"),
            "gzip_enabled": res.headers.get("content-encoding") == "gzip",
            "cache_control": res.headers.get("cache-control"),
            "expires": res.headers.get("expires"),
        }

        # --- Real Google PSI Scores ---
        google_scores = get_pagespeed_insights(url, "desktop")

        # --- Return fully structured dict ---
        return {
            "title": title,
            "metaTags": {
                "description": description,
                "keywords": ",".join(keywords) if keywords else None,
                "robots": robots_content,
                "canonical": canonical,
                "og_tags": og_tags if og_tags else None,
                "twitter_tags": twitter_tags if twitter_tags else None,
                "favicon": favicon,
                "viewport": viewport,
                "author": author,
                "charset": charset
            },
            "headings": headings,
            "content": {
                "word_count": word_count,
                "unique_words": unique_words,
                "paragraph_count": paragraph_count,
                "list_count": list_count,
                "bold_count": bold_count,
                "italic_count": italic_count,
                "image_count": image_count,
                "images_without_alt": images_without_alt,
                "images_missing_dimensions": images_missing_dimensions,
                "images_long_names": images_long_names
            },
            "links": {
                "internal": internal_links,
                "external": external_links,
                "broken": broken_links,
                "nofollow": nofollow_links,
                "mailto": mailto_links,
                "tel": tel_links
            },
            "performance": performance_data,
            "structured_data": structured_data,
            "google_scores": google_scores,
            "score": None,
            "keywords": keywords or [],
        }

    except Exception as e:
        return {
            "title": "Error fetching URL",
            "metaTags": None,
            "headings": None,
            "content": None,
            "links": {"internal": [], "external": [], "broken": [], "nofollow": [], "mailto": [], "tel": []},
            "performance": None,
            "structured_data": [],
            "google_scores": None,
            "score": 0,
            "keywords": [],
            "error": str(e),
        }

