import React from "react";
import { RecordingGroup } from "./recordingTypes";
import { useVisualEditorContext } from "../../visualEditorContext";
import DropDown from "../../../generalComponents/dropdownMenu";
import { useTaskContext } from "../../../TaskContext";

const RecordingGroupDisplay: React.FC = ({}) => {
  const {
    selectedRecordingGroupIndex,
    selectRecordingGroupIndex,
    activeRecording,
  } = useVisualEditorContext();
  const { recordingGroups } = useTaskContext();

  const handleSelectChange = (i: number) => {
    selectRecordingGroupIndex(i);
    // will be -1 if no recording group is selected
  };

  return (
    <>
      <DropDown
        introText="Select a Recording Group:"
        expendable={true}
        disabled={activeRecording ? true : false}
        selectedValue={
          selectedRecordingGroupIndex !== -1
            ? recordingGroups[selectedRecordingGroupIndex].name
            : "Start New Recording"
        }
        expendingValue="Start New Recording"
        possibleValues={
          recordingGroups &&
          recordingGroups.map((group, index) => {
            return group.name;
          })
        }
        onSelectedChange={handleSelectChange}
      ></DropDown>
    </>
  );
};

export default RecordingGroupDisplay;
