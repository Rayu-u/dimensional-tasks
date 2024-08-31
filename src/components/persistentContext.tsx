import React, { useContext, createContext, useState } from "react";
import * as THREE from "three";

export const PersistentContext = createContext<{
  scene: THREE.Scene | null;
  objects: { object: THREE.Mesh; shapeType: string }[];
  setScene: (scene: THREE.Scene) => void;
  setObjects: (newObjects: { object: THREE.Mesh; shapeType: string }[]) => void;
  questionRecording: string;
  setQuestionRecording: (recording: string) => void;
  answerRecordings: string[];
  setAnswerRecordings: (recordings: string[]) => void;
  feedbackTexts: string[];
  setFeedbackTexts: (recordings: string[]) => void;
} | null>(null);

export const usePersistentContext = () => {
  const context = useContext(PersistentContext);
  if (!context) {
    throw new Error(
      "usePersistentContext must be used within a VisualEditorProvider"
    );
  }
  return context;
};

export const PersistentContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [objects, setObjects] = useState<
    { object: THREE.Mesh; shapeType: string }[]
  >([]);
  // Mapping Data
  const [questionRecording, setQuestionRecording] = useState<string>("");
  const [answerRecordings, setAnswerRecordings] = useState<string[]>([]);
  const [feedbackTexts, setFeedbackTexts] = useState<string[]>([]);

  return (
    <PersistentContext.Provider
      value={{
        scene,
        setScene,
        objects,
        setObjects,
        questionRecording,
        setQuestionRecording,
        answerRecordings,
        setAnswerRecordings,
        feedbackTexts,
        setFeedbackTexts,
      }}
    >
      {children}
    </PersistentContext.Provider>
  );
};
