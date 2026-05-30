// src/components/Upload.jsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { extractTextFromFile } from '../utils/fileExtract';
import { callAI } from '../utils/api';
import { addCandidate } from '../hooks/useCandidates';
import { FileUp, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Upload() {
  const [status, setStatus] = useState('idle'); // idle, processing, success, error
  const [message, setMessage] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    setStatus('processing');
    setMessage('Reading file...');

    try {
      const text = await extractTextFromFile(file, (progressMessage) => {
        setMessage(progressMessage);
      });
      
      setMessage('AI is parsing candidate data...');
      const messages = [
        { role: 'system', content: `You are an expert HR data extractor. Given a raw resume text, output a JSON object with the following fields: name (string), email (string), phone (string), skills (array of strings), experience (string summarizing years and technologies), location (string, e.g. "San Francisco, CA" or "Paris, France" or "Remote"), age (integer or null), gender (string, "Male", "Female", or "Not Specified"). Only output the JSON without extra text.` },
        { role: 'user', content: text }
      ];
      
      const result = await callAI(messages);
      const candidate = JSON.parse(result);
      
      // Store the full raw text of the CV so we never lose details
      candidate.rawText = text;
      
      addCandidate(candidate);
      
      setStatus('success');
      setMessage(`${candidate.name} added successfully!`);
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);

    } catch (e) {
      console.error(e);
      setStatus('error');
      setMessage(e.message || 'Failed to process CV');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
      'text/plain': ['.txt']
    },
    multiple: false,
    disabled: status === 'processing'
  });

  return (
    <div className="feature-view">
      <motion.div 
        className={`glass upload-section ${isDragActive ? 'active' : ''}`}
        {...getRootProps()}
        whileHover={{ scale: status === 'processing' ? 1 : 1.02 }}
        whileTap={{ scale: status === 'processing' ? 1 : 0.98 }}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <FileUp className="upload-icon" />
              <h2>Upload Candidate CV</h2>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                Drag & drop your resume here, or click to browse files
              </p>
              <p style={{ marginTop: '0.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Supports PDF, DOCX, PNG, JPG, WebP, and TXT
              </p>
            </motion.div>
          )}

          {status === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <FileText className="upload-icon" style={{ color: 'var(--accent-secondary)' }} />
              </motion.div>
              <h2>Processing...</h2>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>{message}</p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <CheckCircle className="upload-icon" style={{ color: '#10b981' }} />
              <h2 style={{ color: '#10b981' }}>Success!</h2>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>{message}</p>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <AlertCircle className="upload-icon" style={{ color: 'var(--danger)' }} />
              <h2 style={{ color: 'var(--danger)' }}>Upload Failed</h2>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>{message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
