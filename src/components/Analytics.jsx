import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Analytics() {
    const [data, setData] = useState({});
    const [filteredData, setFilteredData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProjects, setSelectedProjects] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://pomodoro-analytics.fly.dev/viewData');
                setData(response.data);
                setFilteredData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const newData = {};
            for (const project in selectedProjects) {
                if (selectedProjects[project]) {
                    newData[project] = data[project];
                }   
            }
        setFilteredData(newData);
    }, [selectedProjects, data]);

    const handleCheckboxChange = (event, project) => {
        setSelectedProjects(prevState => ({
            ...prevState,
            [project]: event.target.checked,
        }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    function summarizeByDay(pomodoros) {
        return pomodoros.reduce((acc, item) => {
            const date = new Date(item.session_start).toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = 0;
            }
            if (item.round != "short_break") {
                acc[date] += item.seconds;
            } else {
                acc[date] -= item.seconds;
            }
            return acc;
        }, {});
    }

return (
    <div>
        {Object.keys(data).map(project => (
            <div key={project}>
                <label>
                    <input
                    type="checkbox"
                    checked={selectedProjects[project] || false}
                    onChange={event => handleCheckboxChange(event, project)}
                    />
                    {project}
                </label>
            </div>
        ))}
        {Object.entries(filteredData).map(([project, items]) => {
            const totalTimeSpent = items.reduce((total, item) => total + item.seconds, 0);
            const hours = Math.floor(totalTimeSpent / 3600);
            const minutes = Math.floor((totalTimeSpent % 3600) / 60);
            const timeDisplay = `${hours} hours & ${minutes} minutes`;

            const summary = summarizeByDay(items);
            const summaryArray = Object.keys(summary).map(date => ({ date, seconds: summary[date] }));

        return (
            <div key={project}>
                <h2>{project}</h2>
                <p>Total time spent: {timeDisplay}</p>
                <table>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Seconds</th>
                    </tr>
                    </thead>
                    <tbody>
                    {summaryArray.map((item, index) => (
                        <tr key={index}>
                        <td>{item.date}</td>
                        <td>{item.seconds}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
        })}
    </div>
);
}
