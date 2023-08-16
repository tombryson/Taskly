import React, { useState, useEffect } from 'react';
import { VictoryBar, VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel, TextSize } from 'victory';
import axios from 'axios';

export default function Analytics() {
    const [data, setData] = useState({});
    const [filteredData, setFilteredData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProjects, setSelectedProjects] = useState({});
    const [graphType, setGraphType] = useState('line');

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

    const renderLineGraph = (project, summaryArray) => (
        <VictoryChart theme={VictoryTheme.material} domainPadding={20} style={{ parent: { maxWidth: '60%', margin: 'auto' } }}>
        <VictoryLabel x={225} y={30} text={`${project} Line Graph`} />
            <VictoryAxis
                label="Date"
                tickFormat={(t) => new Date(t).toLocaleDateString()}
                style={{
                    axisLabel: { padding: 30 },
                    ticks: { fontSize: 6 },
                    tickLabels: { fontSize: 6 }
                }}
            />
          <VictoryAxis
            dependentAxis
            label="Seconds"
            style={{
              axisLabel: { padding: 40 },
              ticks: { fontSize: 6 },
              tickLabels: { fontSize: 6 }
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
          domainPadding={30}
          style={{ parent: { maxWidth: '60%', margin: 'auto' }}}
        >
        <VictoryLabel x={50} y={30} text={`Project: ${project}`} />
        <VictoryAxis
            label="Date"
            tickValues={tickValues}
            tickFormat={(t) => new Date(t).toLocaleDateString("en-UK", { month: '2-digit', day: '2-digit' })}
            style={{
                axisLabel: { padding: 30 },
                ticks: { fontSize: 4 }, // Reduce font size
                tickLabels: { fontSize: 4 } // Reduce font size
            }}
            // Add this to offset the tick labels
        />
        <VictoryAxis
            dependentAxis
            label="Seconds"
            style={{
              axisLabel: { padding: 40 },
              tickLabels: { fontSize: 6 } // Reduce font size
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
                    checked={selectedProjects[project] || false}
                    onChange={event => handleCheckboxChange(event, project)}
                    />
                    {project}
                </label>
                </li>
            ))}
    
        <label>
            <input
                type="checkbox"
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
            const graph = graphType === 'line'
                ? renderLineGraph(project, summaryArray)
                : renderColumnGraph(project, summaryArray);

            return (
                <div className='graph-div' key={project}>
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
                </div>
            );
        })}
    </div>
);
}
