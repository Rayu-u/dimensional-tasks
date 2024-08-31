import React, { useContext, createContext, useState } from "react";
import * as THREE from "three";
import { RecordingGroup } from "./components/Recorder/recordingTypes";

export const VisualEditorContext = createContext<{
  mode: string;
  setMode: (mode: string) => void;
  selectedObject: THREE.Mesh | null;
  selectObject: (object: THREE.Mesh | null) => void;
  selectedOperation: string | null;
  selectOperation: (operationName: string | null) => void;
  selectedAxis: string | null;
  selectAxis: (axis: string | null) => void;
  activeRecording: boolean | null;
  setActiveRecording: (recording: boolean | null) => void;
  activeWriting: boolean;
  setActiveWriting: (writing: boolean) => void;

  selectedRecordingGroupIndex: number;
  selectRecordingGroupIndex: (index: number) => void;
} | null>(null);

export const useVisualEditorContext = () => {
  const context = useContext(VisualEditorContext);
  if (!context) {
    throw new Error(
      "useVisualEditorContext must be used within a VisualEditorProvider"
    );
  }
  return context;
};

export const VisualEditorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState("edit");
  const [selectedObject, selectObject] = useState<THREE.Mesh | null>(null);
  const [selectedOperation, selectOperation] = useState<string | null>("move");
  const [selectedAxis, selectAxis] = useState<string | null>("x");
  const [activeRecording, setActiveRecording] = useState<boolean | null>(false);
  const [activeWriting, setActiveWriting] = useState<boolean>(false);

  const [selectedRecordingGroupIndex, selectRecordingGroupIndex] =
    useState<number>(-1);

  return (
    <VisualEditorContext.Provider
      value={{
        mode,
        setMode,
        selectedObject,
        selectObject,
        selectedOperation,
        selectOperation,
        selectedAxis,
        selectAxis,
        activeRecording,
        setActiveRecording,
        activeWriting,
        setActiveWriting,
        selectedRecordingGroupIndex,
        selectRecordingGroupIndex,
      }}
    >
      {children}
    </VisualEditorContext.Provider>
  );
};
