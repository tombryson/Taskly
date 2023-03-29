import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
// import KanbanBoard from './components/KanbanBoard';
// import Analytics from './components/Analytics';
import PomodoroTimer from './components/PomodoroTimer.jsx';
import './components/style.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [selectedSection, setSelectedSection] = useState('timer');

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  function handleSectionChange(section) {
    setSelectedSection(section);
  }
  
  return (
    <div className={`App ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex">
        <Sidebar onSectionChange={handleSectionChange} />
        <main className="flex-1">
          {selectedSection === 'timer' && <PomodoroTimer theme={theme} />}
          <button onClick={toggleTheme}>Toggle Theme</button>
        </main>
      </div>
    </div>
  );
}

export default App;
