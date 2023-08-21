import React, { useState, useEffect, useMemo } from 'react';
import { VictoryBar, VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel, TextSize } from 'victory';
import axios from 'axios';
import { filter } from 'd3';

const RenderGraph = ({ graphType, project, summaryArray }) => (
    graphType === 'line'
        ? <LineGraph project={project} summaryArray={summaryArray} />
        : <ColumnGraph project={project} summaryArray={summaryArray} />
)

const LineGraph = ({ project, summaryArray }) => (
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
);

const ColumnGraph = ({ project, summaryArray }) => {
    const minDate = new Date(Math.min(...summaryArray.map(item => new Date(item.date).getTime())));
    const maxDate = new Date(Math.max(...summaryArray.map(item => new Date(item.date).getTime())));
    const tickValues = [];
    for (let date = new Date(minDate); date <= maxDate; date.setDate(date.getDate() + 1)) {
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


export default function Analytics() {

    const formatDate = (date) => {
        return date.toISOString().substring(0, 10);
    };

    const [processedData, setProcessedData] = useState();
    const [filteredData, setFilteredData] = useState({processedData});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProjects, setSelectedProjects] = useState({});
    const [graphType, setGraphType] = useState('line');
    const [startDate, setStartDate] = useState(formatDate(new Date()));
    const [endDate, setEndDate] = useState(formatDate(new Date()));
    const [totalTimes, setTotalTimes] = useState();


    const handleStartDateChange = (e) => {
        console.log(e);
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleFilterClick = (project, summaryArray) => {
        console.log(`startDate: ${startDate}, endDate: ${endDate}`);
        console.log(project, summaryArray);
        console.log(filteredData);

        const newData = summaryArray.filter(item => (
            item.date >= startDate &&
            item.date <= endDate
        ));
    
        console.log(newData);
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
        console.log(totalTimes);
        setTotalTimes(totalTimes)
        return { result };
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://pomodoro-analytics.fly.dev/viewData');
                setProcessedData(processData(response.data));
                console.log(processedData);
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
                    newData[project] = filteredData[project];
                }   
            }
        setFilteredData(newData);
    }, [selectedProjects]);

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

            const summaryArray = processedData.result[project];
            
            return (
                <>
                    <div className="date-range-picker">
                        <input type="date" value={startDate} onChange={handleStartDateChange} />
                        <input type="date" value={endDate} onChange={handleEndDateChange} />
                        <button onClick={() => handleFilterClick(project, summaryArray)}>Filter</button>
                    </div>
                    <div className='graph-div' key={project}>
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
                </>
            )
        })}
        </div>
    );
}
