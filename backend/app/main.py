from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import analyze, summaries

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    description="LLM-powered mood tracking API with automatic tag extraction and intelligent summaries",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze.router)
app.include_router(summaries.router)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Squircle API is running",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}
