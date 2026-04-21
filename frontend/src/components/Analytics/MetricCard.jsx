import React from 'react';

const MetricCard = ({ title, value, icon: Icon, trend, color }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon`} style={{ backgroundColor: `${color}15`, color: color }}>
        <Icon size={24} />
      </div>
      <div>
        <p className="stat-label">{title}</p>
        <div className="flex items-center gap-2">
          <h2 className="stat-value">{value}</h2>
          {trend && (
            <span className={`text-xs font-bold ${trend.startsWith('+') ? 'text-success' : 'text-error'}`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
