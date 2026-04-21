import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logInteractionForm } from '../store/crmSlice';
import { CheckCircle } from 'lucide-react';

const StructuredForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    hcp_name: '',
    date: new Date().toISOString().split('T')[0],
    interaction_type: 'Visit',
    products_discussed: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(logInteractionForm(formData));
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        hcp_name: '',
        date: new Date().toISOString().split('T')[0],
        interaction_type: 'Visit',
        products_discussed: '',
        notes: ''
      });
    }, 2000);
  };

  return (
    <div className="card shadow-premium p-10">
      <h2 className="text-2xl font-black mb-8 text-header">Manual Interaction Log</h2>
      
      {submitted ? (
        <div className="flex flex-col items-center justify-center py-20 text-success bg-green-50 rounded-3xl border border-green-100">
          <div className="p-5 bg-white rounded-full shadow-lg mb-6">
            <CheckCircle size={64} />
          </div>
          <p className="text-xl font-black">Interaction Saved Successfully!</p>
          <p className="text-sm text-green-700/70 font-medium">Updating your dashboard records...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 block">Healthcare Professional</label>
              <input
                type="text"
                className="input h-14 text-base font-semibold"
                required
                value={formData.hcp_name}
                onChange={(e) => setFormData({ ...formData, hcp_name: e.target.value })}
                placeholder="e.g., Dr. Sharma"
              />
            </div>

            <div className="flex gap-6">
              <div className="flex-1">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 block">Interaction Date</label>
                <input
                  type="date"
                  className="input h-14"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 block">Channel Type</label>
                <select
                  className="input h-14 font-semibold"
                  value={formData.interaction_type}
                  onChange={(e) => setFormData({ ...formData, interaction_type: e.target.value })}
                >
                  <option value="Visit">In-Person Visit</option>
                  <option value="Call">Phone Call</option>
                  <option value="Email">Email</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 block">Products Discussed</label>
              <input
                type="text"
                className="input h-14 text-base"
                value={formData.products_discussed}
                onChange={(e) => setFormData({ ...formData, products_discussed: e.target.value })}
                placeholder="e.g., Insulin X, Glucagon Y"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 block">Internal Notes</label>
              <textarea
                className="input min-h-[120px] py-4 text-base leading-relaxed"
                rows="4"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Key discussion points, objections, or insights..."
              ></textarea>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full h-16 justify-center text-lg shadow-xl shadow-primary/20 mt-4">
            Save HCP Interaction
          </button>
        </form>
      )}
    </div>
  );
};

export default StructuredForm;
