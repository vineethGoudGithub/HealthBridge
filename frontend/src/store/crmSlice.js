import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export const fetchInteractions = createAsyncThunk(
  'crm/fetchInteractions',
  async () => {
    const response = await axios.get(`${API_BASE}/interactions`);
    return response.data;
  }
);

export const logInteractionForm = createAsyncThunk(
  'crm/logInteractionForm',
  async (data) => {
    const response = await axios.post(`${API_BASE}/log-interaction`, data);
    return response.data;
  }
);

export const deleteInteraction = createAsyncThunk(
  'crm/deleteInteraction',
  async (id) => {
    await axios.delete(`${API_BASE}/interactions/${id}`);
    return id;
  }
);

export const sendChatMessage = createAsyncThunk(
  'crm/sendChatMessage',
  async (message) => {
    const response = await axios.post(`${API_BASE}/chat-agent`, { message });
    return response.data.message;
  }
);

const crmSlice = createSlice({
  name: 'crm',
  initialState: {
    interactions: [
      {
        id: 101,
        hcp_name: "Dr. Elena Vance",
        date: "2024-04-20",
        interaction_type: "Visit",
        products_discussed: "Neuro-X, Brain Booster",
        notes: "Discussed clinical trial results for Neuro-X.",
        summary: "Dr. Vance is highly interested in the latest clinical data.",
        sentiment: "Positive",
        next_action: "Send clinical study PDF",
        created_at: new Date().toISOString()
      },
      {
        id: 102,
        hcp_name: "Dr. Isaac Kleiner",
        date: "2024-04-18",
        interaction_type: "Call",
        products_discussed: "HealFast Gel",
        notes: "Concerns regarding pricing compared to local generic.",
        summary: "Pricing remains the primary hurdle for widespread adoption.",
        sentiment: "Neutral",
        next_action: "Schedule meeting with pricing manager",
        created_at: new Date().toISOString()
      },
      {
        id: 103,
        hcp_name: "Dr. Judith Mossman",
        date: "2024-04-15",
        interaction_type: "Email",
        products_discussed: "Anti-Viral Z",
        notes: "Requested more info on efficacy in pediatric cases.",
        summary: "Exploring usage for younger patients.",
        sentiment: "Positive",
        next_action: "Follow up with pediatric research data",
        created_at: new Date().toISOString()
      }
    ],
    chatMessages: [
      { sender: 'ai', text: 'Hello! I am your HealthBridge AI assistant. I can help you log interactions, analyze trends, or suggest next steps for your HCPs. How can I assist you today?' }
    ],
    status: 'succeeded', // Set to succeeded so sample data shows immediately
    chatStatus: 'idle',
    error: null
  },
  reducers: {
    addLocalMessage: (state, action) => {
      state.chatMessages.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.interactions = action.payload;
        state.status = 'succeeded';
      })
      .addCase(logInteractionForm.fulfilled, (state, action) => {
        state.interactions.unshift(action.payload);
      })
      .addCase(sendChatMessage.pending, (state) => {
        state.chatStatus = 'loading';
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.chatStatus = 'succeeded';
        state.chatMessages.push({ sender: 'ai', text: action.payload });
      })
      .addCase(deleteInteraction.fulfilled, (state, action) => {
        state.interactions = state.interactions.filter(i => i.id !== action.payload);
      });
  }
});

export const { addLocalMessage } = crmSlice.actions;
export default crmSlice.reducer;
