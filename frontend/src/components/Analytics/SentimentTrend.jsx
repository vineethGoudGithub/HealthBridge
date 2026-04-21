import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const SentimentTrend = ({ data }) => {
  // Transform data for recharts
  const chartData = data.slice().reverse().map(item => ({
    name: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    sentiment: item.sentiment === 'Positive' ? 3 : item.sentiment === 'Neutral' ? 2 : 1,
    fullDate: item.date
  }));

  return (
    <div className="card h-[400px]">
      <h3 className="text-lg font-bold mb-6">Sentiment Engagement Trend</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 12}}
              dy={10}
            />
            <YAxis 
              hide 
              domain={[0, 4]}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              formatter={(value) => [value === 3 ? 'Positive' : value === 2 ? 'Neutral' : 'Negative', 'Sentiment']}
            />
            <Area 
              type="monotone" 
              dataKey="sentiment" 
              stroke="#0ea5e9" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSentiment)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentTrend;
