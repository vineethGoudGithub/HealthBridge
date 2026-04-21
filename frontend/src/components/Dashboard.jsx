import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchInteractions, deleteInteraction } from '../store/crmSlice';
import { 
  Users, 
  MessageSquare, 
  ArrowUpRight, 
  Calendar, 
  Zap, 
  CheckCircle2,
  MoreHorizontal,
  Trash2
} from 'lucide-react';
import MetricCard from './Analytics/MetricCard';
import SentimentTrend from './Analytics/SentimentTrend';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const interactionsRef = useRef(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const { interactions, status } = useSelector(state => state.crm);

  useEffect(() => {
    if (interactions.length <= 3) {
      dispatch(fetchInteractions());
    }
  }, [dispatch]);

  const scrollToInteractions = () => {
    interactionsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    console.log("Attempting to delete interaction with ID:", id);
    if (window.confirm("Are you sure you want to delete this interaction?")) {
      dispatch(deleteInteraction(id))
        .then(() => {
          console.log("Delete request sent successfully");
          setMenuOpenId(null);
        })
        .catch(err => console.error("Frontend Delete Error:", err));
    }
  };

  const stats = {
    total: interactions.length,
    positive: interactions.filter(i => i.sentiment === 'Positive').length,
    pending: interactions.filter(i => i.next_action).length,
    avgGrowth: '+14%'
  };

  const getSentimentClass = (sentiment) => {
    const s = sentiment?.toLowerCase() || '';
    if (s.includes('positive')) return 'badge-positive';
    if (s.includes('negative')) return 'badge-negative';
    return 'badge-neutral';
  };

  return (
    <div className="page-transition">
      {/* ... (Previous header and stats kept same) ... */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="section-title">Executive Overview</h1>
          <p className="text-text-muted font-medium">Real-time engagement metrics for your HCP portfolio.</p>
        </div>
        <div className="bg-primary-glow text-primary px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-blue-100">
          <Zap size={14} fill="currentColor" /> SYSTEM ONLINE
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard 
          title="Total Interactions" 
          value={stats.total} 
          icon={MessageSquare} 
          trend="+5.2%" 
          color="#2563eb" 
        />
        <MetricCard 
          title="Unique HCPs" 
          value={new Set(interactions.map(i => i.hcp_name)).size} 
          icon={Users} 
          trend="+2.1%" 
          color="#8b5cf6" 
        />
        <MetricCard 
          title="Avg. Sentiment" 
          value={`${Math.round((stats.positive / (stats.total || 1)) * 100)}%`} 
          icon={ArrowUpRight} 
          color="#10b981" 
        />
        <MetricCard 
          title="Pending Actions" 
          value={stats.pending} 
          icon={CheckCircle2} 
          color="#f43f5e" 
        />
      </div>

      <div className="grid grid-cols-3 gap-8 mb-12">
        <div className="col-span-2">
          <SentimentTrend data={interactions} />
        </div>
        <div className="col-span-1 glass-ai-card flex flex-col justify-center items-center text-center p-10 rounded-[32px] border-none shadow-premium relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary-gradient"></div>
          <div className="bg-primary-glow p-5 rounded-2xl mb-5 text-primary">
            <Zap size={32} />
          </div>
          <h3 className="text-2xl font-black mb-3 text-header">AI Insights Ready</h3>
          <p className="text-text-muted text-sm leading-relaxed mb-8">
            Our agent has analyzed 100% of your recent interactions and suggested {stats.pending} strategic follow-ups.
          </p>
          <button 
            className="btn btn-primary w-full shadow-lg"
            onClick={() => navigate('/log')}
          >
            View Suggestions
          </button>
        </div>
      </div>

      <div ref={interactionsRef}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-extrabold tracking-tight">Recent Interactions</h2>
          <button 
            className="btn btn-outline"
            onClick={scrollToInteractions}
          >
            View Full Stream <ArrowUpRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {interactions.map((interaction, idx) => (
            <motion.div 
              key={interaction.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card group ${menuOpenId === interaction.id ? 'z-50' : 'z-auto'}`}
            >
              <div className="interaction-item-header">
                <div>
                  <h3 className="hcp-name group-hover:text-primary transition-colors mb-1">
                    {interaction.hcp_name}
                  </h3>
                  <div className="interaction-meta">
                    <Calendar size={14} className="opacity-70" />
                    {new Date(interaction.date).toLocaleDateString()}
                    <span className="opacity-30 mx-1">•</span>
                    {interaction.interaction_type}
                  </div>
                </div>
                <div className={`badge ${getSentimentClass(interaction.sentiment)}`}>
                  {interaction.sentiment}
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Impact Summary</p>
                  <p className="text-[0.9375rem] text-slate-600 leading-relaxed line-clamp-3 font-medium">
                    {interaction.summary || interaction.notes}
                  </p>
                </div>

                {interaction.next_action && (
                  <div className="bg-blue-50/50 p-4 rounded-2xl border-l-[6px] border-primary shadow-sm">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Recommended Next Step</p>
                    <p className="text-[0.8125rem] font-bold text-slate-800 leading-snug">{interaction.next_action}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-5 border-t border-slate-100 flex justify-between items-center relative">
                <span className="text-[11px] font-bold text-text-muted tracking-wider">REF ID: #{interaction.id}</span>
                <div className="relative">
                  <button 
                    className={`p-2 h-10 w-10 flex items-center justify-center rounded-xl transition-all shadow-sm border border-slate-100 ${menuOpenId === interaction.id ? 'bg-primary text-white scale-90' : 'bg-white text-slate-400 hover:text-primary hover:border-primary-glow'}`}
                    onClick={() => setMenuOpenId(menuOpenId === interaction.id ? null : interaction.id)}
                  >
                    <MoreHorizontal size={20} />
                  </button>
                  
                  {menuOpenId === interaction.id && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="absolute right-0 bottom-full mb-3 w-44 dropdown-menu p-1"
                    >
                      <button 
                        className="menu-item menu-item-error text-error"
                        onClick={(e) => handleDelete(e, interaction.id)}
                      >
                        <Trash2 size={16} /> Delete Record
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
