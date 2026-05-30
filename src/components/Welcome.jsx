// src/components/Welcome.jsx
import React, { useState, useEffect } from 'react';
import { getAllCandidates } from '../hooks/useCandidates';
import { 
  Sparkles, 
  UploadCloud, 
  Users, 
  MessageSquare, 
  BarChart2, 
  ArrowRight, 
  FileText, 
  Brain, 
  Search, 
  HelpCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Welcome({ setActiveTab }) {
  const [candidateCount, setCandidateCount] = useState(0);

  useEffect(() => {
    const candidates = getAllCandidates();
    setCandidateCount(candidates.length);
  }, []);

  const features = [
    {
      icon: UploadCloud,
      title: 'Multi-Format CV Ingestion',
      desc: 'Seamlessly upload resumes as PDFs, Word files (.docx), high-res images (JPEG/PNG via OCR), or standard plain text. No manual copying needed.',
      color: 'var(--accent-secondary)'
    },
    {
      icon: Brain,
      title: 'AI Resume Intelligence',
      desc: 'Advanced Llama-3 parsing structures contact details, full technical skills, geographic location, experience length, and demographics in real-time.',
      color: 'var(--accent)'
    },
    {
      icon: MessageSquare,
      title: 'Conversational Talent Search',
      desc: 'Query your entire talent pool using natural language. Screen candidates, search by skills, or filter demographics by typing like a normal conversation.',
      color: 'var(--accent-secondary)'
    },
    {
      icon: BarChart2,
      title: 'Interactive Talent Analytics',
      desc: 'Beautiful stats dashboard compiling real-time skill distribution charts, demographic visualizations, experience heatmaps, and geographic locations.',
      color: 'var(--accent)'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Ingest Candidate Resumes',
      desc: 'Go to the "Upload" tab and drag in your resumes. Acceptable files include PDF, DOCX, JPG, PNG, and TXT.',
      badge: 'Drop any format'
    },
    {
      number: '02',
      title: 'Automated AI Structuring',
      desc: 'Nova\'s high-fidelity AI extracts experience, parses skills, geolocates candidates, and indexes their resumes immediately.',
      badge: 'Seconds per file'
    },
    {
      number: '03',
      title: 'Analyze & Filter',
      desc: 'Explore the "Candidates" grid to view profiles, edit details, and see instant summaries. Switch to "Stats" to view demographic insights.',
      badge: 'Visual breakdown'
    },
    {
      number: '04',
      title: 'Chat with your Pool',
      desc: 'Open "Chat" to ask questions like: "Show me candidates with React and 5+ years experience as a clean markdown table".',
      badge: 'Natural language'
    }
  ];

  return (
    <div className="welcome-page">
      {/* Hero Section */}
      <section className="hero-section glass">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <motion.div 
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles size={14} style={{ marginRight: '0.5rem', color: 'var(--accent-secondary)' }} />
            <span>Next-Gen Talent Analytics</span>
          </motion.div>
          
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Meet <span className="gradient-text">Nova HR</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A premium, AI-powered recruitment workspace designed to parse, analyze, and query resume data. Ingest CVs in any format, extract interactive data pipelines, and chat with your candidates instantly.
          </motion.p>
          
          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button 
              className="btn btn-primary"
              onClick={() => setActiveTab('Upload')}
            >
              Get Started <ArrowRight size={18} />
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                const el = document.getElementById('how-it-works-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More <HelpCircle size={18} />
            </button>
          </motion.div>

          <motion.div 
            className="quick-stats-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="quick-stat-item">
              <span className="quick-stat-val">{candidateCount}</span>
              <span className="quick-stat-lbl">Candidates Uploaded</span>
            </div>
            <div className="quick-stat-divider"></div>
            <div className="quick-stat-item">
              <span className="quick-stat-val">5+ Formats</span>
              <span className="quick-stat-lbl">PDF, DOCX, PNG, JPG, TXT</span>
            </div>
            <div className="quick-stat-divider"></div>
            <div className="quick-stat-item">
              <span className="quick-stat-val">100% Client-Side</span>
              <span className="quick-stat-lbl">Secure & Private Data</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="welcome-section">
        <div className="section-header">
          <span className="section-tag">Core Capabilities</span>
          <h2>A Complete AI Talent Suite</h2>
          <p>Nova HR consolidates file parsing, database management, and conversational analytics in a single secure dashboard.</p>
        </div>
        
        <div className="features-grid">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div 
                key={i} 
                className="feature-card glass"
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="feature-icon-wrapper" style={{ '--icon-color': feat.color }}>
                  <Icon size={24} style={{ color: feat.color }} />
                </div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Interactive Workflow Guide */}
      <section id="how-it-works-section" className="welcome-section workflow-section">
        <div className="section-header">
          <span className="section-tag">Workflow Guide</span>
          <h2>How to Use Nova HR</h2>
          <p>Get up and running in under a minute with our streamlined recruitment pipeline.</p>
        </div>

        <div className="workflow-grid">
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              className="workflow-card glass"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="workflow-number-row">
                <span className="workflow-num">{step.number}</span>
                <span className="workflow-badge">{step.badge}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              
              {/* Optional Arrow indicator between cards */}
              {i < steps.length - 1 && (
                <div className="workflow-arrow-indicator">
                  <ArrowRight size={20} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="cta-banner glass-panel">
        <div className="cta-bg-glow"></div>
        <h2>Ready to source smarter?</h2>
        <p>Drop your candidate CVs today and explore rich analytical profiles in seconds.</p>
        <button 
          className="btn btn-primary"
          onClick={() => setActiveTab('Upload')}
          style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}
        >
          Upload Your First CV <ArrowRight size={18} />
        </button>
      </section>
    </div>
  );
}
