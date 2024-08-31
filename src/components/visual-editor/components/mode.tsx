import React from "react";
import "./buttonized.css";
import { useVisualEditorContext } from "../visualEditorContext";

const Mode: React.FC = () => {
  const { mode, setMode } = useVisualEditorContext();
  const style: {
    container: React.CSSProperties;
    button: React.CSSProperties;
    activeButton: React.CSSProperties;
  } = {
    container: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "row",
    },
    button: {
      flex: "1",
      opacity: "50%",
      borderRadius: "5px",
      textAlign: "center",
      paddingLeft: "2px",
      color: "#c8d6e5",
      fontSize: "15px",
      margin: "2px",
      backgroundColor: "#576574",
      userSelect: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    activeButton: {
      flex: "2",
      backgroundColor: "#01a3a4",
      opacity: "100%",
      fontSize: "25px",
      paddingBottom: "2px",
    },
  };

  return (
    <>
      <div style={style.container}>
        <div
          className={mode === "edit" ? "" : "buttonized"}
          style={{
            ...style.button,
            ...(mode === "edit"
              ? {
                  ...style.activeButton,
                  ...{ backgroundColor: "#4CAF50", color: "white" },
                }
              : {}),
          }}
          onClick={() => {
            setMode("edit");
          }}
        >
          Edit
        </div>
        <div
          className={mode === "animate" ? "" : "buttonized"}
          style={{
            ...style.button,
            ...(mode === "animate"
              ? {
                  ...style.activeButton,
                  ...{ backgroundColor: "#039BE5", color: "white" },
                }
              : {}),
          }}
          onClick={() => {
            setMode("animate");
          }}
        >
          Animate
        </div>
      </div>
    </>
  );
};

export default Mode;
