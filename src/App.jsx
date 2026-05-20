import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Upload from './components/Upload';
import Candidates from './components/Candidates';
import Chat from './components/Chat';
import Stats from './components/Stats';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('Upload');

  return (
    <div className="app-container">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="feature-view"
          >
            {activeTab === 'Upload' && <Upload />}
            {activeTab === 'Candidates' && <Candidates />}
            {activeTab === 'Chat' && <Chat />}
            {activeTab === 'Stats' && <Stats />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
