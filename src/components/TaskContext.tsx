import React, { useContext, createContext, useState } from "react";
import * as THREE from "three";
import { RecordingGroup } from "./visual-editor/components/Recorder/recordingTypes";

export interface Task {
  question: string;
  answerTexts: string[];
  answerImageUrls: string[];
  rightIndex: number;
}

export const TaskContext = createContext<{
  task: Task;
  setTask: (task: Task) => void;
  recordingGroups: RecordingGroup[];
  setRecordingGroups: (groups: RecordingGroup[]) => void;
} | null>(null);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("TaskContext must be used within a TaskContext");
  }
  return context;
};

export const TaskContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [task, setTask] = useState({
    question: "",
    answerTexts: [""] as string[],
    answerImageUrls: [""] as string[],
    rightIndex: 0, // Assuming the first answer is the correct one
  });
  const [recordingGroups, setRecordingGroups] = useState<RecordingGroup[]>([]);

  return (
    <TaskContext.Provider
      value={{
        task,
        setTask,
        recordingGroups,
        setRecordingGroups,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
