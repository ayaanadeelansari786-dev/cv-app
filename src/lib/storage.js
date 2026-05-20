export const STORAGE_KEY = "cv_parser_candidates";

export function getAll() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load candidates from localStorage", error);
    return [];
  }
}

export function save(candidate) {
  try {
    const candidates = getAll();
    const existingIndex = candidates.findIndex((c) => c.id === candidate.id);
    
    if (existingIndex >= 0) {
      candidates[existingIndex] = candidate;
    } else {
      candidates.push(candidate);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  } catch (error) {
    console.error("Failed to save candidate to localStorage", error);
  }
}

export function remove(id) {
  try {
    let candidates = getAll();
    candidates = candidates.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  } catch (error) {
    console.error("Failed to remove candidate from localStorage", error);
  }
}

export function clear() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear candidates from localStorage", error);
  }
}
