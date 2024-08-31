import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useVisualEditorContext } from "../../visualEditorContext";
import { render } from "@testing-library/react";
import { log } from "console";
import { usePersistentContext } from "../../../persistentContext";

export const useObjectInteraction = (
  raycasterRef: THREE.Raycaster | null,
  rendererRef: THREE.Renderer | null,
  cameraRef: THREE.Camera | null
) => {
  const {
    mode,
    activeWriting,
    selectedObject,
    selectedAxis,
    selectedOperation,
  } = useVisualEditorContext();

  const { objects } = usePersistentContext();

  const objectsRef = useRef(objects.map((object) => object.object));
  const selectedObjectRef = useRef(selectedObject);
  const selectedAxisRef = useRef(selectedAxis);
  const selectedOperationRef = useRef(selectedOperation);
  const modeRef = useRef(mode);
  const activeWritingRef = useRef(activeWriting);

  useEffect(() => {
    objectsRef.current = objects.map((object) => object.object);
    selectedObjectRef.current = selectedObject;
    selectedAxisRef.current = selectedAxis;
    selectedOperationRef.current = selectedOperation;
    modeRef.current = mode;
    activeWritingRef.current = activeWriting;
  }, [
    selectedObject,
    selectedAxis,
    objects,
    selectedOperation,
    mode,
    activeWriting,
  ]);

  useEffect(() => {
    if (!raycasterRef || !cameraRef || !rendererRef) {
      return;
    }
    if (modeRef.current === "animate" && !activeWritingRef.current) {
      return;
    }

    let pickedObject: THREE.Object3D | null = null;
    let isDragging: boolean = false;
    let initialMouse = new THREE.Vector2();
    let initialObjectPosition = new THREE.Vector3();
    let planeNormal = new THREE.Vector3();
    let plane = new THREE.Plane();
    let intersectionPoint = new THREE.Vector3();
    let offset = new THREE.Vector3();
    const canvas = rendererRef.domElement;
    const rect = canvas.getBoundingClientRect();

    let previousMouse = new THREE.Vector2();

    const handleMouseDown = (event: MouseEvent) => {
      if (modeRef.current === "animate" && !activeWritingRef.current) {
        return;
      }

      initialMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      initialMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.setFromCamera(initialMouse, cameraRef);

      const intersects = raycasterRef.intersectObjects(
        objectsRef.current,
        true
      );

      if (intersects.length > 0) {
        for (const intersect of intersects) {
          const intersectedObject = intersect.object;
          if (selectedObjectRef.current === intersectedObject) {
            pickedObject = intersectedObject;
            isDragging = true;

            initialObjectPosition.copy(pickedObject.position);

            planeNormal
              .copy(cameraRef.getWorldDirection(new THREE.Vector3()))
              .negate();
            plane.setFromNormalAndCoplanarPoint(
              planeNormal,
              initialObjectPosition
            );

            if (raycasterRef.ray.intersectPlane(plane, intersectionPoint)) {
              offset.copy(intersectionPoint).sub(pickedObject.position);
            }

            break;
          }
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging || !pickedObject) return;
      if (modeRef.current === "animate" && !activeWritingRef.current) {
        return; // Prevent interaction if in "animate" mode and not recording
      }

      const currentMouse = new THREE.Vector2();
      currentMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      currentMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.setFromCamera(currentMouse, cameraRef);

      plane.setFromNormalAndCoplanarPoint(planeNormal, pickedObject.position);

      if (raycasterRef.ray.intersectPlane(plane, intersectionPoint)) {
        const newPosition = pickedObject.position.clone();

        if (selectedOperationRef.current === "move") {
          switch (selectedAxisRef.current) {
            case "x":
              newPosition.x = intersectionPoint.x - offset.x;

              break;
            case "y":
              newPosition.y = intersectionPoint.y - offset.y;
              break;
            case "z":
              newPosition.z = intersectionPoint.z - offset.z;
              break;
            case "xy":
              newPosition.x = intersectionPoint.x - offset.x;
              newPosition.y = intersectionPoint.y - offset.y;
              break;
            case "xz":
              newPosition.x = intersectionPoint.x - offset.x;
              newPosition.z = intersectionPoint.z - offset.z;
              break;
            case "yz":
              newPosition.y = intersectionPoint.y - offset.y;
              newPosition.z = intersectionPoint.z - offset.z;
              break;
            default:
              console.warn(
                "Invalid axis selected. Choose 'x', 'y', 'z' or 'xy', 'xz' or 'yz'."
              );
              break;
          }

          pickedObject.position.copy(newPosition);
        }

        if (selectedOperationRef.current === "scale") {
          let scaleFactor = 0.02;
          const minimumScale = 0.1;
          const maximumScale = 20;

          if (previousMouse.x < currentMouse.x) {
            scaleFactor = 1 + scaleFactor;
            // rechts, größer scalen
          } else {
            scaleFactor = 1 - scaleFactor;
            //links, kleiner scalen
          }

          let newScaleX = pickedObject.scale.x;
          let newScaleY = pickedObject.scale.y;
          let newScaleZ = pickedObject.scale.z;

          if (selectedAxisRef.current!.includes("x")) {
            newScaleX = Math.min(
              Math.max(scaleFactor * pickedObject.scale.x, minimumScale),
              maximumScale
            );
          }
          if (selectedAxisRef.current!.includes("y")) {
            newScaleY = Math.min(
              Math.max(scaleFactor * pickedObject.scale.y, minimumScale),
              maximumScale
            );
          }
          if (selectedAxisRef.current!.includes("z")) {
            newScaleZ = Math.min(
              Math.max(scaleFactor * pickedObject.scale.z, minimumScale),
              maximumScale
            );
          }

          pickedObject.scale.set(newScaleX, newScaleY, newScaleZ);
        }

        if (selectedOperationRef.current === "rotate") {
          let rotationAmount = 0.1;

          if (selectedAxisRef.current === "x") {
            if (previousMouse.y < currentMouse.y) {
              pickedObject.rotation.x += rotationAmount;
            } else if (previousMouse.y > currentMouse.y) {
              pickedObject.rotation.x -= rotationAmount;
            }
          } else if (selectedAxisRef.current === "y") {
            if (previousMouse.x < currentMouse.x) {
              pickedObject.rotation.y += rotationAmount;
            } else if (previousMouse.x > currentMouse.x) {
              pickedObject.rotation.y -= rotationAmount;
            }
          } else if (selectedAxisRef.current === "z") {
            // Rotation around the z-axis
            if (previousMouse.x < currentMouse.x) {
              pickedObject.rotation.z += rotationAmount;
            } else if (previousMouse.x > currentMouse.x) {
              pickedObject.rotation.z -= rotationAmount;
            }
          }
        }
        previousMouse.copy(currentMouse);
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      isDragging = false;
      pickedObject = null;
    };

    canvas.addEventListener("mousedown", handleMouseDown, false);
    canvas.addEventListener("mousemove", handleMouseMove, false);
    canvas.addEventListener("mouseup", handleMouseUp, false);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [raycasterRef, rendererRef, cameraRef]);
};
