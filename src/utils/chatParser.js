// src/utils/chatParser.js
/**
 * Parses a raw assistant message into an ordered list of blocks.
 * Each block can be:
 *   - { type: 'text', content: string }
 *   - { type: 'table', headers: string[], rows: string[][] }
 *   - { type: 'chart', data: object }
 */
export function parseMessage(message) {
  const blocks = [];
  // Split by fenced code blocks (```) and keep delimiters
  const parts = message.split(/(```[\s\S]*?```)/g);
  for (let part of parts) {
    if (!part) continue;
    if (part.startsWith('```')) {
      // Code fence – could be a markdown table or a JSON chart block
      const langMatch = part.match(/^```\s*(\w*)\s*\n([\s\S]*?)\n```$/);
      if (!langMatch) continue;
      const lang = langMatch[1].toLowerCase();
      const code = langMatch[2];
      if (lang === '' && code.includes('|')) {
        // Heuristic: unlabelled fence containing pipe characters – treat as markdown table
        const table = parseMarkdownTable(code.trim());
        if (table) blocks.push({ type: 'table', ...table });
        continue;
      }
      if (lang === 'json' && code.includes('type')) {
        try {
          const data = JSON.parse(code);
          blocks.push({ type: 'chart', data });
        } catch (e) {
          // fallback to plain text
          blocks.push({ type: 'text', content: part });
        }
        continue;
      }
      // Any other fenced code – render as plain text
      blocks.push({ type: 'text', content: part });
    } else {
      // Normal text – could still contain a markdown table without fences
      const tableMatch = /^(\s*\|.*\|\s*)$/m.test(part);
      if (tableMatch && part.includes('\n|')) {
        const table = parseMarkdownTable(part.trim());
        if (table) {
          blocks.push({ type: 'table', ...table });
          continue;
        }
      }
      blocks.push({ type: 'text', content: part });
    }
  }
  return blocks;
}

/** Parses a markdown table string into headers and rows.
 *  Expects the standard pipe‑separated markdown format.
 */
export function parseMarkdownTable(md) {
  const lines = md.split('\n').map(l => l.trim()).filter(l => l.length);
  if (lines.length < 2) return null;
  // Header line
  const headerLine = lines[0];
  const separatorLine = lines[1];
  if (!/^\s*\|?\s*[-:]+\s*\|/.test(separatorLine)) return null;
  const rawHeaders = headerLine.split('|').filter(Boolean).map(h => h.trim());
  const rows = lines.slice(2).map(row => row.split('|').filter(Boolean).map(c => c.trim()));
  return { headers: rawHeaders, rows };
}
