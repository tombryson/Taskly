// src/components/Sidebar.js
import React from 'react';

function Sidebar({ onSectionChange }) {
  return (
    <div className="sidebar bg-gray-100 w-64 h-screen p-4 z-10">
      <h1 className="text-2xl font-semibold mb-4">Pomodoro App</h1>
      <ul className="space-y-2">
        <li>
          <button
            className="w-full text-left"
            onClick={() => onSectionChange('timer')}
          >
            Timer
          </button>
        </li>
        <li>
          <button
            className="w-full text-left"
            onClick={() => onSectionChange('analytics')}
          >
            Analytics
          </button>
        </li>
        <li>
          <button
            className="w-full text-left"
            onClick={() => onSectionChange('kanbanBoard')}
          >
            Kanban Board
          </button>
        </li>
        <li>
          <button
            className="w-full text-left"
            onClick={() => onSectionChange('about')}
          >
            About
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
