import React from "react";
import OperationSelection from "./OperationSelection";
import AxisSelection from "./AxisSelection";

interface ActionToolbarProps {}

const ActionToolbar: React.FC<ActionToolbarProps> = () => {
  return (
    <>
      <OperationSelection></OperationSelection>
      <AxisSelection></AxisSelection>
    </>
  );
};

export default ActionToolbar;
