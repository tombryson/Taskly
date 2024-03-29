import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineGraph, ColumnGraph } from './graphics';
import GoalManager from './goalManager';

const RenderGraph = ({ graphType, project, summaryArray }) => (
    graphType === 'line'
        ? <LineGraph project={project} summaryArray={summaryArray} />
        : <ColumnGraph project={project} summaryArray={summaryArray} />
)

export default function Analytics() {

    const formatDate = (date) => {
        return date.toISOString().substring(0, 10);
    };

    const [processedData, setProcessedData] = useState();
    const [filteredData, setFilteredData] = useState({ processedData });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProjects, setSelectedProjects] = useState({});
    const [graphType, setGraphType] = useState('line');
    const [startDate, setStartDate] = useState(formatDate(new Date()));
    const [endDate, setEndDate] = useState(formatDate(new Date()));
    const [totalTimes, setTotalTimes] = useState();

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleFilterClick = (project) => {
        const newData = processedData.result[project].filter(item => (
            item.date >= startDate &&
            item.date <= endDate
        ));

        setFilteredData(prevData => ({
            ...prevData,
            [project]: newData
        }));
    };

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

    function processData(data) {
        const result = {};
        const totalTimes = {};
        Object.entries(data).forEach(([project, items]) => {
            const totalTimeSpent = items.reduce((total, item) => total + item.seconds, 0);
            const hours = Math.floor(totalTimeSpent / 3600);
            const minutes = Math.floor((totalTimeSpent % 3600) / 60);

            totalTimes[project] = `${hours} hours & ${minutes} minutes`;
            const summary = summarizeByDay(items);
            result[project] = Object.keys(summary).map(date => ({ date, seconds: summary[date] }));
        });

        setTotalTimes(totalTimes)
        return { result };
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://pomodoro-analytics.fly.dev/viewData');
                setProcessedData(processData(response.data));
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCheckboxChange = (event, project) => {
        setSelectedProjects(prevState => ({
            ...prevState,
            [project]: event.target.checked,
        }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const handleGraphTypeChange = () => {
        setGraphType(prevType => (prevType === 'line' ? 'column' : 'line'));
    };

    return (
        <div>
            {Object.keys(processedData.result).map(project => (
                <li key={project} className="list-keys">
                    <label>
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={selectedProjects[project] || false}
                            onChange={event => handleCheckboxChange(event, project)}
                        />
                        {project}
                    </label>
                </li>
            ))}

            <label className='italic'>
                <input
                    type="checkbox"
                    className='mr-2'
                    checked={graphType === 'column'}
                    onChange={handleGraphTypeChange}
                />
                Use Column Graph
            </label>
            
            {Object.keys(selectedProjects).map(project => {
                if (!selectedProjects[project]) return null
                const summaryArray = selectedProjects[project] ? filteredData[project] || processedData.result[project] : []
                return (
                    <div key={project}>
                        <div className="date-range-picker p-2 m-2 flex flex-row flex-wrap items-start">
                            <input className='p-0.5 m-0.5 border rounded-sm' type="date" value={startDate} onChange={handleStartDateChange} />
                            <input className='p-0.5 m-0.5 border rounded-sm' type="date" value={endDate} onChange={handleEndDateChange} />
                            <button className='border-gray-50' onClick={() => handleFilterClick(project, summaryArray)}>Filter</button>
                            <div className='goal-div'>    
                                <GoalManager />
                            </div>
                        </div>
                        <div className='graph-div'>
                            <h2>{project}</h2>
                            <p>Total time spent: {totalTimes[project]}</p>
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
                            <RenderGraph graphType={graphType} project={project} summaryArray={summaryArray} />
                        </div>
                    </div>
                )
            })}
        </div>
    );
}