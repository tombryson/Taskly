import React, { useState } from 'react';
import axios from 'axios';

const GoalManager = () => {
    const [goalStartDate, setGoalStartDate] = useState(null);
    const [goalEndDate, setGoalEndDate] = useState(null);
    const [goalHours, setGoalHours] = useState(null);
    const [isGoalDivVisible, setIsGoalDivVisible] = useState(false);

    const handleGoalStartDateChange = (e) => setGoalStartDate(e.target.value);
    const handleGoalEndDateChange = (e) => setGoalEndDate(e.target.value);
    const handleGoalHoursChange = (e) => setGoalHours(e.target.value);

    const toggleGoalDiv = () => {
        setIsGoalDivVisible(!isGoalDivVisible);
    };

    const submitGoal = async () => {
        if (!goalStartDate || !goalEndDate || !goalHours) {
            console.error("All fields are required");
            return;
        }

    const goalData = {
        start_date: new Date(goalStartDate).toISOString().split("T")[0],
        end_date: new Date(goalEndDate).toISOString().split("T")[0],
        hours: goalHours,
    };

    try {
        const response = await axios.post('https://pomodoro-analytics.fly.dev/updateGoal', goalData);

        if (response.status === 200) {
            console.log('Goal updated successfully:', response.data);
        }
    } catch (error) {
        console.error('There was an error updating the goal:', error);
    }

};

  const viewGoals = async () => {
    try {
        const response = await axios.get('https://pomodoro-analytics.fly.dev/getGoals')

        if (response.status === 200) {
            console.log(`Your goals: ${JSON.stringify(response.data, 2, null)}`);
        }
    } catch (error) {
        console.error("We couldn't find any goals successfully");
    }
}

  return (
    <div>
      <button onClick={toggleGoalDiv}>Goals</button>
      <div id="analytics-goal-div" className={isGoalDivVisible ? '' : 'hidden'}>
        <label htmlFor="goalStartDate">Start Date:</label>
        <input type="date" id="goalStartDate" onChange={handleGoalStartDateChange} /><br />

        <label htmlFor="goalEndDate">End Date:</label>
        <input type="date" id="goalEndDate" onChange={handleGoalEndDateChange} /><br />

        <label htmlFor="goalHours">Hours:</label>
        <input type="number" id="goalHours" onChange={handleGoalHoursChange} /><br />

        <button onClick={viewGoals}>View Goals</button>
        <button onClick={submitGoal}>Set Goal</button>
      </div>
    </div>
  );
};

export default GoalManager;
