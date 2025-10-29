from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="HobbyMatch API",
    description="API for HobbyMatch - Telegram Mini App for finding hobby partners",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "HobbyMatch API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


# Import and include routers
from app.api.v1 import auth, users, interests

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(interests.router, prefix="/api/v1/interests", tags=["interests"])

# TODO: Add more routers as they are created
# app.include_router(discovery.router, prefix="/api/v1/discovery", tags=["discovery"])
# app.include_router(matches.router, prefix="/api/v1/matches", tags=["matches"])
# app.include_router(messages.router, prefix="/api/v1/messages", tags=["messages"])
# app.include_router(meetings.router, prefix="/api/v1/meetings", tags=["meetings"])
# app.include_router(payments.router, prefix="/api/v1/payments", tags=["payments"])
# app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
