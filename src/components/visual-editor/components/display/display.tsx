import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import * as sceneBuilder from "./../../threeJSSetup/sceneBuilder";
import { useVisualEditorContext } from "../../visualEditorContext";
import { useObjectInteraction } from "./useObjectInteractions";
import { useRecorder } from "../Recorder/useRecorder";
import { useTaskContext } from "../../../TaskContext";
import { usePersistentContext } from "../../../persistentContext";

const Display: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const raycaster = useRef<THREE.Raycaster | null>(null);

  const {
    activeWriting,
    selectedObject,
    selectedRecordingGroupIndex,
    selectRecordingGroupIndex,
  } = useVisualEditorContext();

  const { objects, setScene } = usePersistentContext();
  const { recordingGroups, setRecordingGroups } = useTaskContext();
  //runs after initial render, set up three.js scene
  useEffect(() => {
    const canvas = canvasRef.current as HTMLDivElement;

    const sceneProps: sceneBuilder.SceneProperties = {
      width: 500,
      height: 300,
      visibleAreaWidth: 8,
    };
    camera.current = new THREE.PerspectiveCamera();
    renderer.current = new THREE.WebGLRenderer({
      antialias: true,
    });

    setUpRenderer(
      renderer.current!,
      canvas,
      sceneProps.width,
      sceneProps.height
    );
    const scene = sceneBuilder.buildSceneAndAdjustCamera(
      camera.current!,
      sceneProps
    );
    scene.background = new THREE.Color("#E6D1B3");

    sceneRef.current = scene;
    setScene(scene);

    raycaster.current = new THREE.Raycaster();

    objects.forEach((object) => {
      scene.add(object.object);
      console.log("Position:", object.object.position);
      console.log("Rotation:", object.object.rotation);
      console.log("Scale:", object.object.scale);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.current!.render(scene, camera.current!);
    };
    animate();

    return () => {
      canvas.removeChild(renderer.current!.domElement);
      renderer.current!.dispose();
    };
  }, []);

  useObjectInteraction(raycaster.current, renderer.current, camera.current);

  useRecorder(
    activeWriting,
    selectedObject,
    objects,
    selectedRecordingGroupIndex,
    selectRecordingGroupIndex,
    recordingGroups,
    setRecordingGroups
  );

  const setUpRenderer = (
    renderer: THREE.WebGLRenderer,
    canvas: HTMLDivElement,
    width: number,
    height: number
  ) => {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(width, height); // will also be adjusted to
    canvas.appendChild(renderer.domElement);
  };

  return <div id="canvas" ref={canvasRef}></div>;
};

export default Display;
