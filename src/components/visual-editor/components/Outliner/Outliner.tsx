import React from "react";
import OutlineElement from "./OutlineElement";
import { useVisualEditorContext } from "../../visualEditorContext";
import * as THREE from "three";
import { usePersistentContext } from "../../../persistentContext";

interface OutlinerProps {}

const Outliner: React.FC<OutlinerProps> = () => {
  // manages objects to preview in the outliner

  const { mode, activeRecording, selectedObject, selectObject } =
    useVisualEditorContext();

  const { objects, setObjects } = usePersistentContext();

  const handleDelete = (object: THREE.Mesh) => {
    // eslint-disable-next-line no-alert
    if (window.confirm("Are you sure you want to delete this item?")) {
      setObjects(objects.filter((item) => item.object !== object));
      object.removeFromParent();
      (object.material as THREE.MeshStandardMaterial).dispose();
    }
  };

  return (
    <>
      <div
        style={{
          height: "350px",
          width: "200px",
          overflowY: "auto",
          overflowX: "clip",
          boxSizing: "border-box",
          padding: "10px",
        }}
      >
        {objects.length === 0
          ? mode === "animate"
            ? "No objects present to record"
            : "Start by adding an object."
          : mode === "animate" && !activeRecording && selectedObject === null
          ? "None selected"
          : !activeRecording
          ? "Click to select"
          : ""}
        {objects.map((object, index) => {
          return (
            <OutlineElement
              onClick={() => {
                if (mode === "animate" && activeRecording) {
                  return;
                }
                selectObject(object.object);
              }}
              key={object.object.id}
              object={object.object}
              shapeType={object.shapeType}
              selectedObject={selectedObject}
              onDelete={() => handleDelete(object.object)}
            ></OutlineElement>
          );
        })}
      </div>
    </>
  );
};

export default Outliner;
