# HealthBridge AI CRM

HealthBridge is an AI-powered CRM designed to track interactions with healthcare professionals (HCPs). The goal was to remove the friction of manual form-filling—you just chat with the AI about your visit, and it handles the data entry for you.

It uses LangGraph and Llama 3.3 to understand the context, sentiment, and key discussion points from your notes.

## Key Features
- **Conversational Logging**: Just type a quick note like "Met Dr. Smith, he's interested in the new trial results" and it's logged instantly.
- **AI Insights**: Powered by Llama 3.3 (via Groq) to analyze emotions and key takeaways from every interaction.
- **Clean Dashboard**: A simple UI to track your visits and see analytics at a glance.
- **Smart Suggestions**: The AI looks at your history and suggests the best next steps for specific physicians.

## Tech Stack
- **Frontend**: React (Vite) + Redux for state management.
- **Backend**: FastAPI (Python) for the API layer.
- **Database**: Neon (PostgreSQL).
- **AI**: LangGraph to orchestrate the agent's logic.

## Getting Started

### 1. Backend
1. Navigate to the `backend` folder.
2. Install dependencies: `pip install -r requirements.txt`
3. Make sure your `.env` file has a valid `GROQ_API_KEY`.
4. Run the server: `python -m app.main`

### 2. Frontend
1. Navigate to the `frontend` folder.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Open `http://localhost:5173` in your browser.

## Try These Prompts
In the AI Assistant, you can try things like:
- "Just saw Dr. Oak and discussed HeartGuard; it went really well!"
- "What do I know about Dr. Elena Vance?"
- "Can you summarize my relationship with Dr. Oak?"
- "What should I do next for Isaac Kleiner?"

---
Hope this helps keep your HCP interactions organized!
