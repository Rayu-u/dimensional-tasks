import React, { useState, useRef } from "react";
import { useTaskContext } from "../TaskContext";
import DropDown from "../generalComponents/dropdownMenu";

interface MappingElementProps {
  text: string;
  recordingValue: string;
  feedbackValue?: string;
  isQuestion?: boolean;
  onRecordingChange: (recording: string) => void;
  onFeedbackChange?: (feedback: string) => void;
}

const MappingElement: React.FC<MappingElementProps> = ({
  text,
  recordingValue,
  feedbackValue = "",
  isQuestion = false,
  onRecordingChange,
  onFeedbackChange,
}) => {
  const styles: {
    outerDiv: React.CSSProperties;
    questionOrAnswer: React.CSSProperties;
  } = {
    outerDiv: {
      width: "1000px",
      height: "auto",
      padding: "10px",
      display: "flex",
    },
    questionOrAnswer: {},
  };

  const { recordingGroups } = useTaskContext();
  const [mappedRecording, mapRecording] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState<string>("");

  const handleSelectChange = (i: number) => {
    if (i === -1) {
      mapRecording("");
      onRecordingChange("");
      return;
    }
    mapRecording(recordingGroups[i].name);
    onRecordingChange(recordingGroups[i].name);
  };

  return (
    <div style={styles.outerDiv}>
      <p style={styles.questionOrAnswer}> {text}</p>
      <DropDown
        introText="to "
        selectedValue={
          mappedRecording.length > 0 ? mappedRecording : recordingValue
        }
        possibleValues={recordingGroups.map((group) => group.name)}
        onSelectedChange={handleSelectChange}
        canBeNone
      ></DropDown>
      {isQuestion ? null : (
        <>
          <label>Feedback Text</label>
          <input
            type="text"
            value={feedbackText.length > 0 ? feedbackText : feedbackValue}
            onChange={(e) => {
              setFeedbackText(e.target.value);
              if (onFeedbackChange) {
                onFeedbackChange(e.target.value);
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default MappingElement;
