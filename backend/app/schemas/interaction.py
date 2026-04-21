from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, List

class InteractionBase(BaseModel):
    hcp_name: str
    date: date
    interaction_type: str
    products_discussed: str
    notes: Optional[str] = None

class InteractionCreate(InteractionBase):
    pass

class InteractionUpdate(BaseModel):
    hcp_name: Optional[str] = None
    date: Optional[date] = None
    interaction_type: Optional[str] = None
    products_discussed: Optional[str] = None
    notes: Optional[str] = None
    summary: Optional[str] = None
    sentiment: Optional[str] = None
    next_action: Optional[str] = None

class InteractionResponse(InteractionBase):
    id: int
    summary: Optional[str] = None
    sentiment: Optional[str] = None
    next_action: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str
