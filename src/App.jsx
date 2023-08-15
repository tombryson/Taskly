import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
// import KanbanBoard from './components/KanbanBoard';
import Analytics from './components/Analytics.jsx';
import PomodoroTimer from './components/PomodoroTimer.jsx';
import Calendar from './components/Calendar.jsx';

function App() {
  const [theme, setTheme] = useState('dark');
  const [selectedSection, setSelectedSection] = useState('timer');

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }
  function handleSectionChange(section) {
    setSelectedSection(section);
  }
  
  return (
    <div className={`App`}>
      <div className="flex min-h-screen">
        {<Sidebar onSectionChange={handleSectionChange} theme={theme} onToggleTheme={toggleTheme} />}
        <main className="flex-1 bg-white">
          {selectedSection === 'timer' && <PomodoroTimer theme={theme} />}
          {selectedSection === 'calendar' && <Calendar theme={theme} />}
          {selectedSection === 'analytics' && <Analytics theme={theme} />}
        </main>
      </div>
    </div>
  );
}

export default App;
