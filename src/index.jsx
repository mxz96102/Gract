import React, { useState, useRef, useEffect } from 'react';
import Canvas from './components/Canvas';
import BaseNode from './components/BaseNode';
import BaseEdge from './components/BaseEdge';

const globalNodeMap = new Map();

function safeStringify(n) {
  let res = `${n}`;
  try {
    res = JSON.stringify(n);
  } catch (e) {}
  return res;
}

function DefaultNode({ data }) {
  return (
    <div style={{ border: '2px solid #66ccff', padding: 12, background: 'white' }}>
      {Object.entries(data).map(([k, v], i) => (
        <p key={i}>
          {k}: {typeof v === 'object' ? safeStringify(v) : v}
        </p>
      ))}
    </div>
  );
}

const registerNode = (type, component) => globalNodeMap.set(type, component);
const getTypeNode = type => (globalNodeMap.has(type) ? globalNodeMap.get(type) : DefaultNode);

const nodeAnchors = [
  [0, 0.5],
  [0.5, 1],
  [1, 0.5],
  [0.5, 0],
];

function Gract({ data = {}, defaultNode = {}, defautEdge = {}, option = {}, layout }) {
  const { nodes = [], edges = [] } = data;
  const [_nodes, setNodes] = useState(nodes);
  const nodeSizeMap = useRef(new Map());
  const [edgesEls, setEdges] = useState([]);
  const nodesRef = useRef();
  nodesRef.current = _nodes;
  const updateNodePosition = (id, x, y) => {
    if (!option.nodeMove) {
      return false;
    }
    const _n = nodesRef.current;
    const target = _n.find(e => e.id === id);
    if (target) {
      target.x = x;
      target.y = y;
      setNodes([..._n]);
    }
  };

  useEffect(() => {
    const res = [];
    edges.map(({ source, target, ...rest }) => {
      const nMap = nodeSizeMap.current;
      const _n = nodesRef.current;
      if (nMap.has(source) && nMap.has(target)) {
        const s = nMap.get(source);
        const t = nMap.get(target);
        const sNode = _n.find(e => e.id === source);
        const tNode = _n.find(e => e.id === target);
        const startPoints = nodeAnchors.map(([xx, yy]) => [
          s.width * xx + sNode.x,
          s.height * yy + sNode.y,
        ]);
        const endPoints = nodeAnchors.map(([xx, yy]) => [
          t.width * xx + tNode.x,
          t.height * yy + tNode.y,
        ]);
        let resPoint = [];
        let minPos = null;
        startPoints.forEach(([sx, sy]) => {
          endPoints.forEach(([ex, ey]) => {
            const dis = Math.pow(ex - sx, 2) + Math.pow(ey - sy, 2);
            if (minPos === null || dis < minPos) {
              resPoint = [
                { x: sx, y: sy },
                { x: ex, y: ey },
              ];
              minPos = dis;
            }
          });
        });

        res.push(<BaseEdge key={res.length} start={resPoint[0]} end={resPoint[1]} {...rest} {...defautEdge} />);
      }
      setEdges(res);
    });
  }, [_nodes]);

  useEffect(() => {
    if (layout) {
      const _n = nodesRef.current;
      const nodeWithInfo = _n.map(e => ({ ...e, rect: nodeSizeMap.current.get(e.id) || {} }));
      const nodes = layout(nodeWithInfo, edges);
      setNodes(nodes);
    }
  }, [nodes]);

  return (
    <Canvas>
      {_nodes.map(node => {
        const { x = 0, y = 0, type, id } = { ...defaultNode, ...node };
        const Node = getTypeNode(type);
        return (
          <BaseNode
            x={x}
            y={y}
            onMove={(x, y) => updateNodePosition(id, x, y)}
            key={id}
            onSize={s => nodeSizeMap.current.set(id, s)}
          >
            <Node data={node} />
          </BaseNode>
        );
      })}
      {edgesEls}
    </Canvas>
  );
}

Gract.registerNode = registerNode;

export default Gract;
