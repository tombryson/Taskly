import React, { useState, useEffect } from 'react';
import './style.css';

function PomodoroTimer({theme}) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [workMode, setWorkMode] = useState(true);

  useEffect(() => {
    let interval = null;

    if (running) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setWorkMode(!workMode);
            setMinutes(workMode ? 5 : 25);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [running, minutes, seconds, workMode]);

  return (
    <div className={`pomodoro-timer bg-${theme === 'light' ? 'gray-200' : 'gray-800'} p-8 rounded-lg`}>
      <div className="timer-text font-semibold text-6xl mb-6">{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</div>
      <button
        onClick={() => setRunning(!running)}
        className="start-pause-btn bg-red-600 text-white font-bold py-2 px-4 rounded-full mr-4"
      >
        {running ? 'Pause' : 'Start'}
      </button>
      <button
        onClick={() => {
          setRunning(false);
          setWorkMode(true);
          setMinutes(25);
          setSeconds(0);
        }}
        className="reset-btn bg-green-600 text-white font-bold py-2 px-4 rounded-full"
      >
        Reset
      </button>
    </div>
  );
}

export default PomodoroTimer;
