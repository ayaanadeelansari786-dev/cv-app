// src/hooks/useCandidates.js
// Hook for managing candidate data persisted in localStorage

const STORAGE_KEY = 'cv-dashboard:candidates';

function loadCandidates() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch {
    console.error('Failed to parse candidates from localStorage');
    return [];
  }
}

function saveCandidates(candidates) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
}

export function getAllCandidates() {
  return loadCandidates();
}

export function addCandidate(candidate) {
  const candidates = loadCandidates();
  candidates.push({ id: crypto.randomUUID(), ...candidate });
  saveCandidates(candidates);
  return candidates;
}

export function updateCandidate(id, updates) {
  const candidates = loadCandidates();
  const index = candidates.findIndex(c => c.id === id);
  if (index !== -1) {
    candidates[index] = { ...candidates[index], ...updates };
    saveCandidates(candidates);
  }
  return candidates;
}

export function removeCandidate(id) {
  let candidates = loadCandidates();
  candidates = candidates.filter(c => c.id !== id);
  saveCandidates(candidates);
  return candidates;
}
