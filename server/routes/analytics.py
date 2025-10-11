# from fastapi import APIRouter
# from fastapi.responses import JSONResponse
# from sse_starlette.sse import EventSourceResponse
# import asyncio
# import random  # ✅ missing import
# from services.analytics_service import get_analytics_payload, make_timeseries
#
# router = APIRouter()
#
# @router.get("/analytics")
# async def analytics():
#     payload = get_analytics_payload()
#     return JSONResponse(payload)
#
# @router.get("/events")
# async def events():
#     async def event_generator():
#         while True:
#             await asyncio.sleep(5)
#             snippet = {
#                 "overview": {
#                     "sessions": 250_000 + random.randint(-5000, 5000),
#                     "users": 40_000 + random.randint(-2000, 2000),
#                 },
#                 "sessionsTimeseries": make_timeseries(7),
#             }
#             yield {"event": "update", "data": snippet}
#
#     return EventSourceResponse(event_generator())


# server/routes/analytics.py
from fastapi import APIRouter
import asyncio, random
from sse_starlette.sse import EventSourceResponse

router = APIRouter()

# Analytics JSON endpoint
@router.get("/analytics")
async def analytics():
    return {
        "overview": {
            "sessions": 1000 + random.randint(-100, 100),
            "users": 200 + random.randint(-20, 20),
            "bounceRate": random.randint(30, 70),
            "conversions": random.randint(50, 200)
        },
        "sessionsTimeseries": [{"time": f"2025-10-{i+1}", "value": random.randint(100, 500)} for i in range(7)],
        "conversionTimeseries": [{"time": f"2025-10-{i+1}", "value": random.randint(10, 100)} for i in range(7)],
        "trafficSources": [
            {"name": "Direct", "value": random.randint(100, 500)},
            {"name": "Referral", "value": random.randint(50, 300)},
            {"name": "Organic", "value": random.randint(150, 600)},
            {"name": "Social", "value": random.randint(20, 150)},
        ]
    }

# SSE live events endpoint
@router.get("/events")
async def events():
    async def event_generator():
        while True:
            await asyncio.sleep(5)
            snippet = {
                "overview": {
                    "sessions": 1000 + random.randint(-100, 100),
                    "users": 200 + random.randint(-20, 20),
                    "bounceRate": random.randint(30, 70),
                    "conversions": random.randint(50, 200)
                },
                "sessionsTimeseries": [{"time": f"2025-10-{i+1}", "value": random.randint(100, 500)} for i in range(7)],
                "conversionTimeseries": [{"time": f"2025-10-{i+1}", "value": random.randint(10, 100)} for i in range(7)],
                "trafficSources": [
                    {"name": "Direct", "value": random.randint(100, 500)},
                    {"name": "Referral", "value": random.randint(50, 300)},
                    {"name": "Organic", "value": random.randint(150, 600)},
                    {"name": "Social", "value": random.randint(20, 150)},
                ]
            }
            yield {"event": "update", "data": snippet}

    headers = {
        "Cache-Control": "no-cache",
        "Content-Type": "text/event-stream",
        "Access-Control-Allow-Origin": "*",  # allow frontend
    }

    return EventSourceResponse(event_generator(), headers=headers)
