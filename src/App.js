import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePositionReorder } from "./use-position-reorder";
import { useMeasurePosition } from "./use-measure-position";
import "./styles.css";

export default function App() {
  const [items, setItems] = useState(["eat", "work", "sleep", "repeat"]);
  console.log("items", items);
  return <Container items={items} onChangeOrder={setItems} />;
}

function Container({ items, onChangeOrder }) {
  const [updatePosition, updateOrder] = usePositionReorder(
    items,
    onChangeOrder
  );
  return (
    <table>
      <tbody>
        {items.map((item, i) => (
          <Item
            key={item}
            item={item}
            index={i}
            updatePosition={updatePosition}
            updateOrder={updateOrder}
          />
        ))}
      </tbody>
    </table>
  );
}

function Item({ index, item, updatePosition, updateOrder }) {
  const [isDragging, setDragging] = useState(false);
  const ref = useMeasurePosition((pos) => updatePosition(index, pos));

  return (
    <motion.tr
      ref={ref}
      layout
      initial={false}
      style={{
        background: "white",
        height: 40,
        zIndex: isDragging ? 3 : 1,
        borderRadius: 5
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0px 3px 3px rgba(0,0,0,0.15)"
      }}
      whileTap={{
        scale: 1.12,
        boxShadow: "0px 5px 5px rgba(0,0,0,0.1)"
      }}
      drag="y"
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      onViewportBoxUpdate={(_viewportBox, delta) => {
        isDragging && updateOrder(index, delta.y.translate);
      }}
    >
      <td>{item}</td>
    </motion.tr>
  );
}
