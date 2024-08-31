import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Recording, RecordingGroup } from "./recordingTypes";

export const useRecorder = (
  activeWriting: boolean,
  selectedObject: THREE.Mesh | null,
  objects: { object: THREE.Mesh; shapeType: string }[],
  selectedRecordingGroupIndex: number,
  selectRecordingGroupIndex: (index: number) => void,
  recordingGroups: RecordingGroup[],
  setRecordingGroups: (recordingGroup: RecordingGroup[]) => void
) => {
  const recordingRef = useRef<Recording | null>(null);

  const _addRecordingToSelectedGroup = () => {
    console.log(recordingRef.current);
    setRecordingGroups(
      recordingGroups.map((group, index) => {
        if (index === selectedRecordingGroupIndex) {
          // we're editing the right recording group
          const objectRecordings = [...group.objectRecordings];
          // might be undefined still
          const currentObjectRecording = objectRecordings.find(
            (objectRecording) =>
              objectRecording.objectUUID === selectedObject!.uuid
          );

          if (currentObjectRecording) {
            console.log(
              "the object has already been recorded so the recording was added right away!"
            );
            currentObjectRecording.recordings = [
              ...currentObjectRecording.recordings,
              recordingRef.current!,
            ];
          } else {
            console.log(
              "none could be found yet. No Worries! Creating one right now: "
            );
            objectRecordings.push({
              objectUUID: selectedObject!.uuid,
              recordings: [recordingRef.current!],
            });
          }
          return { ...group, objectRecordings };
        }
        return group;
      })
    );
  };

  useEffect(() => {
    recordingRef.current = null;
  }, [selectedRecordingGroupIndex]);

  useEffect(() => {
    if (!activeWriting || !selectedObject || !objects) {
      return;
    }

    let interval: NodeJS.Timeout | null = null;

    if (activeWriting && selectedObject) {
      if (selectedRecordingGroupIndex === -1) {
        const newRecGroup: RecordingGroup = {
          name: "Recording " + (recordingGroups.length + 1),
          objectRecordings: [],
        };

        // not -1, bcs its most likely not changed yet, so it will take the old index.
        selectRecordingGroupIndex(recordingGroups.length);
        setRecordingGroups([...recordingGroups, newRecGroup]);
        return;
      }

      //astarting position
      const startData = {
        position: selectedObject.position.clone(),
        rotation: selectedObject.rotation.clone(),
        scale: selectedObject.scale.clone(),
      };

      // initialize recordingData
      recordingRef.current = {
        startData,
        recordingData: [],
        totalTime: 0,
      };

      const clock = new THREE.Clock();
      clock.start();

      let lastTimeValue: number = 0;
      let frameIntervall: number = 1 / 24; //24fps

      interval = setInterval(() => {
        const elapsedTime = clock.getElapsedTime(); // in seconds
        const elapsedTimeInTenths = elapsedTime * 10;
        const currentFrame = Math.floor(elapsedTime / frameIntervall);
        console.log(currentFrame);

        if (currentFrame != lastTimeValue) {
          lastTimeValue = currentFrame;

          recordingRef.current?.recordingData.push({
            time: Math.floor(elapsedTimeInTenths),
            position: selectedObject.position.clone(),
            rotation: selectedObject.rotation.clone(),
            scale: selectedObject.scale.clone(),
          });
          recordingRef.current!.totalTime = elapsedTimeInTenths;
        }
      }, frameIntervall * 1000); // in ms
    }
    return () => {
      console.log("returns");
      if (interval) {
        clearInterval(interval);
        interval = null;
        _addRecordingToSelectedGroup();
      }
    };
  }, [activeWriting, recordingGroups]);
};
