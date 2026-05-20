// src/components/Candidates.jsx
import React, { useState } from 'react';
import { getAllCandidates } from '../hooks/useCandidates';
import CandidateCard from './CandidateCard';
import { motion } from 'framer-motion';

export default function Candidates() {
  const [candidates, setCandidates] = useState(getAllCandidates());

  const refreshCandidates = () => {
    setCandidates(getAllCandidates());
  };

  if (candidates.length === 0) {
    return (
      <div className="feature-view">
        <div className="glass" style={{ textAlign: 'center', padding: '4rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>No Candidates Found</h2>
          <p style={{ color: 'var(--text-muted)' }}>Upload some CVs to start building your talent pool.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feature-view">
      <div className="candidates-grid">
        {candidates.map((c, i) => (
          <CandidateCard 
            key={c.id} 
            candidate={c} 
            index={i} 
            onDelete={refreshCandidates} 
          />
        ))}
      </div>
    </div>
  );
}
