from typing import Annotated, TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv

load_dotenv()

from ..tools.crm_tools import tools
from langchain_core.tools import render_text_description
from langgraph.prebuilt import ToolNode
import json

class AgentState(TypedDict):
    user_input: str
    messages: List[BaseMessage]
    parsed_data: Dict[str, Any]
    action_type: str
    response: str

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0
)

# 1. Input Node
def input_node(state: AgentState):
    return {"messages": [HumanMessage(content=state["user_input"])]}

# 2. Intent Classification Node
def intent_classification_node(state: AgentState):
    prompt = f"""
    Classify the user intent from the following message:
    "{state['user_input']}"
    
    Available Intents:
    - log_interaction: When user wants to record a new visit/call/email.
    - edit_interaction: When user wants to change an existing record.
    - get_history: When user wants to see past interactions for an HCP.
    - summarize: When user wants an overview/analysis of an HCP.
    - suggest_action: When user asks for next steps/advice.
    - general: Any other query.
    
    Return ONLY the category name.
    """
    response = llm.invoke(prompt)
    intent = response.content.strip().lower()
    return {"action_type": intent}

# 3. Tool Selection Node
def tool_selection_node(state: AgentState):
    # Mapping intent to tool name
    intent_to_tool = {
        "log_interaction": "log_interaction_tool",
        "edit_interaction": "edit_interaction_tool",
        "get_history": "get_interaction_history_tool",
        "summarize": "summarize_interactions_tool",
        "suggest_action": "suggest_next_action_tool"
    }
    
    intent = state["action_type"]
    selected_tool = intent_to_tool.get(intent, None)
    
    if not selected_tool:
        return {"response": "I'm not sure how to handle that. Can you clarify if you want to log, edit, or view history?"}
    
    parsed_data = {"selected_tool": selected_tool}
    
    # Extract HCP Name for history/summary/suggest tools
    if intent in ["get_history", "summarize", "suggest_action"]:
        extract_prompt = f"""
        Extract the Healthcare Professional (HCP) name from the following query:
        "{state['user_input']}"
        
        Return ONLY the name (e.g. 'Dr. Elena Vance' or 'Elena Vance'). 
        If no name is found, return 'Unknown'.
        """
        extract_response = llm.invoke(extract_prompt)
        parsed_data["hcp_name"] = extract_response.content.strip().replace('"', '').replace("'", "")
        
    return {"parsed_data": parsed_data}

# 4. Tool Execution Node
def tool_execution_node(state: AgentState):
    tool_map = {t.name: t for t in tools}
    selected_tool_name = state["parsed_data"].get("selected_tool")
    
    if not selected_tool_name:
        return {"response": state.get("response", "No tool selected.")}
    
    tool = tool_map[selected_tool_name]
    hcp_name = state["parsed_data"].get("hcp_name")
    
    try:
        if selected_tool_name == "log_interaction_tool":
            result = tool.invoke(state["user_input"])
        elif selected_tool_name == "edit_interaction_tool":
            # For edit, we currently just pass the input and let the tool's docstring guide the LLM helper if any
            # But usually edit needs specific extraction. For now, we'll pass the input.
            result = tool.invoke(state["user_input"])
        else:
            # Pass the extracted HCP name
            if hcp_name and hcp_name != "Unknown":
                result = tool.invoke(hcp_name)
            else:
                result = "I couldn't identify which doctor you are referring to. Could you please provide their name?"
    except Exception as e:
        result = f"Error executing tool: {str(e)}"
        
    return {"response": str(result)}

# 5. Response Generation Node
def response_generation_node(state: AgentState):
    prompt = f"""
    Generate a professional and friendly response based on the tool result:
    Tool Result: {state['response']}
    User Original Query: {state['user_input']}
    
    If it was a success, confirm it. If it was an analysis, summarize it clearly.
    """
    response = llm.invoke(prompt)
    return {"response": response.content, "messages": [AIMessage(content=response.content)]}

# Build Graph
builder = StateGraph(AgentState)

builder.add_node("input", input_node)
builder.add_node("intent_classify", intent_classification_node)
builder.add_node("tool_select", tool_selection_node)
builder.add_node("tool_execute", tool_execution_node)
builder.add_node("response_gen", response_generation_node)

builder.add_edge(START, "input")
builder.add_edge("input", "intent_classify")
builder.add_edge("intent_classify", "tool_select")
builder.add_edge("tool_select", "tool_execute")
builder.add_edge("tool_execute", "response_gen")
builder.add_edge("response_gen", END)

workflow = builder.compile()

def handle_chat(user_input: str):
    initial_state = {
        "user_input": user_input,
        "messages": [],
        "parsed_data": {},
        "action_type": "",
        "response": ""
    }
    result = workflow.invoke(initial_state)
    return result["response"]
