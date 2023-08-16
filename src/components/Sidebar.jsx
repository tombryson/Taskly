import React, { useState, useEffect } from 'react';
import PenIcon from "../assets/pen.jsx";

function Sidebar({ onSectionChange, theme, onToggleTheme }) {
  return (
    <div className={`sidebar w-64 h-screen p-4 z-10 ${
      theme === 'light' ? 'bg-gray-200' : 'bg-gray-800'
    }`}
    >
    <div className='title-div'>
      <h1 className="title text-2xl font-semibold mb-4">Taskly</h1>
      <PenIcon className="pen-icon"/>
    </div>
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
            onClick={() => onSectionChange('calendar')}
          >
            Calendar
          </button>
        </li>
        <li>
          <button
            className="w-full text-left"
            onClick={() => onSectionChange('graph')}
          >
            Graph
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
