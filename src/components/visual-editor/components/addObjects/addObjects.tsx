import React from "react";
import * as THREE from "three";
import ImageIcon from "../ImageIcon";
import { useVisualEditorContext } from "../../visualEditorContext";
import { shapeIconImages, shapes, ObjectCreator } from "./ObjectHelper";
import { usePersistentContext } from "../../../persistentContext";

const ObjectAdder: React.FC = () => {
  const { mode } = useVisualEditorContext();
  const { objects, scene, setObjects } = usePersistentContext();

  let objectCreator = new ObjectCreator();

  const addObject = (objectType: string) => {
    const object = objectCreator.createObject(objectType);
    if (object) {
      scene?.add(object);

      setObjects([...objects, { object: object, shapeType: objectType }]);
      //   console.log("Objects array updated:", [
      //     ...objects,
      //     { object, shapeType: objectType },
      //   ]);
    } else {
      console.log("invalid Shape name provided:  ${objectType}");
    }
  };

  if (mode === "animate") return <></>;
  return (
    <>
      add to scene
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {shapes.map((shape) => (
          <ImageIcon
            onClick={() => addObject(shape.name)}
            buttonize
            color={shape.color}
            img={shapeIconImages[shape.name]}
            key={shape.name}
            width="45px"
          ></ImageIcon>
        ))}
      </div>
    </>
  );
};

export default ObjectAdder;
