// src/components/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { callAI } from '../utils/api';
import { getAllCandidates } from '../hooks/useCandidates';

export default function Chat() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('cv-dashboard:chat-messages');
    return saved ? JSON.parse(saved) : [
      { role: 'assistant', content: 'Hello! I am your HR AI assistant. You can ask me questions about your uploaded candidates.' }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const candidates = getAllCandidates();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('cv-dashboard:chat-messages', JSON.stringify(messages));
  }, [messages]);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      const defaultMsg = [
        { role: 'assistant', content: 'Hello! I am your HR AI assistant. You can ask me questions about your uploaded candidates.' }
      ];
      setMessages(defaultMsg);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const candidatesContext = candidates.map((c, idx) => `
Candidate #${idx + 1}: ${c.name || 'Unknown'}
Email: ${c.email || 'N/A'}
Phone: ${c.phone || 'N/A'}
Location: ${c.location || 'N/A'}
Age: ${c.age || 'N/A'}
Gender: ${c.gender || 'N/A'}
Skills (Parsed): ${c.skills?.join(', ') || 'N/A'}
Experience (Parsed Summary): ${c.experience || 'N/A'}

--- FULL RAW RESUME TEXT ---
${c.rawText || 'No raw text stored.'}
===================================
`).join('\n');

      const apiMessages = [
        { role: 'system', content: `You are an expert HR assistant. Use the following candidate database context (including parsed structured data and complete raw resume texts) to thoroughly answer the user's questions. Do not make up information that is not supported by the context.

CRITICAL INSTRUCTION: When listing, comparing, or summarizing candidate details (such as names, skills, experiences, languages spoken, locations, age, gender, etc.), always present the information in beautiful, clear Markdown tables or bulleted lists. This makes the data extremely easy to scan.

TALENT DATABASE:
${candidatesContext}` },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        userMessage
      ];

      const response = await callAI(apiMessages);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass chat-container">
      <div className="chat-header glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bot size={20} style={{ color: 'var(--accent)' }} />
          <span style={{ fontWeight: '600' }}>AI Talent Consultant</span>
        </div>
        <button onClick={handleClear} className="delete-btn" title="Clear Chat History" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <Trash2 size={16} />
          Clear Chat
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message-wrapper ${msg.role}`}>
            <div className={`message-avatar ${msg.role}`}>
              {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className={`message-bubble ${msg.role}`} style={{ whiteSpace: 'pre-wrap' }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-wrapper assistant">
            <div className="message-avatar assistant"><Bot size={20} /></div>
            <div className="message-bubble assistant typing">Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your candidates... (e.g. 'Compare React skills in a table')"
          className="chat-input"
          disabled={isLoading}
        />
        <button type="submit" className="chat-submit" disabled={isLoading || !input.trim()}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
