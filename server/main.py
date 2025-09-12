# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import users  # assuming you have server/routes/users.py

# Create FastAPI app
app = FastAPI(
    title="SEOtron API",
    version="1.0",
    description="Backend for SEOtron project"
)

# Allow frontend (React) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the users router
app.include_router(users.router, prefix="/users", tags=["Users"])

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to SEOtron API!"}

# Test endpoint (to connect frontend & backend)
@app.get("/api/hello")
async def hello():
    return {"message": "Hello from FastAPI"}
