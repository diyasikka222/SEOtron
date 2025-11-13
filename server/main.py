from database import create_db_and_tables
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import analytics, seo, users

# --- 1. Create FastAPI app ---
app = FastAPI(
    title="SEOtron API", version="1.0", description="Backend for SEOtron project"
)

# --- 2. Middleware (CORS) ---
# This must be defined and added immediately after creating the app object.
origins = [
    "http://127.0.0.1:5173",  # Client dev origin 1
    "http://localhost:5173",  # Client dev origin 2
]

app.add_middleware(
    CORSMiddleware,
    # FIX: Explicitly allow the origins (necessary when allow_credentials=True)
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# -----------------------------------
# Routers (Must be included after CORS middleware is added)
# -----------------------------------
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(seo.router, tags=["SEO"])
app.include_router(analytics.router, prefix="/api", tags=["Analytics"])


# -----------------------------------
# Startup & Shutdown Events
# -----------------------------------
@app.on_event("startup")
async def startup_event():
    # This must run to set up the database collections
    print("Running database initialization...")
    create_db_and_tables()
    print("🚀 SEOtron API started successfully!")


@app.on_event("shutdown")
async def shutdown_event():
    print("🛑 SEOtron API shutting down...")


# -----------------------------------
# Root + Test Endpoints
# -----------------------------------
@app.get("/")
async def root():
    return {"message": "Welcome to SEOtron API!"}


@app.get("/api/hello")
async def hello():
    return {"message": "Hello from FastAPI 👋"}
