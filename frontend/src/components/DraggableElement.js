import React, { useRef, memo } from 'react';
import Draggable from 'react-draggable';

/**
 * Stable draggable element using nodeRef pattern to avoid React 18 findDOMNode warnings
 * and DraggableCore mount issues. Memoized to prevent unnecessary rerenders.
 */
const DraggableElement = memo(function DraggableElement({
  element,
  isSelected,
  onSelect,
  onPositionChange,
  bounds = 'parent',
}) {
  const nodeRef = useRef(null);

  const handleStop = (e, data) => {
    if (onPositionChange) {
      onPositionChange(element.id, { x: data.x, y: data.y });
    }
  };

  const handleStart = (e) => {
    if (onSelect) {
      onSelect(element.id);
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: element.x || 0, y: element.y || 0 }}
      onStart={handleStart}
      onStop={handleStop}
      bounds={bounds}
      defaultClassName=""
      defaultClassNameDragging=""
      defaultClassNameDragged=""
    >
      <div
        ref={nodeRef}
        className={`absolute cursor-move select-none ${
          isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''
        }`}
        style={{
          transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
          touchAction: 'none',
        }}
        onMouseDown={() => onSelect && onSelect(element.id)}
        onTouchStart={() => onSelect && onSelect(element.id)}
      >
        {element.type === 'image' ? (
          <img
            src={element.src}
            alt="design"
            draggable={false}
            style={{
              width: element.width || 150,
              height: element.height || 150,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
            crossOrigin="anonymous"
          />
        ) : (
          <div
            style={{
              fontSize: element.fontSize || 24,
              color: element.color || '#FFFFFF',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              userSelect: 'none',
              fontFamily: element.fontFamily || 'Unbounded, sans-serif',
            }}
          >
            {element.content || 'TEXT'}
          </div>
        )}
      </div>
    </Draggable>
  );
});

export default DraggableElement;
