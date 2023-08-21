import React, { useState, useEffect } from 'react';
import { VictoryBar, VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel, TextSize } from 'victory';
import axios from 'axios';

export default function Analytics() {

    const formatDate = (date) => {
        return date.toISOString().substring(0, 10);
    };

    const [data, setData] = useState({});
    const [filteredData, setFilteredData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProjects, setSelectedProjects] = useState({});
    const [graphType, setGraphType] = useState('line');
    const [startDate, setStartDate] = useState(formatDate(new Date()));
    const [endDate, setEndDate] = useState(formatDate(new Date()));

    const handleStartDateChange = (e) => {
        console.log(e);
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleFilterClick = (summaryArray) => {
        console.log(`startDate: ${startDate}, endDate: ${endDate}`)
        console.log(summaryArray);
        const newData = {};
        console.log(`filteredData: ${JSON.stringify(filteredData, null, 2)}`);
        for (const project in filteredData) {
            newData[project] = data[project].filter(item =>
                new Date(item.session_start) >= startDate &&
                new Date(item.session_start) <= endDate
            );
        }
        console.log(newData);
        setFilteredData(newData);
    };

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

    const renderLineGraph = (project, summaryArray) => {
        return (
            <VictoryChart theme={VictoryTheme.material} domainPadding={80} width={900} style={{ parent: { maxWidth: '100%', margin: 'auto' } }}>
            <VictoryLabel x={200} y={30} text={`${project} Line Graph`} />
                <VictoryAxis
                    label="Date"
                    tickFormat={(t) => new Date(t).toLocaleDateString()}
                    style={{
                        axisLabel: { padding: 40 },
                        ticks: { fontSize: 10 },
                        tickLabels: { fontSize: 10 }
                    }}
                />
            <VictoryAxis
                dependentAxis
                label="Seconds"
                style={{
                axisLabel: { padding: 40 },
                ticks: { fontSize: 10 },
                tickLabels: { fontSize: 10 }
                }}
            />
            <VictoryLine
                data={summaryArray.map(item => ({ x: new Date(item.date).getTime(), y: item.seconds }))}
                style={{
                data: { stroke: "#c43a31" },
                parent: { border: "1px solid #ccc" }
                }}
                interpolation="monotoneX"
            />
            </VictoryChart>
        )
    };

    const renderColumnGraph = (project, summaryArray) => {
        const minDate = new Date(Math.min(...summaryArray.map(item => new Date(item.date).getTime())));
        const maxDate = new Date(Math.max(...summaryArray.map(item => new Date(item.date).getTime())));
        const tickValues = [];
        for (let date = minDate; date <= maxDate; date.setDate(date.getDate() + 1)) {
            tickValues.push(new Date(date).getTime());
        }
        return (
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={80}
          width={800}
          style={{ parent: { maxWidth: '80%', margin: 'auto' }}}
        >
        <VictoryLabel x={50} y={30} text={`Project: ${project}`} />
        <VictoryAxis
            label="Date"
            tickValues={tickValues}
            tickFormat={(t) => new Date(t).toLocaleDateString("en-UK", { month: '2-digit', day: '2-digit' })}
            style={{
                axisLabel: { padding: 30 },
                ticks: { fontSize: 11 },
                tickLabels: { fontSize: 11 }
            }}
            
        />
        <VictoryAxis
            dependentAxis
            label="Seconds"
            style={{
              axisLabel: { padding: 40 },
              tickLabels: { fontSize: 8 }
            }}
        />
        <VictoryBar
            data={summaryArray.map(item => ({ x: new Date(item.date).getTime(), y: item.seconds }))}
            style={{
              data: { fill: "#c43a31" }
            }}
        />
        </VictoryChart>
        )
    };

    const handleGraphTypeChange = () => {
        setGraphType(prevType => (prevType === 'line' ? 'column' : 'line'));
    };

    return (
        <div>
            {Object.keys(data).map(project => (
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

        {Object.entries(filteredData).map(([project, items]) => {
            const totalTimeSpent = items.reduce((total, item) => total + item.seconds, 0);
            const hours = Math.floor(totalTimeSpent / 3600);
            const minutes = Math.floor((totalTimeSpent % 3600) / 60);
            const timeDisplay = `${hours} hours & ${minutes} minutes`;

            const summary = summarizeByDay(items);
            const summaryArray = Object.keys(summary).map(date => ({ date, seconds: summary[date] }));
            console.log(`summaryArray: ${JSON.stringify(summaryArray, null, 2)}`);
            const graph = graphType === 'line'
                ? renderLineGraph(project, summaryArray)
                : renderColumnGraph(project, summaryArray);

            return (
                <><div className="date-range-picker">
                    <input type="date" value={startDate} onChange={handleStartDateChange} />
                    <input type="date" value={endDate} onChange={handleEndDateChange} />
                    <button onClick={handleFilterClick}>Filter</button>
                </div><div className='graph-div' key={project}>
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
                        {graph}
                    </div></>
            );
        })}
    </div>
);
}
