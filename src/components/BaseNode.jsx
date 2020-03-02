import React, { useRef, useEffect } from 'react';

const Anchor = ({ x, y }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: x - 2,
        left: y - 3,
        borderRadius: '100%',
        width: 4,
        height: 4,
      }}
    />
  );
};

export default function BaseNode({ x, y, children, onMove, onSize }) {
  const el = useRef();
  const isMoving = useRef(false);
  const posRef = useRef({ x, y });
  posRef.current = { x, y };

  useEffect(() => {
    if (el.current && onSize) {
      onSize(el.current.getBoundingClientRect());
    }
  });

  useEffect(() => {
    if (el.current) {
      const { addEventListener, removeEventListener } = el.current;
      const mousedown = e => {
        e.stopPropagation();
        if (e.path.some(e => e === el.current)) {
          isMoving.current = true;
        }
      };
      const mousemove = ({ movementX, movementY }) => {
        if (isMoving.current) {
          const pos = posRef.current;
          onMove(pos.x + movementX, pos.y + movementY);
        }
      };
      const mouseup = e => {
        isMoving.current = false;
      };
      [
        ['mousedown', mousedown],
        ['mousemove', mousemove],
        ['mouseup', mouseup],
      ].forEach(([name, cb]) => {
        addEventListener(name, cb);
      });
      return () => {
        [
          ['mousedown', mousedown],
          ['mousemove', mousemove],
          ['mouseup', mouseup],
        ].forEach(([name, cb]) => {
          removeEventListener(name, cb);
        });
      };
    }
  }, []);

  return (
    <div
      ref={el}
      style={{
        position: 'absolute',
        transform: `translate3d(${x}px, ${y}px, 0)`,
        cursor: 'default',
        zIndex: 2,
      }}
    >
      {children}
    </div>
  );
}
