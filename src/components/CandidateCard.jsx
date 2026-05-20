// src/components/CandidateCard.jsx
import React from 'react';
import { Mail, Phone, Briefcase, Trash2, MapPin } from 'lucide-react';
import { removeCandidate } from '../hooks/useCandidates';
import { motion } from 'framer-motion';

export default function CandidateCard({ candidate, index, onDelete }) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove ${candidate.name}?`)) {
      removeCandidate(candidate.id);
      onDelete();
    }
  };

  return (
    <motion.div 
      className="glass candidate-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="card-header">
        <h3>{candidate.name || 'Unknown Candidate'}</h3>
        <button onClick={handleDelete} className="delete-btn" title="Remove Candidate">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="contact-info">
        {candidate.email && (
          <div><Mail size={14} /> {candidate.email}</div>
        )}
        {candidate.phone && (
          <div><Phone size={14} /> {candidate.phone}</div>
        )}
        {candidate.location && (
          <div><MapPin size={14} /> {candidate.location}</div>
        )}
        {(candidate.age || candidate.gender) && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', color: 'var(--accent-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>
            {candidate.gender && candidate.gender !== 'Not Specified' && <span>{candidate.gender}</span>}
            {candidate.age && <span>{candidate.gender && candidate.gender !== 'Not Specified' ? '• ' : ''}{candidate.age} Years Old</span>}
          </div>
        )}
      </div>

      {candidate.skills && candidate.skills.length > 0 && (
        <div className="skills-container">
          {candidate.skills.slice(0, 8).map((skill, i) => (
            <span key={i} className="skill-badge">{skill}</span>
          ))}
          {candidate.skills.length > 8 && (
            <span className="skill-badge" style={{ opacity: 0.7 }}>
              +{candidate.skills.length - 8}
            </span>
          )}
        </div>
      )}

      {candidate.experience && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <Briefcase size={14} /> Experience Summary
          </div>
          <div className="experience-text">
            {candidate.experience.length > 150 
              ? candidate.experience.substring(0, 150) + '...' 
              : candidate.experience}
          </div>
        </div>
      )}
    </motion.div>
  );
}
