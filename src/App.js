import React, { useState, useRef } from "react";
import TransformerRectangel from "./TransformerRectangel";
import { Layer, Rect, Stage, Transformer } from "react-konva";

const App = () => {
  const [piks, setPiks] = useState([]);
  const [rects, setRects] = useState([]);
  const [isRects, setIsRects] = useState(false);
  const [isPiks, setIsPiks] = useState(false);

  const [selectShape, setSelectShape] = useState(null);
  const [nodesArray, setNodesArray] = useState([]);
  const trRef = useRef();
  const layerRef = useRef();
  const Konva = window.Konva;
  const selectionRectRef = useRef();
  const selection = useRef({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  const updateSelectionRect = () => {
    const node = selectionRectRef.current;
    node.setAttrs({
      visible: selection.current.visible,
      x: Math.min(selection.current.x1, selection.current.x2),
      y: Math.min(selection.current.y1, selection.current.y2),
      width: Math.abs(selection.current.x1 - selection.current.x2),
      height: Math.abs(selection.current.y1 - selection.current.y2),
      fill: "rgba(0, 161, 255, 0.3)",
    });
    node.getLayer().batchDraw();
  };

  const oldPos = useRef(null);
  const onMouseDown = (e) => {
    const isElement = e.target.findAncestor(".elements-container");
    const isTransformer = e.target.findAncestor("Transformer");
    if (isElement || isTransformer) {
      return;
    }
    const pos = e.target.getStage().getPointerPosition();
    selection.current.visible = true;
    selection.current.x1 = pos.x;
    selection.current.y1 = pos.y;
    selection.current.x2 = pos.x;
    selection.current.y2 = pos.y;
    updateSelectionRect();
  };
  const onMouseUp = () => {
    oldPos.current = null;
    if (!selection.current.visible) {
      return;
    }
    const selBox = selectionRectRef.current.getClientRect();
    const elements = [];
    layerRef.current.find(".rectangle").forEach((elementNode) => {
      const elBox = elementNode.getClientRect();
      if (Konva.Util.haveIntersection(selBox, elBox)) {
        elements.push(elementNode);
      }
    });
    trRef.current.nodes(elements);
    selection.current.visible = false;
    // disable click event
    Konva.listenClickTap = false;
    updateSelectionRect();
  };
  const onMouseMove = (e) => {
    if (!selection.current.visible) {
      return;
    }
    const pos = e.target.getStage().getPointerPosition();
    selection.current.x2 = pos.x;
    selection.current.y2 = pos.y;
    updateSelectionRect();
  };

  const handelCreatePik = () => {
    setIsRects(false);
    setPiks((prevPiks) => [
      ...prevPiks,
      {
        id: piks.toString(),
        x: piks.length * 100,
        color: Konva.Util.getRandomColor(),
      },
    ]);
    console.log("piks length : " + piks.length);
  };
  const handelCreateRect = () => {
    setIsPiks(false);
    setRects((prevRects) => [
      ...prevRects,
      {
        id: rects.toString(),
        x: rects.length * 100,
        color: Konva.Util.getRandomColor(),
      },
    ]);
    console.log("rects length : " + rects.length);
  };
  return (
    <>
      <button onClick={handelCreatePik}> CreatePik</button>
      <button onClick={handelCreateRect}> CreateRect</button>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        <Layer ref={layerRef}>
          {rects.map((rect, i) => {
            return (
              <TransformerRectangel
                isRect={isRects}
                key={i}
                getKey={i}
                color={rect.color}
                shapeProps={rect}
                isSelected={rect.id === selectShape}
                onSelect={(e) => {
                  if (e.current !== undefined) {
                    let temp = nodesArray;
                    if (!nodesArray.includes(e.current)) temp.push(e.current);
                    setNodesArray(temp);
                    trRef.current.nodes(nodesArray);
                    trRef.current.nodes(nodesArray);
                    trRef.current.getLayer().batchDraw();
                  }
                  setSelectShape(rect.id);
                }}
                onChange={(newAttrs) => {
                  const rects = piks.slice();
                  rects[i] = newAttrs;
                  setPiks(rects);
                  // console.log(rects)
                }}
                x={rect.x}
              />
            );
          })}

          {piks.map((pik, i) => {
            return (
              <TransformerRectangel
                isPik={isPiks}
                key={i}
                getKey={i}
                color={pik.color}
                shapeProps={pik}
                isSelected={pik.id === selectShape}
                onSelect={(e) => {
                  if (e.current !== undefined) {
                    let temp = nodesArray;
                    if (!nodesArray.includes(e.current)) temp.push(e.current);
                    setNodesArray(temp);
                    trRef.current.nodes(nodesArray);
                    trRef.current.nodes(nodesArray);
                    trRef.current.getLayer().batchDraw();
                  }
                  setSelectShape(pik.id);
                }}
                onChange={(newAttrs) => {
                  const rects = piks.slice();
                  rects[i] = newAttrs;
                  setPiks(rects);
                  // console.log(rects)
                }}
                x={pik.x}
              />
            );
          })}
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
          <Rect fill="rgba(0,0,255,0.5)" ref={selectionRectRef} />
        </Layer>
      </Stage>
    </>
  );
};

export default App;
