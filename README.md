# HealthBridge AI CRM

HealthBridge is a smart assistant designed for logging conversations with healthcare professionals (HCPs). instead of manually filling out CRM forms, you can just type or talk to HealthBridge, and it handles the data entry for you.

It tracks doctor visits, analyzes interaction sentiment, and suggests next steps.

## Key Features
- **Conversational CRM**: You can log a visit by simply typing something like: *"Met Dr. Smith today, he's interested in the new clinical trial."*
- **AI-Powered Analysis**: Uses LangGraph and Llama 3.3 to understand notes, extract emotions, and identify key discussion points.
- **Direct Dashboard**: A clean interface to see your stats and recent activity at a glance.
- **Smart Suggestions**: The AI looks at previous interactions to suggest what you should do next for a specific HCP.

## Tech Stack
- **Frontend**: React (Vite) + Redux
- **Backend**: FastAPI (Python)
- **Database**: Neon (PostgreSQL)
- **AI Logic**: LangGraph + Llama 3.3 (via Groq)

## How to Run Locally

### 1. Backend Setup
1. Open a terminal in the `backend` folder.
2. Install dependencies: `pip install -r requirements.txt`
3. Ensure your `.env` file contains your `GROQ_API_KEY`.
4. Start the server: `python -m app.main`

### 2. Frontend Setup
1. Open a terminal in the `frontend` folder.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Visit `http://localhost:5173` in your browser.

## Example Prompts
Once the app is running, try typing these into the AI Assistant:
- *"I just saw Dr. Oak and discussed HeartGuard; it went really well!"*
- *"Give me a summary of what we know about Dr. Elena Vance."*
- *"What should my next step be for Isaac Kleiner?"*

---
**Enjoy using HealthBridge!**
If you need to edit or delete a record, you can use the actions menu on the dashboard.
