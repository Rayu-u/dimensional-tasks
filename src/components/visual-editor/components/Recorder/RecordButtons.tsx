import React from "react";
import "./../buttonized.css";
import { useVisualEditorContext } from "../../visualEditorContext";
import { usePersistentContext } from "../../../persistentContext";

interface RecordButtonsProps {}

const RecordButtons: React.FC<RecordButtonsProps> = () => {
  const {
    setActiveRecording,
    setActiveWriting,
    activeRecording,
    selectedObject,
  } = useVisualEditorContext();

  const { objects } = usePersistentContext();

  const styles: {
    recordButton: React.CSSProperties;
    stopButton: React.CSSProperties;
    stopStripe: React.CSSProperties;
    invisibleStripe: React.CSSProperties;
  } = {
    recordButton: {
      width: "50px",
      height: "50px",
      borderRadius: "80%",
      backgroundColor: "#F44336",
      margin: "10px",
    },
    stopButton: {
      width: "45px",
      height: "45px",
      display: "flex",
      flexDirection: "row",
      padding: "2.5px",
      margin: "10px",
    },
    stopStripe: {
      backgroundColor: "#66BB6A",
      flex: "1",
    },
    invisibleStripe: {
      flex: "1",
    },
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "end",
          justifyContent: "center",
        }}
      >
        <div
          onClick={() => {
            if (objects.length === 0 || selectedObject == null) {
              return;
            }
            setActiveRecording(true);
          }}
          className={
            activeRecording || objects.length === 0 || selectedObject == null
              ? ""
              : "buttonized"
          }
          style={{
            ...styles.recordButton,
            opacity: activeRecording ? "100%" : "50%",
          }}
        ></div>
        <div
          onClick={() => {
            setActiveRecording(false);
            setActiveWriting(false);
          }}
          className={activeRecording ? "buttonized" : ""}
          style={{
            ...styles.stopButton,
            opacity: !activeRecording ? "100%" : "50%",
          }}
        >
          <div style={styles.stopStripe}></div>
          <div style={styles.invisibleStripe}></div>
          <div style={styles.stopStripe}></div>
        </div>
      </div>
    </>
  );
};

export default RecordButtons;
