import React, { useState, useEffect } from "react";
import ImageIcon from "../ImageIcon";
import TextInput from "./TextInputElement";
import * as THREE from "three";
import deleteImg from "./../../assets/delete-icon.png";
import { ColorPicker } from "primereact/colorpicker";
import "./../buttonized.css";
import "./colorPickerStyling.css";
import { shapeIconImages } from "./../addObjects/ObjectHelper";
import { useVisualEditorContext } from "../../visualEditorContext";

interface OutlineElementProps {
  object: THREE.Mesh;
  shapeType: string;
  onClick: (event: React.MouseEvent) => void;
  selectedObject: THREE.Mesh | null;
  onDelete: () => void;
}

const OutlineElement: React.FC<OutlineElementProps> = ({
  object,
  shapeType,
  onClick,
  selectedObject,
  onDelete,
}) => {
  const { mode, activeRecording } = useVisualEditorContext();
  const [objectName, setObjectName] = useState<string>(object.name);
  const [objectColorHex, setObjectColorHex] = useState<string>(
    "#" + (object.material as THREE.MeshStandardMaterial).color.getHexString()
  );
  const determineBorderColor = (): string => {
    const isSelected: boolean = selectedObject === object;

    if (mode === "animate" && activeRecording && isSelected) {
      return "5px solid #EF5350"; // special case
    }
    return isSelected
      ? "5px dotted " + objectColorHex
      : "4px solid transparent";
  };

  const styles: {
    outerDiv: React.CSSProperties;
    iconWrapper: React.CSSProperties;
    textWrapper: React.CSSProperties;
    controlsWrapper: React.CSSProperties;
    deleteButton: React.CSSProperties;
  } = {
    outerDiv: {
      width: "150px",
      height: "30px",
      padding: "10px",
      paddingLeft: "0px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      marginBottom: "10px",
      border: determineBorderColor(),
    },
    iconWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "1px",
    },
    textWrapper: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      maxWidth: "70px",
      overflowX: "clip",
    },
    controlsWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "4px",
    },
    deleteButton: {
      width: "20px",
      height: "20px",
      cursor: "pointer",
    },
  };

  useEffect(() => {
    object.name = objectName;
  }, [objectName]);

  useEffect(() => {
    (object.material as THREE.MeshStandardMaterial).color.set(objectColorHex);
  }, [objectColorHex]);

  const shouldButtonize = (): boolean => {
    if (mode === "animate" && activeRecording) {
      //dont buttonize
      return false;
    }
    return true;
  };

  return (
    <div
      onClick={onClick}
      style={styles.outerDiv}
      className={
        shouldButtonize() && selectedObject !== object ? "buttonized" : ""
      }
    >
      <div style={styles.iconWrapper}>
        <ImageIcon
          color={objectColorHex}
          img={shapeIconImages[shapeType]}
          width="25px"
        />
      </div>
      <div style={styles.textWrapper}>
        <TextInput value={objectName} setValue={setObjectName} />
      </div>

      {mode === "animate" ? (
        <></>
      ) : (
        <div style={styles.controlsWrapper}>
          <ColorPicker
            panelStyle={{
              backgroundColor: "#566175",
              borderRadius: "3px",
            }}
            className="colorpicker"
            format="hex"
            value={objectColorHex}
            onChange={(e) => setObjectColorHex("#" + e.value)}
            style={{ width: "30px", height: "30px" }} // Adjust the size to fit nicely
          />
          <img
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={styles.deleteButton}
            className="buttonized"
            src={deleteImg}
            alt="object-deleter"
          />
        </div>
      )}
    </div>
  );
};

export default OutlineElement;
