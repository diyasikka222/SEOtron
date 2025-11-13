import random
import datetime
from typing import List, Dict

def make_timeseries(days: int = 30) -> List[Dict]:
    now = datetime.datetime.utcnow()
    data = []
    for i in range(days):
        t = (now - datetime.timedelta(days=days - i - 1)).strftime("%Y-%m-%d")
        value = max(0, int(800 + i * 6 + random.gauss(0, 80)))
        data.append({"time": t, "value": value})
    return data

def get_analytics_payload() -> Dict:
    payload = {
        "overview": {
            "sessions": 250_000 + random.randint(-5000, 5000),
            "users": 40_000 + random.randint(-2000, 2000),
            "bounceRate": round(40 + random.random() * 10, 2),
            "conversions": 4200 + random.randint(-100, 200),
        },
        "trafficSources": [
            {"name": "Organic", "value": 52000},
            {"name": "Direct", "value": 35000},
            {"name": "Referral", "value": 15000},
            {"name": "Paid", "value": 9000},
            {"name": "Social", "value": 6000},
        ],
        "pagePerformance": [
            {"page": "/", "loadTime": 830},
            {"page": "/pricing", "loadTime": 980},
            {"page": "/signup", "loadTime": 760},
            {"page": "/features", "loadTime": 1200},
            {"page": "/blog/post-1", "loadTime": 640},
        ],
        "sessionsTimeseries": make_timeseries(30),
        "conversionTimeseries": make_timeseries(30),
    }
    return payload
