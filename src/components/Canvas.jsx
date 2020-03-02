import React, { useState, useRef, useEffect } from 'react';

function usePosition(initX = 0, initY = 0) {
  const [x, setX] = useState(initX);
  const [y, setY] = useState(initY);
  const setPosition = (nx, ny) => {
    setX(nx);
    setY(ny);
  };

  return { x, y, setPosition };
}

function useItemState(initialState = []) {
  const [is, setis] = useState(initialState);
  const set = (key, bool) => setis(bool ? [...is, key] : [...is.filter(e => e !== key)]);
  const get = key => is.includes(key);
  return {
    set,
    get,
  };
}

export default function Canvas({ children, style = {} }) {
  const { x, y, setPosition } = usePosition();
  const itemState = useItemState();
  const el = useRef();
  const inner = useRef();

  useEffect(() => {
    if (el.current) {
      const container = el.current;
      const { addEventListener } = container;
      const mousedown = e => {
        if (e.target === inner.current || e.target === el.current) {
          itemState.set('mouse', true);
        }
      };
      const mousemove = ({ movementX, movementY }) => {
        if (itemState.get('mouse')) {
          setPosition(x - movementX, y - movementY);
        }
      };
      const mouseup = e => {
        if (e.target === inner.current || e.target === el.current) {
          itemState.set('mouse', false);
        }
      };
      [
        ['mousedown', mousedown],
        ['mousemove', mousemove],
        ['mouseup', mouseup],
      ].forEach(([name, cb]) => {
        addEventListener(name, cb);
      });
      return () => {
        if (el.current) {
          const { removeEventListener } = el.current;
          [
            ['mousedown', mousedown],
            ['mousemove', mousemove],
            ['mouseup', mouseup],
          ].forEach(([name, cb]) => {
            removeEventListener(name, cb);
          });
        }
      };
    }
  }, [itemState]);

  return (
    <div
      ref={el}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: itemState.get('mouse') ? 'grabbing' : 'grab',
        ...style,
      }}
    >
      <div
        ref={inner}
        style={{ width: '100%', height: '100%', transform: `translate3d(${-x}px, ${-y}px, 0)` }}
      >
        {children}
      </div>
    </div>
  );
}
