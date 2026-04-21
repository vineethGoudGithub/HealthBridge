from sqlalchemy.orm import Session
from ..models.interaction import Interaction
from ..schemas.interaction import InteractionCreate, InteractionUpdate
from datetime import date

def create_interaction(db: Session, interaction: InteractionCreate):
    db_interaction = Interaction(**interaction.model_dump())
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

def get_interactions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Interaction).order_by(Interaction.created_at.desc()).offset(skip).limit(limit).all()

def get_interaction_by_id(db: Session, interaction_id: int):
    return db.query(Interaction).filter(Interaction.id == interaction_id).first()

def get_hcp_history(db: Session, hcp_name: str):
    return db.query(Interaction).filter(Interaction.hcp_name.ilike(f"%{hcp_name}%")).order_by(Interaction.date.desc()).all()

def update_interaction(db: Session, interaction_id: int, interaction_update: InteractionUpdate):
    db_interaction = get_interaction_by_id(db, interaction_id)
    if not db_interaction:
        return None
    
    update_data = interaction_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_interaction, key, value)
    
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

def delete_interaction(db: Session, interaction_id: int):
    db_interaction = get_interaction_by_id(db, interaction_id)
    if db_interaction:
        db.delete(db_interaction)
        db.commit()
        return True
    return False
