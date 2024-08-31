import React from "react";

import ImageIcon from "../ImageIcon";

import xImg from "./../../assets/x-axis.png";
import yImg from "./../../assets/y-axis.png";
import zImg from "./../../assets/z-axis.png";
import xyImg from "./../../assets/xy.png";
import xzImg from "./../../assets/xz.png";
import yzImg from "./../../assets/yz.png";
import xyzImg from "./../../assets/xyz-axis.png";
import { useVisualEditorContext } from "../../visualEditorContext";

interface AxisSelectionProps {}

const axes: { name: string; img: string }[] = [
  { name: "xyz", img: xyzImg },
  { name: "x", img: xImg },
  { name: "y", img: yImg },
  { name: "z", img: zImg },
  { name: "xy", img: xyImg },
  { name: "xz", img: xzImg },
  { name: "yz", img: yzImg },
];
const AxisSelection: React.FC<AxisSelectionProps> = () => {
  const { mode, activeRecording, selectedOperation, selectedAxis, selectAxis } =
    useVisualEditorContext();

  const filteredAxes = axes.filter((axis) => {
    if (selectedOperation !== "scale") {
      if (axis.name === "xyz") return false;
    }
    if (selectedOperation === "scale" || selectedOperation === "rotate") {
      if (axis.name === "xy" || axis.name === "xz" || axis.name === "yz") {
        return false;
      }
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

  const determineColor = (axis: { name: string; img: string }): string => {
    const isSelected: boolean = selectedAxis === axis.name;

    if (mode === "animate" && activeRecording && isSelected) {
      return "#F44336"; // special case
    }
    return isSelected ? "#FF8A65" : "white";
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {filteredAxes.map((axis, index) => {
          return (
            <ImageIcon
              key={index}
              onClick={() => {
                if (mode === "animate" && activeRecording) {
                  return;
                }
                selectAxis(axis.name);
              }}
              color={determineColor(axis)}
              img={axis.img}
              width="30px"
              buttonize={shouldButtonize() && selectedAxis !== axis.name}
            ></ImageIcon>
          );
        })}
      </div>
    </>
  );
};

export default AxisSelection;
