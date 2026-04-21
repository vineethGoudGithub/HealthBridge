import React, { useState } from 'react';
import StructuredForm from '../components/StructuredForm';
import ChatInterface from '../components/ChatInterface';
import { MessageSquare, Layout } from 'lucide-react';
import { motion } from 'framer-motion';

const LogInteraction = () => {
  const [mode, setMode] = useState('chat'); // 'chat' or 'form'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Log HCP Interaction</h1>
          <p className="text-muted">Choose your preferred way to log the interaction.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setMode('chat')}
            className={`btn ${mode === 'chat' ? 'btn-primary shadow-sm' : 'bg-transparent text-muted'}`}
          >
            <MessageSquare size={16} /> AI Chat
          </button>
          <button
            onClick={() => setMode('form')}
            className={`btn ${mode === 'form' ? 'btn-primary shadow-sm' : 'bg-transparent text-muted'}`}
          >
            <Layout size={16} /> Structured Form
          </button>
        </div>
      </div>

      <motion.div
        key={mode}
        initial={{ opacity: 0, x: mode === 'chat' ? -10 : 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {mode === 'chat' ? <ChatInterface /> : <StructuredForm />}
      </motion.div>
    </div>
  );
};

export default LogInteraction;
