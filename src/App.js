import React, { useState, useRef } from "react";
import TransformerRectangel from "./TransformerRectangel";
import { Layer, Rect, Stage, Transformer } from "react-konva";
const initialPiks = [
  {
    x: 10,
    y: 10,
    points: [50, 50, 150, 50, 100, 150],
    tension: 0.5,
    fill: "red",
    id: "blob1",
  },
  {
    x: 10,
    y: 70,
    points: [50, 50, 150, 50, 100, 150],
    tension: 0.5,
    fill: "green",
    id: "blob2",
  },
  {
    x: 10,
    y: 130,
    points: [50, 50, 150, 50, 100, 150],
    tension: 0.5,
    fill: "yellow",
    id: "blob3",
  },
];
const App = () => {
  const [piks, setPiks] = useState(initialPiks);
  const [selectShape, setSelectShape] = useState(null);
  const [nodesArray, setNodes] = useState([]);
  const trRef = useRef();
  const layerRef = useRef();
  const Konva = window.Konva;
  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectShape(null);
      trRef.current.nodes([]);
      setNodes([]);
      // layerRef.current.remove(selectionRectangle);
    }
  };
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

  const onMouseMove = (e) => {
    if (!selection.current.visible) {
      return;
    }
    const pos = e.target.getStage().getPointerPosition();
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

  const onClickTap = (e) => {
    // if we are selecting with rect, do nothing
    if (selection.visible()) {
      return;
    }
    let stage = e.target.getStage();
    let layer = layerRef.current;
    let tr = trRef.current;
    // if click on empty area - remove all selections
    if (e.target === stage) {
      setSelectShape(null);
      setNodes([]);
      tr.nodes([]);
      layer.draw();
      return;
    }

    // do nothing if clicked NOT on our piks
    if (!e.target.hasName(".rect")) {
      return;
    }

    // do we press shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = tr.nodes().indexOf(e.target) >= 0;

    if (!metaPressed && !isSelected) {
      // if no key pressed and the node is not selected
      // select just one
      tr.nodes([e.target]);
    } else if (metaPressed && isSelected) {
      // if we pressed keys and node was selected
      // we need to remove it from selection:
      const nodes = tr.nodes().slice(); // use slice to have new copy of array
      // remove node from array
      nodes.splice(nodes.indexOf(e.target), 1);
      tr.nodes(nodes);
    } else if (metaPressed && !isSelected) {
      // add the node into selection
      const nodes = tr.nodes().concat([e.target]);
      tr.nodes(nodes);
    }
    layer.draw();
  };

  return (
    <Stage
      width={window.innerWidth + 400}
      height={window.innerHeight + 400}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchStart={checkDeselect}
      onClick={onClickTap}
    >
      <Layer ref={layerRef}>
        {piks.map((rect, i) => {
          return (
            <TransformerRectangel
              key={i}
              getKey={i}
              shapeProps={rect}
              isSelected={rect.id === selectShape}
              getLength={piks.length}
              onSelect={(e) => {
                if (e.current !== undefined) {
                  let temp = nodesArray;
                  if (!nodesArray.includes(e.current)) temp.push(e.current);
                  setNodes(temp);
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
            />
          );
        })}

        <Transformer
          // ref={trRef.current[getKey]}
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
  );
};

export default App;
