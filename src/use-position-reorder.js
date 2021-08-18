import { useRef } from "react";
import { distance } from "popmotion";

const arrayMoveMutate = (array, from, to) => {
  const startIndex = from < 0 ? array.length + from : from;
  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = to < 0 ? array.length + to : to;
    const [item] = array.splice(from, 1);
    array.splice(endIndex, 0, item);
  }
};

const move = (array, from, to) => {
  array = [...array];
  arrayMoveMutate(array, from, to);
  return array;
};

const clamp = (min, max, v) => Math.min(Math.max(v, min), max);

export function usePositionReorder(order, setOrder) {
  const positions = useRef([]).current;
  const updatePosition = (i, offset) => (positions[i] = offset);
  const updateOrder = (i, dragOffset) => {
    const targetIndex = findIndex(i, dragOffset, positions);
    if (targetIndex !== i) setOrder(move(order, i, targetIndex));
  };
  return [updatePosition, updateOrder];
}

export const findIndex = (i, yOffset, positions) => {
  const buffer = 30;
  let target = i;
  const { top, height } = positions[i];
  const bottom = top + height;
  // If moving down
  if (yOffset > 0) {
    const nextItem = positions[i + 1];
    if (nextItem === undefined) return i;
    const swapOffset =
      distance(bottom, nextItem.top + nextItem.height / 2) + buffer;
    if (yOffset > swapOffset) target = i + 1;
    // If moving up
  } else if (yOffset < 0) {
    const prevItem = positions[i - 1];
    if (prevItem === undefined) return i;
    const prevBottom = prevItem.top + prevItem.height;
    const swapOffset = distance(top, prevBottom - prevItem.height / 2) + buffer;
    if (yOffset < -swapOffset) target = i - 1;
  }
  return clamp(0, positions.length, target);
};
