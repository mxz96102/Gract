import React from 'react';

const pathMap = {
  curve: (width, height) => {
    if (width > height) {
      return `M0,0 C${width},0 0,${height} ${width} ${height}`;
    }
      return `M0,0 C0,${height} ${width},0 ${width} ${height}`;
  },
  line: (width, height) => {
    return `M0,0 L${width} ${height}`;
  },
  polyline: (width, height) => {
    if (width < height) {
      return `M0,0 L${width / 2},0 L${width / 2},${height} L${width} ${height}`;
    }
      return `M0,0 L0,${height / 2} L${width},${height / 2} L${width} ${height}`;
  },
};

export default function BaseEdge({ start, end, style = {}, type }) {
  let [width, height] = [end.x - start.x, end.y - start.y];
  const generatePath = () => {
    const func = pathMap[type] || pathMap.line;
    return func(width - 10, height - 10);
  };
  if (Math.abs(width) <= 0) {
    width = 3;
  }
  if (Math.abs(height) <= 0) {
    height = 3;
  }

  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate3d(${start.x}px, ${start.y}px, 0)`,
        zIndex: 1,
        ...style
      }}
    >
      <svg
        width={`${Math.abs(width)}px`}
        height={`${Math.abs(height)}px`}
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {' '}
          <marker
            style={{ overflow: 'visible' }}
            id="arrow"
            markerWidth="20"
            markerHeight="20"
            refX="0"
            refY="0"
            orient="auto"
            markerUnits="strokeWidth"
          >
            {' '}
            <path d="M0,-3 L0,3 L9,0 z" fill="black" />{' '}
          </marker>{' '}
        </defs>
        <g>
          <path
            d={generatePath()}
            fill="transparent"
            stroke="black"
            strokeWidth="1"
            strokeLinecap="round"
            markerEnd="url(#arrow)"
          />
        </g>
      </svg>
    </div>
  );
}
