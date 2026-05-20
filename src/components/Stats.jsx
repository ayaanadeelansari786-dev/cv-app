// src/components/Stats.jsx
import React, { useMemo, useState } from 'react';
import { getAllCandidates } from '../hooks/useCandidates';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Users, Award, Calendar } from 'lucide-react';

const regions = {
  'Americas': { x: 220, y: 170, color: '#06b6d4' },
  'Europe': { x: 470, y: 120, color: '#a855f7' },
  'Asia-Pacific': { x: 720, y: 200, color: '#f43f5e' },
  'Middle East & Africa': { x: 520, y: 230, color: '#10b981' }
};

const getRegion = (loc) => {
  if (!loc) return 'Other';
  const l = loc.toLowerCase();
  if (l.includes('usa') || l.includes('america') || l.includes('ca') || l.includes('ny') || l.includes('united states') || l.includes('canada') || l.includes('brazil') || l.includes('chile')) {
    return 'Americas';
  }
  if (l.includes('uk') || l.includes('united kingdom') || l.includes('london') || l.includes('france') || l.includes('germany') || l.includes('paris') || l.includes('berlin') || l.includes('spain') || l.includes('italy') || l.includes('europe') || l.includes('belgium') || l.includes('netherlands')) {
    return 'Europe';
  }
  if (l.includes('india') || l.includes('delhi') || l.includes('mumbai') || l.includes('china') || l.includes('japan') || l.includes('tokyo') || l.includes('australia') || l.includes('sydney') || l.includes('singapore') || l.includes('asia') || l.includes('pacific') || l.includes('vietnam')) {
    return 'Asia-Pacific';
  }
  if (l.includes('dubai') || l.includes('uae') || l.includes('africa') || l.includes('egypt') || l.includes('nigeria') || l.includes('saudi') || l.includes('middle east')) {
    return 'Middle East & Africa';
  }
  return 'Other';
};

export default function Stats() {
  const candidates = getAllCandidates();
  const [activeRegion, setActiveRegion] = useState(null);

  const stats = useMemo(() => {
    const total = candidates.length;
    const skillCounts = {};
    let totalAge = 0;
    let ageCount = 0;
    const ageGroups = { 'Under 25': 0, '25-34': 0, '35+': 0 };
    const genderCounts = { Male: 0, Female: 0, 'Not Specified': 0 };
    const regionBuckets = { 'Americas': [], 'Europe': [], 'Asia-Pacific': [], 'Middle East & Africa': [], 'Other': [] };

    candidates.forEach(c => {
      // Skills
      (c.skills || []).forEach(skill => {
        const s = skill.toLowerCase().trim();
        skillCounts[s] = (skillCounts[s] || 0) + 1;
      });

      // Age
      if (c.age) {
        const ageNum = parseInt(c.age);
        if (!isNaN(ageNum)) {
          totalAge += ageNum;
          ageCount++;
          if (ageNum < 25) ageGroups['Under 25']++;
          else if (ageNum <= 34) ageGroups['25-34']++;
          else ageGroups['35+']++;
        }
      }

      // Gender
      if (c.gender) {
        const g = c.gender.trim();
        if (g === 'Male' || g === 'Female') genderCounts[g]++;
        else genderCounts['Not Specified']++;
      } else {
        genderCounts['Not Specified']++;
      }

      // Region Map
      const r = getRegion(c.location);
      regionBuckets[r].push(c.name || 'Anonymous');
    });

    const sortedSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const averageAge = ageCount > 0 ? Math.round(totalAge / ageCount) : 'N/A';

    return { total, topSkills: sortedSkills, averageAge, ageGroups, genderCounts, regionBuckets };
  }, [candidates]);

  if (stats.total === 0) {
    return (
      <div className="glass" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>No Data Available</h2>
        <p style={{ color: 'var(--text-muted)' }}>Upload some CVs to see demographic and talent analytics.</p>
      </div>
    );
  }

  const maxSkillCount = stats.topSkills.length > 0 ? stats.topSkills[0].count : 1;

  // Gender Calculations
  const totalGenderParsed = stats.genderCounts.Male + stats.genderCounts.Female;
  const femalePct = totalGenderParsed > 0 ? Math.round((stats.genderCounts.Female / totalGenderParsed) * 100) : 0;
  const malePct = totalGenderParsed > 0 ? Math.round((stats.genderCounts.Male / totalGenderParsed) * 100) : 0;

  return (
    <div className="stats-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Dynamic World Map Node Grid */}
      <div className="glass" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Globe size={20} style={{ color: 'var(--accent)' }} />
          <h3>Interactive Talent Geography Map</h3>
        </div>
        
        <div style={{ position: 'relative', width: '100%', height: '360px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
          {/* Cyberpunk grid dots background */}
          <svg width="100%" height="100%" viewBox="0 0 900 360" style={{ pointerEvents: 'none' }}>
            <pattern id="dotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.06)" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dotGrid)" />
            
            {/* World Landmass outline representations */}
            <path d="M 100,100 Q 150,80 200,100 T 250,150 T 200,250 T 150,220 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" /> {/* N. America */}
            <path d="M 180,240 Q 230,280 220,330 T 190,300 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" /> {/* S. America */}
            <path d="M 430,90 Q 480,70 510,120 T 470,160 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" /> {/* Europe */}
            <path d="M 450,180 Q 520,180 540,240 T 480,280 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" /> {/* Africa */}
            <path d="M 520,100 Q 650,80 750,120 T 800,200 T 700,260 T 580,180 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" /> {/* Asia */}
            <path d="M 720,280 Q 770,290 760,330 T 710,310 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" /> {/* Australia */}
          </svg>

          {/* Interactive Geographic Hubs */}
          {Object.entries(regions).map(([name, config]) => {
            const count = stats.regionBuckets[name]?.length || 0;
            if (count === 0) return null;
            return (
              <motion.div
                key={name}
                style={{
                  position: 'absolute',
                  left: `${(config.x / 900) * 100}%`,
                  top: `${(config.y / 360) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: 5
                }}
                onMouseEnter={() => setActiveRegion(name)}
                onMouseLeave={() => setActiveRegion(null)}
                whileHover={{ scale: 1.15 }}
              >
                {/* Glowing Radar Rings */}
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: `2px solid ${config.color}`,
                    left: '-16px',
                    top: '-16px',
                    pointerEvents: 'none'
                  }}
                  animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                />
                
                {/* Inner Core */}
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: config.color,
                    boxShadow: `0 0 15px ${config.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: 'bold'
                  }}
                >
                  {count}
                </div>
              </motion.div>
            );
          })}

          {/* Map Overlay Tooltips */}
          <AnimatePresence>
            {activeRegion && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="glass"
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  padding: '1rem',
                  maxWidth: '280px',
                  zIndex: 10,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  borderColor: regions[activeRegion].color
                }}
              >
                <h4 style={{ color: regions[activeRegion].color, marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{activeRegion} Pool</span>
                  <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px' }}>
                    {stats.regionBuckets[activeRegion].length}
                  </span>
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '100px', overflowY: 'auto' }}>
                  {stats.regionBuckets[activeRegion].map((name, i) => (
                    <span key={i} className="skill-badge" style={{ fontSize: '0.75rem' }}>{name}</span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Remote / Unspecified Overlay Info */}
          {stats.regionBuckets['Other']?.length > 0 && (
            <div className="glass" style={{ position: 'absolute', top: '20px', right: '20px', padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              🌐 Remote/Other: <strong>{stats.regionBuckets['Other'].length}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Grid containing Skills + Demographics */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Age breakdown */}
        <div className="glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Calendar size={20} style={{ color: 'var(--accent)' }} />
            <h3>Age Distribution</h3>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="stat-value" style={{ fontSize: '3rem' }}>{stats.averageAge}</div>
              <div className="stat-label">Average Age</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {Object.entries(stats.ageGroups).map(([group, count]) => (
              <div key={group} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ width: '80px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{group}</span>
                <div className="skill-bar-track" style={{ flex: 1, height: '8px' }}>
                  <motion.div
                    className="skill-bar-fill"
                    style={{ background: 'var(--accent-secondary)' }}
                    initial={{ width: 0 }}
                    animate={{ width: stats.total > 0 ? `${(count / stats.total) * 100}%` : '0%' }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <span style={{ width: '30px', textAlign: 'right', fontSize: '0.9rem' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gender Breakdown Circular Progress */}
        <div className="glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Users size={20} style={{ color: 'var(--accent)' }} />
            <h3>Gender Diversity</h3>
          </div>

          {totalGenderParsed === 0 ? (
            <p className="text-muted" style={{ textAlign: 'center', marginTop: '3rem' }}>No gender profile data specified.</p>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '1rem' }}>
              {/* Female circle */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (251.2 * femalePct) / 100 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  <text x="50" y="55" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                    {femalePct}%
                  </text>
                </svg>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>Female</span>
              </div>

              {/* Male circle */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (251.2 * malePct) / 100 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  <text x="50" y="55" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                    {malePct}%
                  </text>
                </svg>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>Male</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Unspecified profiles: {stats.genderCounts['Not Specified']}</span>
            <span>Analyzed pool: {totalGenderParsed}</span>
          </div>
        </div>

        {/* Top Skills */}
        <div className="glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Award size={20} style={{ color: 'var(--accent)' }} />
            <h3>Top Skills</h3>
          </div>
          <div className="skill-bar-container">
            {stats.topSkills.map((skill, index) => (
              <div key={skill.name} className="skill-bar-row">
                <div className="skill-name" style={{ textTransform: 'capitalize' }}>{skill.name}</div>
                <div className="skill-bar-track">
                  <motion.div 
                    className="skill-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${(skill.count / maxSkillCount) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                <div className="skill-count">{skill.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
