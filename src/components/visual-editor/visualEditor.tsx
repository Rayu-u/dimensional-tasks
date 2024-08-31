import React from "react";
import "./visualEditor.scss";
import Display from "./components/display/display";
import Mode from "./components/mode";
import ObjectAdder from "./components/addObjects/addObjects";
import RecordButtons from "./components/Recorder/RecordButtons";
import RecordingReadyOverlay from "./components/Recorder/RecordingReadyOverlay";
import RecordingGroupDisplay from "./components/Recorder/RecordingInfo";
import Outliner from "./components/Outliner/Outliner";
import ActionToolbar from "./components/ActionToolbar/ActionToolbar";
import {
  useVisualEditorContext,
  VisualEditorProvider,
} from "./visualEditorContext";

const VisualEditorContent: React.FC = () => {
  const { mode } = useVisualEditorContext();
  return (
    <div className="parent">
      <div className="addOrRecord">
        {mode === "edit" ? (
          <ObjectAdder></ObjectAdder>
        ) : (
          <RecordButtons></RecordButtons>
        )}
      </div>
      <div className="actions">
        <ActionToolbar></ActionToolbar>
      </div>{" "}
      <div className="mode">
        <Mode></Mode>
      </div>
      <div className="outliner">
        <Outliner></Outliner>
      </div>
      <div
        className="scene"
        style={{ width: "500px", height: "300px", position: "relative" }}
      >
        <RecordingReadyOverlay></RecordingReadyOverlay>
        <Display></Display>
      </div>
      <div className="recording-info"></div>
      <div className="timeline-actions">
        {mode === "animate" && <RecordingGroupDisplay></RecordingGroupDisplay>}
      </div>
    </div>
  );
};

const VisualEditor: React.FC = () => {
  return (
    <VisualEditorProvider>
      <VisualEditorContent />
    </VisualEditorProvider>
  );
};

export default VisualEditor;
