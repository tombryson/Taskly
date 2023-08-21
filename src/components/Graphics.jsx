import { VictoryBar, VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel, TextSize } from 'victory';
import { filter } from 'd3';

export const LineGraph = ({ project, summaryArray }) => (
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

export const ColumnGraph = ({ project, summaryArray }) => {
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