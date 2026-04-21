from langchain_core.tools import tool
from langchain_groq import ChatGroq
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..services import crm_service
from ..schemas.interaction import InteractionCreate, InteractionUpdate
import os
import json
from datetime import date

# Initialize LLM
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.1
)

@tool
def log_interaction_tool(user_input: str) -> str:
    """Extracts HCP interaction data from natural language and saves it to the database.
    Expects data like: HCP Name, Date, Interaction Type, Products, Notes.
    """
    prompt = f"""
    Extract structured data from the following HCP interaction log:
    "{user_input}"
    
    Current Date: {date.today().isoformat()}
    
    Return a JSON object with:
    - hcp_name (str)
    - date (str, YYYY-MM-DD)
    - interaction_type (str: 'Visit', 'Call', or 'Email')
    - products_discussed (str)
    - notes (str)
    - sentiment (str: 'Positive', 'Neutral', 'Negative')
    - summary (str: concise 1-sentence summary)
    - next_action (str: recommended follow-up)
    
    If any field is missing, infer it if possible or leave empty.
    """
    
    response = llm.invoke(prompt)
    content = response.content.strip()
    
    # Robustly find JSON content if wrapped in markdown or mixed with text
    json_start = content.find('{')
    json_end = content.rfind('}') + 1
    if json_start != -1 and json_end > json_start:
        content = content[json_start:json_end]
        
    try:
        data = json.loads(content)
    except Exception:
        return f"Error: LLM returned invalid JSON format. Response was: {content[:100]}..."
    
    db = SessionLocal()
    try:
        interaction_create = InteractionCreate(
            hcp_name=data.get("hcp_name", "Unknown"),
            date=data.get("date", date.today().isoformat()),
            interaction_type=data.get("interaction_type", "Visit"),
            products_discussed=data.get("products_discussed", ""),
            notes=data.get("notes", "")
        )
        db_interaction = crm_service.create_interaction(db, interaction_create)
        
        # Update with generated insights
        update = InteractionUpdate(
            summary=data.get("summary"),
            sentiment=data.get("sentiment"),
            next_action=data.get("next_action")
        )
        crm_service.update_interaction(db, db_interaction.id, update)
        
        return f"Successfully logged interaction for {data.get('hcp_name')} (ID: {db_interaction.id})"
    except Exception as e:
        return f"Error logging interaction: {str(e)}"
    finally:
        db.close()

@tool
def edit_interaction_tool(interaction_id: int, updates: dict) -> str:
    """Updates an existing interaction by ID with the provided fields."""
    db = SessionLocal()
    try:
        update_schema = InteractionUpdate(**updates)
        result = crm_service.update_interaction(db, interaction_id, update_schema)
        if result:
            return f"Interaction {interaction_id} updated successfully."
        return f"Interaction {interaction_id} not found."
    except Exception as e:
        return f"Error updating interaction: {str(e)}"
    finally:
        db.close()

@tool
def get_interaction_history_tool(hcp_name: str) -> str:
    """Fetches the interaction history for a specific Healthcare Professional (HCP)."""
    db = SessionLocal()
    try:
        history = crm_service.get_hcp_history(db, hcp_name)
        if not history:
            return f"No history found for HCP: {hcp_name}"
        
        output = [f"History for {hcp_name}:"]
        for item in history:
            output.append(f"- {item.date}: {item.interaction_type} regarding {item.products_discussed}. Sentiment: {item.sentiment}")
        return "\n".join(output)
    finally:
        db.close()

@tool
def summarize_interactions_tool(hcp_name: str) -> str:
    """Uses AI to summarize multiple interactions for an HCP and provide engagement insights."""
    db = SessionLocal()
    try:
        history = crm_service.get_hcp_history(db, hcp_name)
        if not history:
            return f"No history found to summarize for {hcp_name}."
        
        history_text = "\n".join([f"{h.date}: {h.notes} (Sentiment: {h.sentiment})" for h in history])
        
        prompt = f"""
        Provide a high-level summary and engagement analysis for HCP {hcp_name} based on the following history:
        {history_text}
        
        Analyze:
        1. Overall engagement level.
        2. Sentiment trend.
        3. Primary concerns or interests.
        """
        
        response = llm.invoke(prompt)
        return response.content
    finally:
        db.close()

@tool
def suggest_next_action_tool(hcp_name: str) -> str:
    """Uses AI to reason about the best next action for a specific HCP based on their interaction history."""
    db = SessionLocal()
    try:
        history = crm_service.get_hcp_history(db, hcp_name)
        if not history:
            return f"No history found for {hcp_name}. Suggest initial introductory visit."
        
        history_text = "\n".join([f"{h.date}: {h.notes} (Next Action planned: {h.next_action})" for h in history])
        
        prompt = f"""
        Based on the interaction history for HCP {hcp_name}, what should be the most strategic next move?
        History:
        {history_text}
        
        Suggest one clear, actionable next step.
        """
        
        response = llm.invoke(prompt)
        return response.content
    finally:
        db.close()

tools = [
    log_interaction_tool,
    edit_interaction_tool,
    get_interaction_history_tool,
    summarize_interactions_tool,
    suggest_next_action_tool
]
