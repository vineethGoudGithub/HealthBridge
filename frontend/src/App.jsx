import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LogInteraction from './pages/LogInteraction';
import { LayoutGrid, PlusCircle, Stethoscope } from 'lucide-react';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-logo">
            <Stethoscope size={24} />
            <span>HealthBridge CRM</span>
          </div>
          <div className="flex gap-4">
            <Link to="/" className="btn btn-secondary">
              <LayoutGrid size={18} /> Dashboard
            </Link>
            <Link to="/log" className="btn btn-primary">
              <PlusCircle size={18} /> Log Interaction
            </Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/log" element={<LogInteraction />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
