import React from 'react';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel } from 'victory';

const MyLineGraph = () => {
  // Example data
  const data = [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 5 },
    { x: 4, y: 4 },
    { x: 5, y: 7 },
  ];

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>My Line Graph</h1>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={20}
        style={{ parent: { maxWidth: '80%', margin: 'auto' }}}
      >
        <VictoryLabel x={225} y={30} text="My Beautiful Line Graph" />
        <VictoryAxis
          label="X Axis"
          tickValues={[1, 2, 3, 4, 5]}
          tickFormat={["1", "2", "3", "4", "5"]}
          style={{
            axisLabel: { padding: 30 }
          }}
        />
        <VictoryAxis
          dependentAxis
          label="Y Axis"
          tickFormat={(x) => (`${x}`)}
          style={{
            axisLabel: { padding: 40 }
          }}
        />
        <VictoryLine
          data={data}
          style={{
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #ccc" }
          }}
          interpolation="monotoneX"
        />
      </VictoryChart>
    </div>
  );
};

export default MyLineGraph;
