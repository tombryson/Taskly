import React, { useState, useEffect } from 'react';

function Sidebar({ onSectionChange, theme, onToggleTheme }) {
  return (
    <div className={`sidebar w-64 h-screen p-4 z-10 ${
      theme === 'light' ? 'bg-gray-200' : 'bg-gray-800'
    }`}
  >
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
        <li>
          <button
            className="w-full text-left"
            onClick={onToggleTheme}
          >
            Toggle Theme
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
