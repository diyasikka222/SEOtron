import os
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from playwright.async_api import async_playwright

# Load .env variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_PAGESPEED_API_KEY")


# -------------------------------------------------
# Keyword Analysis (Dummy)
# -------------------------------------------------
def analyze_keyword(keyword: str):
    return {
        "keyword": keyword,
        "search_volume": 1200,
        "competition": 0.75,
        "related_keywords": [f"{keyword} example", f"{keyword} tutorial"],
    }


# -------------------------------------------------
# Google PageSpeed Insights
# -------------------------------------------------
def get_pagespeed_insights(url: str, strategy: str = "desktop"):
    endpoint = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    params = {"url": url, "strategy": strategy, "key": GOOGLE_API_KEY}
    try:
        res = requests.get(endpoint, params=params, timeout=15)
        data = res.json()
        lighthouse = data.get("lighthouseResult", {}).get("categories", {})
        return {
            "seo_score": int(lighthouse.get("seo", {}).get("score", 0) * 100),
            "performance_score": int(
                lighthouse.get("performance", {}).get("score", 0) * 100
            ),
            "best_practices": int(
                lighthouse.get("best-practices", {}).get("score", 0) * 100
            ),
            "accessibility": int(
                lighthouse.get("accessibility", {}).get("score", 0) * 100
            ),
        }
    except Exception as e:
        return {"error": str(e)}


# -------------------------------------------------
# URL SEO Analysis
# -------------------------------------------------
async def analyze_url(url: str):
    # ✅ Normalize URL
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/127.0.0.1 Safari/537.36"
        )
    }

    html = None
    response_headers = {}

    # -------------------------------------------------
    # 1️⃣ Try using Playwright
    # -------------------------------------------------
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True, args=["--no-sandbox"])
            page = await browser.new_page()
            await page.set_extra_http_headers(headers)
            await page.goto(url, timeout=30000, wait_until="domcontentloaded")
            html = await page.content()
            if page.response:
                response_headers = page.response.headers
            await browser.close()

    except Exception as e:
        print(f"⚠️ Playwright failed: {e}")
        # -------------------------------------------------
        # 2️⃣ Fallback to requests
        # -------------------------------------------------
        try:
            res = requests.get(url, headers=headers, timeout=10)
            res.raise_for_status()
            html = res.text
            response_headers = res.headers
        except Exception as e2:
            print(f"❌ Both Playwright and requests failed: {e2}")
            return {
                "title": "Error fetching URL",
                "metaTags": {},
                "headings": {},
                "content": {},
                "links": {
                    "internal": [],
                    "external": [],
                    "broken": [],
                    "nofollow": [],
                    "mailto": [],
                    "tel": [],
                },
                "structured_data": [],
                "google_scores": {},
                "score": 0,
                "keywords": [],
                "error": str(e2),
            }

    # -------------------------------------------------
    # 3️⃣ Parse HTML with BeautifulSoup
    # -------------------------------------------------
    soup = BeautifulSoup(html, "html.parser")

    # --- Metadata ---
    title = soup.title.string.strip() if soup.title else "No Title"

    meta_desc = soup.find("meta", attrs={"name": "description"})
    description = (
        meta_desc.get("content").strip()
        if meta_desc and meta_desc.get("content")
        else None
    )

    meta_kw = soup.find("meta", attrs={"name": "keywords"})
    keywords = (
        [kw.strip() for kw in meta_kw.get("content", "").split(",") if kw]
        if meta_kw
        else []
    )

    canonical_tag = soup.find("link", rel="canonical")
    canonical = canonical_tag.get("href") if canonical_tag else None

    robots_tag = soup.find("meta", attrs={"name": "robots"})
    robots_content = (
        robots_tag.get("content").lower()
        if robots_tag and robots_tag.get("content")
        else None
    )

    favicon_tag = soup.find("link", rel="icon")
    favicon = (
        urljoin(url, favicon_tag.get("href"))
        if favicon_tag and favicon_tag.get("href")
        else None
    )

    # --- Headings ---
    headings = {
        f"h{i}": [h.get_text(strip=True) for h in soup.find_all(f"h{i}")]
        for i in range(1, 7)
    }

    # --- Content stats ---
    all_text = soup.get_text()
    word_count = len(all_text.split())
    paragraph_count = len(soup.find_all("p"))
    image_tags = soup.find_all("img")
    image_count = len(image_tags)
    images_without_alt = [img.get("src") for img in image_tags if not img.get("alt")]
    images_missing_dimensions = [
        img.get("src")
        for img in image_tags
        if not img.get("width") or not img.get("height")
    ]
    images_long_names = [
        img.get("src")
        for img in image_tags
        if img.get("src") and len(img.get("src")) > 50
    ]

    # --- Links ---
    all_links = [a.get("href") for a in soup.find_all("a", href=True)]
    parsed_url = urlparse(url)
    internal, external, nofollow, mailto, tel = [], [], [], [], []

    for a_tag in soup.find_all("a", href=True):
        link = a_tag["href"]
        abs_url = urljoin(url, link)

        if abs_url.startswith("mailto:"):
            mailto.append(abs_url)
        elif abs_url.startswith("tel:"):
            tel.append(abs_url)
        elif parsed_url.netloc in abs_url:
            internal.append(abs_url)
        else:
            external.append(abs_url)

        if a_tag.get("rel") and "nofollow" in a_tag.get("rel"):
            nofollow.append(abs_url)

    # --- Structured data ---
    structured_data = [
        script.get_text()
        for script in soup.find_all("script", attrs={"type": "application/ld+json"})
    ]

    # --- Performance meta ---
    page_size = len(html.encode("utf-8")) / 1024
    performance_data = {
        "page_size_kb": round(page_size, 2),
        "https": url.startswith("https"),
        "gzip_enabled": response_headers.get("content-encoding") == "gzip",
        "cache_control": response_headers.get("cache-control"),
        "expires": response_headers.get("expires"),
    }

    # --- Google PageSpeed scores ---
    google_scores = get_pagespeed_insights(url, "desktop")

    # --- Simple score heuristic ---
    score = 80 if description and len(description) > 50 else 50

    # -------------------------------------------------
    # 4️⃣ Return structured JSON
    # -------------------------------------------------
    return {
        "title": title,
        "metaTags": {
            "description": description,
            "keywords": ", ".join(keywords) if keywords else None,
            "robots": robots_content,
            "canonical": canonical,
            "favicon": favicon,
        },
        "headings": headings,
        "content": {
            "word_count": word_count,
            "paragraph_count": paragraph_count,
            "image_count": image_count,
            "images_without_alt": images_without_alt,
            "images_missing_dimensions": images_missing_dimensions,
            "images_long_names": images_long_names,
        },
        "links": {
            "internal": list(set(internal)),
            "external": list(set(external)),
            "broken": [],
            "nofollow": list(set(nofollow)),
            "mailto": list(set(mailto)),
            "tel": list(set(tel)),
        },
        "performance": performance_data,
        "structured_data": structured_data,
        "google_scores": google_scores,
        "score": score,
        "keywords": keywords,
    }
