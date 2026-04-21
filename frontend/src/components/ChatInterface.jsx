import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendChatMessage, addLocalMessage } from '../store/crmSlice';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const { chatMessages, chatStatus } = useSelector(state => state.crm);
  const scrollRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, chatStatus]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    dispatch(addLocalMessage({ sender: 'user', text: userMessage }));
    dispatch(sendChatMessage(userMessage));
    setInput('');
  };

  return (
    <div className="chat-window">
      <div className="p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-primary-glow rounded-2xl flex items-center justify-center text-primary">
            <Bot size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-header">HealthBridge AI</h3>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-success rounded-full"></span>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Active Assistant</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="chat-messages" ref={scrollRef}>
        <div className="flex flex-col">
          <AnimatePresence>
            {chatMessages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`message ${msg.sender === 'user' ? 'message-user ml-auto' : 'message-ai mr-auto'}`}
              >
                <div className="flex items-center gap-2 mb-2 opacity-60">
                  {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {msg.sender === 'user' ? 'Logged by You' : 'AI Analysis'}
                  </span>
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {chatStatus === 'loading' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="message message-ai mr-auto flex items-center gap-4 bg-white border border-slate-100 shadow-sm px-6 py-4 rounded-3xl animate-pulse-soft"
            >
              <div className="flex gap-1.5 items-center">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
              <span className="text-[10px] font-black text-primary tracking-widest uppercase">Analyzing...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="chat-input-area bg-white/50 backdrop-blur-sm p-6 gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            className="input pr-12 h-14 text-base"
            placeholder="Describe your interaction (e.g., 'Met Dr. Reddy, discussed pricing...')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
        </div>
        <button 
          className="btn btn-primary h-14 w-14 p-0 justify-center rounded-2xl shadow-lg hover:shadow-primary/40 transition-all" 
          onClick={handleSend} 
          disabled={chatStatus === 'loading'}
        >
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
