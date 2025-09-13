# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import users, seo  # ✅ Import routers

# -----------------------------
# Create FastAPI app
# -----------------------------
app = FastAPI(
    title="SEOtron API",
    version="1.0",
    description="Backend for SEOtron project"
)

# -----------------------------
# Middleware (CORS for frontend)
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:5173"] for stricter security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Routers
# -----------------------------
# Users-related endpoints (/users/...)
app.include_router(users.router, prefix="/users", tags=["Users"])

# SEO-related endpoints (/api/...)
app.include_router(seo.router)  # prefix="/api" is already inside seo.py

# -----------------------------
# Root + Test endpoints
# -----------------------------
@app.get("/")
async def root():
    return {"message": "Welcome to SEOtron API!"}

@app.get("/api/hello")
async def hello():
    return {"message": "Hello from FastAPI"}
