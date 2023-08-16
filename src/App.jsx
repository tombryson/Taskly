import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
// import KanbanBoard from './components/KanbanBoard';
import Analytics from './components/Analytics.jsx';
import PomodoroTimer from './components/PomodoroTimer.jsx';
import Calendar from './components/Calendar.jsx';
import Graph from './components/Graph';

const data = [10, 20, 30, 15, 50, 10, 30];

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
        <main className="flex-1 bg-white p-3 border-8 main">
          {selectedSection === 'timer' && <PomodoroTimer theme={theme} />}
          {selectedSection === 'calendar' && <Calendar theme={theme} />}
          {selectedSection === 'analytics' && <Analytics theme={theme} />}
          {selectedSection === 'graph' && <Graph theme={theme} data={data} />}
        </main>
      </div>
    </div>
  );
}

export default App;
