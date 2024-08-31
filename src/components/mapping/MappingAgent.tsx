import React, { useState } from "react";
import MappingElement from "./MappingElement";
import { useTaskContext } from "../TaskContext";
import { Recording } from "../visual-editor/components/Recorder/recordingTypes";
import { getFinalRecordings, FinalRecordingData } from "./combineRecordings";
import { usePersistentContext } from "../persistentContext";
import * as THREE from "three";
import { log } from "console";

// created total recordings array
// created map with question and which recording of that array
// answer and which recording, if none -1

//   total recordings, just map a number to each q and a, and add feedback texts to object, return a new visualTask object

interface VisualTask {
  question: string;
  answerTexts: string[];
  feedbackTexts: string[];
  answerImageUrls: string[];
  rightIndex: number;
  objects: THREE.MeshJSON[];
  recordings: FinalRecordingData[];
  recordingMap: { question: number; answers: number[] };
}

// recordings müssen während des Mapping prozesses, klick auf Create Visual Task, noch zu einem Recording zusammengefasst werden, extra step
// recordingGroup.retrieveTotalRecording("Recording 1")
// -> Access the Recording Agents for that

interface MappingAgentProps {}

const MappingAgent: React.FC<MappingAgentProps> = () => {
  const { task, recordingGroups } = useTaskContext();

  const {
    questionRecording,
    setQuestionRecording,
    answerRecordings,
    setAnswerRecordings,
    feedbackTexts,
    setFeedbackTexts,
    objects,
  } = usePersistentContext();

  const styles: {
    outerDiv: React.CSSProperties;
  } = {
    outerDiv: {
      width: "1000px",
      height: "auto",
      padding: "10px",
    },
  };

  const createVisualTask = () => {
    // let the necessary recordings be created and produce right array
    const selectedRecordingNames: string[] = [
      questionRecording,
      ...answerRecordings,
    ];
    const finalRecordings = getFinalRecordings(
      recordingGroups,
      selectedRecordingNames
    );

    const visualTask: VisualTask = {
      question: task.question,
      answerTexts: task.answerTexts,
      feedbackTexts:
        feedbackTexts.length > 0
          ? feedbackTexts
          : task.answerTexts.map(() => ""),
      answerImageUrls: task.answerImageUrls,
      rightIndex: task.rightIndex,
      objects: objects.map((object) =>
        // new THREE.Group().add(object.object).toJSON()
        object.object.toJSON()
      ),
      recordings: finalRecordings,
      recordingMap: {
        question: questionRecording ? 0 : -1,
        answers: answerRecordings.map((recordingName) => {
          return finalRecordings.findIndex((recording) => {
            return recording.name === recordingName;
          });
        }),
      },
    };
    navigator.clipboard.writeText(JSON.stringify(visualTask));
  };

  const handleAnswerMapping = (recording: string, index: number) => {
    const newAnswerRecordings = [...answerRecordings];
    newAnswerRecordings[index] = recording;
    setAnswerRecordings(newAnswerRecordings);
  };

  const handleFeedbackMapping = (feedback: string, index: number) => {
    const newFeedbackTexts = [...feedbackTexts];
    newFeedbackTexts[index] = feedback;
    setFeedbackTexts(newFeedbackTexts);
  };

  return (
    <div style={styles.outerDiv}>
      {task.question.length > 0 && (
        <MappingElement
          onRecordingChange={(recording) => setQuestionRecording(recording)}
          recordingValue={questionRecording}
          isQuestion
          text={task.question}
        ></MappingElement>
      )}
      {task.answerTexts[0].length > 0 && (
        <>
          {task.answerTexts.map((answerText, index) => {
            return (
              <MappingElement
                key={index}
                recordingValue={answerRecordings[index]}
                feedbackValue={feedbackTexts[index]}
                onRecordingChange={(recording) =>
                  handleAnswerMapping(recording, index)
                }
                onFeedbackChange={(feedbackText) =>
                  handleFeedbackMapping(feedbackText, index)
                }
                text={answerText}
              ></MappingElement>
            );
          })}
          <button type="button" onClick={createVisualTask}>
            Create Visual Task and Copy to Clipboard
          </button>
        </>
      )}
    </div>
  );
};

export default MappingAgent;
