from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import users, seo  # import seo router

# Create FastAPI app
app = FastAPI(
    title="SEOtron API",
    version="1.0",
    description="Backend for SEOtron project"
)

# Allow frontend (React) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(seo.router)  # ✅ Include SEO router (prefix="/api" is in seo.py)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to SEOtron API!"}

# Test endpoint (optional)
@app.get("/api/hello")
async def hello():
    return {"message": "Hello from FastAPI"}
