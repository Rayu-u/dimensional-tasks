import React, { useEffect, useState } from "react";

import ImageIcon from "../ImageIcon";

import moveImg from "./../../assets/move-icon.png";
import scaleImg from "./../../assets/size-icon.png";
import rotateImg from "./../../assets/rotate-icon.png";
import { useVisualEditorContext } from "../../visualEditorContext";

interface OperationSelectionProps {}

const operations: { name: string; img: string }[] = [
  { name: "move", img: moveImg },
  { name: "scale", img: scaleImg },
  { name: "rotate", img: rotateImg },
];
const OperationSelection: React.FC<OperationSelectionProps> = () => {
  const [lastOperation, setLastOperation] = useState<string>("");
  const {
    mode,
    activeRecording,
    selectAxis,
    selectedAxis,
    selectedOperation,
    selectOperation,
  } = useVisualEditorContext();

  useEffect(() => {
    const isMove = selectedOperation === "move";
    const isScale = selectedOperation === "scale";
    const isRotate = selectedOperation === "scale";

    const lastOperationIsMove = lastOperation === "move";
    const lastOperationIsScale = lastOperation === "scale";

    const isSelectedCombinationAxis =
      selectedAxis === "xy" || selectedAxis === "xz" || selectedAxis === "yz";
    const isSelectedAllAxes = selectedAxis === "xyz";

    if ((isScale || isRotate) && lastOperationIsMove) {
      if (isSelectedCombinationAxis) selectAxis("x");
      return;
    }
    if ((isMove || isRotate) && lastOperationIsScale) {
      if (isSelectedAllAxes) selectAxis("x");
      return;
    }
    if (selectedOperation === "scale") {
      selectAxis("xyz");
    }
  }, [selectedOperation]);

  // filters the available options based on the selected mode and sets their default values
  const filteredOperations = operations.filter((operation) => {
    // conditions for render, depending on mode
    if (mode === "animate" && operation.name === "scale") {
      // ensures the element for scaling is not rendered in animation mode and the selection is reset to valid values
      if (selectedOperation === "scale") {
        selectOperation("move");
        selectAxis("x");
      }
      return false;
    }
    return true;
  });

  const shouldButtonize = (): boolean => {
    if (mode === "animate" && activeRecording) {
      //dont buttonize
      return false;
    }
    return true;
  };

  const determineColor = (operation: { name: string; img: string }): string => {
    const isSelected: boolean = selectedOperation === operation.name;

    if (mode === "animate" && activeRecording && isSelected) {
      return "#F44336"; // special case
    }
    return isSelected ? "#FFE082" : "white";
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {filteredOperations.map((operation, index) => {
          return (
            <ImageIcon
              key={index}
              onClick={() => {
                if (mode === "animate" && activeRecording) {
                  return;
                }
                if (selectedOperation) setLastOperation(selectedOperation);
                selectOperation(operation.name);
              }}
              color={determineColor(operation)}
              img={operation.img}
              width="30px"
              buttonize={
                shouldButtonize() && selectedOperation !== operation.name
              }
            ></ImageIcon>
          );
        })}

        {mode === "animate" && !activeRecording && (
          <p
            style={{
              color: "white",
              fontSize: "15px",
              margin: "0",
              marginTop: "10px",
              marginLeft: "10px",
            }}
          >
            Select your desired operation and axis to record.
          </p>
        )}
      </div>
    </>
  );
};

export default OperationSelection;
