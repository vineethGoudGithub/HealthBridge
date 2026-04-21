# Welcome to HealthBridge AI CRM! 🩺

HealthBridge is your smart assistant for conversations with healthcare professionals (HCPs). Say goodbye to tedious form-filling; just talk to HealthBridge, and it handles the data entry for you.

It tracks visits, analyzes your interactions, and offers advice on next steps. What makes it special?

*   **Conversational CRM**: Simply type *"Met Dr. Smith, he loved the new trial results,"* and it's logged instantly.
*   **The Brain (AI)**: Powered by LangGraph and Llama 3.3, it truly understands your input, picking up on emotions and key discussion points.

---

## 🚀 What’s the Big Deal?

*   **Chat with Your CRM**: Type a quick note, and boom—it's logged.
*   **The Brain (AI)**: Utilizes LangGraph and Llama 3.3 to comprehend your words and context.
*   **Attractive Dashboard**: Enjoy a clean, high-quality UI that displays your statistics at a glance.
*   **Intelligent Suggestions**: Unsure of your next steps? The AI reviews your history and suggests optimal actions.

---

## 💻 Tech We Used
We embraced cutting-edge technology:

*   **Frontend**: Built with React (super fast with Vite) and Redux for state management.
*   **Backend**: FastAPI (Python) for speed and reliability.
*   **Database**: Neon PostgreSQL for secure cloud storage.
*   **AI**: LangGraph to manage the bot's thinking process.

---

## 🛠️ Let’s Get It Running!
To get started, follow these steps:

### 1. The Backend (The Brain)
Open a terminal in the `backend` folder:
1.  Install dependencies: `pip install -r requirements.txt`
2.  Check the `.env` file and enter your **GROQ API key** (starting with `gsk_...`).
3.  Run the server: `python -m app.main`

### 2. The Frontend (The Face)
Open another terminal in the `frontend` folder:
1.  Install packages: `npm install`
2.  Start the dev server: `npm run dev`
3.  Open your browser and go to: `http://localhost:5173`

---

## 🧪 Give It a Try!
Once the app is open, click on the **AI Assistant** and test these prompts:

*   *"I just saw Dr. Oak and discussed HeartGuard; it was wonderful!"*
*   *"What do I know about Dr. Elena Vance?"*
*   *"Can you summarize my relationship with Dr. Oak?"*
*   *"What should I do next for Isaac Kleiner?"*

---

## 📊 Project Support
If you need to correct a record, use the three-dots menu on the dashboard to make adjustments. 

**Enjoy your experience with HealthBridge!**
