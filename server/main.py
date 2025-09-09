# main.py
from fastapi import FastAPI
from routes import users

app = FastAPI(title="SEOtron API", version="1.0")

# Include the users router
app.include_router(users.router, prefix="/users", tags=["Users"])

@app.get("/")
async def root():
    return {"message": "Welcome to SEOtron API!"}
