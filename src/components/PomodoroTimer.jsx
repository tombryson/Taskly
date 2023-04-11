import React, { useState, useEffect } from 'react';

function PomodoroTimer({theme}) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [workMode, setWorkMode] = useState(true);

  const [taskName, setTaskName] = useState('');

  const handleTaskInputChange = (e) => {
    setTaskName(e.target.value);
  };

  const handleTimerEnd = () => {
    saveTaskToDatabase(taskName, timeSpent);
  }

  const saveTaskToDatabase = async (task, time) => {
    try {
      const response = await fetch('http://localhost:5187/api/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ TaskName: task, TimeSpent: time }),
      });
  
      if (response.ok) {
        console.log('Task saved successfully');
      } else {
        console.log('Error saving task');
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

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
    <div className={`pomodoro-timer ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-800'} m-8 p-8 rounded-lg`}>
      <div className="timer-text font-semibold text-6xl mb-6">{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</div>
      <button
        onClick={() => setRunning(!running)}
        className="start-pause-btn text-white font-bold py-2 px-4 rounded-half mr-4"
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
        className="reset-btn text-white font-bold py-2 px-4 rounded-half mr-4"
      >
        Reset
      </button>
      <input 
      type="text"
      value={taskName}
      onChange={handleTaskInputChange}
      placeholder="Enter task name"
      />
    </div>
  );
}

export default PomodoroTimer;
