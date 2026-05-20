// src/components/InteractiveTable.jsx
import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Download, Copy, Check } from 'lucide-react';

export default function InteractiveTable({ headers, rows }) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(row =>
      Object.values(row).some(v => String(v).toLowerCase().includes(q))
    );
  }, [rows, search]);

  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortCol] ?? '';
      const bv = b[sortCol] ?? '';
      const an = parseFloat(av);
      const bn = parseFloat(bv);
      if (!isNaN(an) && !isNaN(bn)) return sortDir === 'asc' ? an - bn : bn - an;
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [filtered, sortCol, sortDir]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const toCSV = () => {
    const lines = [headers.join(',')];
    sorted.forEach(row => lines.push(headers.map(h => `"${(row[h] ?? '').replace(/"/g, '""')}"`).join(',')));
    return lines.join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(toCSV()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([toCSV()], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'candidates.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <ArrowUpDown size={13} style={{ opacity: 0.4 }} />;
    return sortDir === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />;
  };

  return (
    <div className="itable-wrap">
      <div className="itable-toolbar">
        <div className="itable-search-wrap">
          <Search size={14} className="itable-search-icon" />
          <input
            className="itable-search"
            placeholder="Filter rows…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="itable-actions">
          <button className="itable-btn" onClick={handleCopy} title="Copy as CSV">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy CSV'}
          </button>
          <button className="itable-btn" onClick={handleDownload} title="Download CSV">
            <Download size={14} />
            Download
          </button>
        </div>
      </div>

      <div className="itable-scroll">
        <table className="itable">
          <thead>
            <tr>
              {headers.map(h => (
                <th key={h} onClick={() => handleSort(h)} className="itable-th">
                  <span>{h}</span>
                  <SortIcon col={h} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={headers.length} className="itable-empty">No matching rows</td></tr>
            ) : (
              sorted.map((row, i) => (
                <tr key={i} className="itable-row">
                  {headers.map(h => (
                    <td key={h} className="itable-td">{row[h] ?? ''}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="itable-footer">
        {sorted.length} of {rows.length} row{rows.length !== 1 ? 's' : ''}
        {search && ` matching "${search}"`}
      </div>
    </div>
  );
}
