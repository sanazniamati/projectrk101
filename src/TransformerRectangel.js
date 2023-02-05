import React, { useRef } from "react";
import { Line, Rect } from "react-konva";

const TransformerRectangel = ({
  shapeProps,
  onSelect,
  onChange,
  x,
  color,
  isRect,
  isPik,
}) => {
  const shapeRef = useRef();
  const rectRef = useRef();
  return (
    <>
      <Rect
        visible={isPik}
        ref={rectRef}
        y={150}
        width={50}
        height={50}
        stroke={color}
        onClick={() => onSelect(rectRef)}
        onTap={() => onSelect(rectRef)}
        {...shapeProps}
        x={x}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          onChange({
            ...shapeProps,
          });
        }}
      />
      <Line
        visible={isRect}
        stroke={color}
        y={20}
        points={[0, 0, 100, 0, 50, 100]}
        onClick={() => onSelect(shapeRef)}
        onTap={() => onSelect(shapeRef)}
        ref={shapeRef}
        {...shapeProps}
        x={x}
        tension={0.5}
        name="rectangle"
        draggable
        closed={true}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          onChange({
            ...shapeProps,
          });
        }}
      />
    </>
  );
};
export default TransformerRectangel;
