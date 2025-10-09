# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import users, seo

# -----------------------------------
# Create FastAPI app
# -----------------------------------
app = FastAPI(
    title="SEOtron API",
    version="1.0",
    description="Backend for SEOtron project"
)

# -----------------------------------
# Middleware (CORS)
# -----------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can replace with frontend URL for stricter access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------
# Routers
# -----------------------------------
# User endpoints → /users/...
app.include_router(users.router, prefix="/users", tags=["Users"])

# SEO endpoints → /api/...
app.include_router(seo.router, tags=["SEO"])

# -----------------------------------
# Root + Test Endpoints
# -----------------------------------
@app.get("/")
async def root():
    return {"message": "Welcome to SEOtron API!"}


@app.get("/api/hello")
async def hello():
    return {"message": "Hello from FastAPI"}


# -----------------------------------
# Debug logs (optional)
# -----------------------------------
@app.on_event("startup")
async def startup_event():
    print("🚀 SEOtron API started successfully!")


@app.on_event("shutdown")
async def shutdown_event():
    print("🛑 SEOtron API shutting down...")
