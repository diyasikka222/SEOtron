from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import users, seo, analytics  # Import routes

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
# Use exact frontend origins for SSE to work correctly
origins = [
    "http://127.0.0.1:5173",  # Vite dev
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,  # needed if using cookies
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],  # optional, can expose SSE headers if needed
)

# -----------------------------------
# Routers
# -----------------------------------
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(seo.router, tags=["SEO"])
app.include_router(analytics.router, prefix="/api", tags=["Analytics"])

# -----------------------------------
# Root + Test Endpoints
# -----------------------------------
@app.get("/")
async def root():
    return {"message": "Welcome to SEOtron API!"}

@app.get("/api/hello")
async def hello():
    return {"message": "Hello from FastAPI 👋"}

# -----------------------------------
# Startup & Shutdown Events
# -----------------------------------
@app.on_event("startup")
async def startup_event():
    print("🚀 SEOtron API started successfully!")

@app.on_event("shutdown")
async def shutdown_event():
    print("🛑 SEOtron API shutting down...")
