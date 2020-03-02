import React from 'react';
import ReactDOM from 'react-dom';
import dagre from 'dagre';
import Gract from '../src/';

const el = document.getElementById('mountNode');

function ExampleNode({ data: { label = 'example', x, y } = {} }) {
  return (
    <div
      style={{
        borderRadius: '4px',
        textAlign: 'center',
        color: 'white',
        background: 'linear-gradient(to right, #40e0d0, #ff8c00, #ff0080)',
        boxShadow: 'rgba(0,0,0,.25) 0 1px 2px',
      }}
    >
      <h3 style={{ margin: 0, padding: 10 }}>{label}</h3>
      <p
        style={{
          padding: 6,
          fontSize: 12,
          color: 'black',
          textAlign: 'left',
          background: 'white',
          maxWidth: 200,
          overflow: 'scroll',
          margin: 0,
        }}
      >
        x: {x}
        <br />
        y: {y}
      </p>
    </div>
  );
}

Gract.registerNode('gradient', ExampleNode);

const dagreLayout = (nodes, edges) => {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => {
    return {};
  });
  graph.setGraph({});
  nodes.forEach(({ id, rect: { width, height } }) => {
    graph.setNode(id, { width, height, label: id });
  });
  edges.map(({ source, target }) => {
    graph.setEdge(source, target);
  });
  dagre.layout(graph);
  graph.nodes().forEach(e => {
    const aNode = graph.node(e);
    const node = nodes.find(e => e.id === aNode.label);
    console.log(e, node, aNode);
    node.x = aNode.x;
    node.y = aNode.y;
  });
  console.log(nodes);
  return nodes;
};

const nodes = [
  {
    id: '1',
    label: 'node0',
    x: 0,
    y: 0,
  },
  {
    id: '2',
    label: 'node2',
    x: 0,
    y: 200,
  },
  {
    id: '3',
    label: 'node3',
    x: 200,
    y: 0,
  },
];

const edges = [
  {
    source: '1',
    target: '2',
  },
  {
    source: '1',
    target: '3',
  },
];

ReactDOM.render(
  <Gract
    data={{ nodes, edges }}
    defaultNode={{ type: 'gradient' }}
    layout={dagreLayout}
    option={{ nodeMove: true }}
  />,
  el,
);
