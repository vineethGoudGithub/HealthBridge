from sqlalchemy import Column, Integer, String, Date, Text, DateTime
from sqlalchemy.sql import func
from ..database import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String, index=True)
    date = Column(Date)
    interaction_type = Column(String)  # Visit, Call, Email
    products_discussed = Column(String) # Comma-separated or JSON string
    notes = Column(Text)
    summary = Column(Text)
    sentiment = Column(String)
    next_action = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
