from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Ensure environment variables are loaded before imports depend on them
load_dotenv()

GROQ_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_KEY or "REPLACE" in GROQ_KEY or GROQ_KEY.startswith("gsk_vM6r"):
    print("\n" + "!"*60)
    print("CRITICAL WARNING: GROQ_API_KEY is missing or invalid in .env")
    print("The AI Agent WILL NOT WORK until you provide a real key.")
    print("!"*60 + "\n")

from .database import engine, Base
from .routes import crm_routes

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HCP CRM AI-First Module")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crm_routes.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the HCP CRM AI-First Module"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
