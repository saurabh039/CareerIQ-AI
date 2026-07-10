from fastapi import FastAPI
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="CareerIQ AI Service",
    version="1.0.0",
    description="AI Service for CareerIQ AI"
)


@app.get("/")
def root():
    return {
        "success": True,
        "service": "CareerIQ AI Service",
        "version": "1.0.0",
        "message": "AI Service is running successfully 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "environment": os.getenv("ENVIRONMENT"),
    }