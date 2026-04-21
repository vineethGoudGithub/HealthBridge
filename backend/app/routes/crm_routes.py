from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.interaction import InteractionCreate, InteractionUpdate, InteractionResponse, ChatRequest
from ..services import crm_service
from ..agents.hcp_agent import handle_chat
from typing import List

router = APIRouter()

@router.post("/log-interaction", response_model=InteractionResponse)
def log_interaction(interaction: InteractionCreate, db: Session = Depends(get_db)):
    return crm_service.create_interaction(db, interaction)

@router.put("/edit-interaction/{id}", response_model=InteractionResponse)
def edit_interaction(id: int, interaction: InteractionUpdate, db: Session = Depends(get_db)):
    db_interaction = crm_service.update_interaction(db, id, interaction)
    if not db_interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return db_interaction

@router.get("/interactions", response_model=List[InteractionResponse])
def get_interactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crm_service.get_interactions(db, skip, limit)

@router.delete("/interactions/{id}")
def delete_interaction(id: int, db: Session = Depends(get_db)):
    success = crm_service.delete_interaction(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return {"message": "Interaction deleted successfully"}

@router.post("/chat-agent")
async def chat_agent(payload: ChatRequest):
    user_input = payload.message
    try:
        response = handle_chat(user_input)
        return {"message": response}
    except Exception as e:
        if "AuthenticationError" in str(e) or "401" in str(e):
            return {"message": "AI Error: Invalid Groq API Key. Please update your .env file with a real key."}
        return {"message": f"AI Error: {str(e)}"}
