from app.agents.hcp_agent import handle_chat
import os

def test_extraction():
    print("--- Testing Entity Extraction ---")
    
    # Test 1: History
    print("\nTest 1: 'Show me history for Dr. Elena Vance'")
    # We catch the response to see if it's querying the right thing
    # Note: This will actually call the DB, so we're looking for a result or a 'No history found' 
    # instead of an SSL error or a 'No doctor found'.
    response = handle_chat("Show me history for Dr. Elena Vance")
    print(f"Response: {response}")
    
    # Test 2: Summary
    print("\nTest 2: 'Can you summarize my visits with Dr. Isaac Kleiner?'")
    response = handle_chat("Can you summarize my visits with Dr. Isaac Kleiner?")
    print(f"Response: {response}")

if __name__ == "__main__":
    test_extraction()
