// src/components/Header.jsx
import React from 'react';
import { UploadCloud, Users, MessageSquare, BarChart2 } from 'lucide-react';

const tabs = [
  { id: 'Upload', icon: UploadCloud },
  { id: 'Candidates', icon: Users },
  { id: 'Chat', icon: MessageSquare },
  { id: 'Stats', icon: BarChart2 }
];

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="header glass">
      <h1 className="title">
        <span className="gradient-text">Nova</span> HR
      </h1>
      <nav className="tab-nav">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} />
              {tab.id}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
