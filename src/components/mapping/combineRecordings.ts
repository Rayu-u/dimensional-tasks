import {
  Recording,
  RecordingGroup,
} from "../visual-editor/components/Recorder/recordingTypes";
import * as THREE from "three";

export interface FinalRecordingData {
  name: string;
  objectRecordings: {
    objectUUID: string;
    finalRecording: FinalRecording;
  }[];
}

export interface FinalRecording {
  startData: {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
  };
  recordingData: Array<{
    time: number;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
  }>;
  totalTime: number;
}

export const getFinalRecordings = (
  recordingGroups: RecordingGroup[],
  selectedRecordingNames: string[]
): FinalRecordingData[] => {
  let finalRecordingDataSet: FinalRecordingData[] = [];
  const selectedRecordingGroups: RecordingGroup[] = getSelectedRecordingGroups(
    recordingGroups,
    selectedRecordingNames
  );
  selectedRecordingGroups.forEach((recordingGroup) => {
    let finalRecordingData: FinalRecordingData = {
      name: recordingGroup.name,
      objectRecordings: [],
    };
    recordingGroup.objectRecordings.forEach((objectRecording) => {
      finalRecordingData.objectRecordings.push({
        objectUUID: objectRecording.objectUUID,
        finalRecording: summarizeRecordingData(objectRecording.recordings),
      });
    });
    finalRecordingDataSet.push(finalRecordingData);
  });

  return finalRecordingDataSet;
};

const getSelectedRecordingGroups = (
  recordingGroups: RecordingGroup[],
  selectedRecordingNames: string[]
): RecordingGroup[] => {
  return recordingGroups.filter((group) => {
    for (const name of selectedRecordingNames) {
      if (group.name === name) return true;
    }
    return false;
  });
};

const summarizeRecordingData = (recordings: Recording[]): FinalRecording => {
  // iniialized final Recording
  const finalRecording: FinalRecording = {
    startData: {
      position: recordings[0].recordingData[0].position,
      rotation: recordings[0].recordingData[0].rotation,
      scale: recordings[0].recordingData[0].scale,
    },
    recordingData: [],
    totalTime: 0,
  };

  const maxRecordingLength = Math.max(
    ...recordings.map((r) => r.recordingData.length)
  );

  const positionalRecordingsByAxis: Record<string, Recording[]> = {
    x: [],
    y: [],
    z: [],
    xy: [],
    xz: [],
    yz: [],
    xyz: [],
    none: [],
  };
  const rotationalRecordingsByAxis: Record<string, Recording[]> = {
    x: [],
    y: [],
    z: [],
    none: [],
  };

  recordings.forEach((recording) => {
    const deltaPosition = recording.startData.position
      .clone()
      .sub(recording.recordingData[10].position);
    const startQuaternion = new THREE.Quaternion().setFromEuler(
      recording.startData.rotation
    );
    const secondQuaternion = new THREE.Quaternion().setFromEuler(
      recording.recordingData[10].rotation
    );
    const deltaQuaternion = startQuaternion
      .clone()
      .invert()
      .multiply(secondQuaternion);
    const deltaRotation: THREE.Vector3 = new THREE.Vector3(
      deltaQuaternion.x,
      deltaQuaternion.y,
      deltaQuaternion.z
    ).multiplyScalar(2); // Quaternionen haben halbe rotation

    const positionAxis = classifyAxisType(deltaPosition);
    const rotationAxis = classifyAxisType(deltaRotation);
    console.log("rotational axis");
    console.log(rotationAxis);
    if (positionalRecordingsByAxis[positionAxis]) {
      positionalRecordingsByAxis[positionAxis].push(recording);
    }
    if (rotationalRecordingsByAxis[rotationAxis]) {
      rotationalRecordingsByAxis[rotationAxis].push(recording);
    }
    console.log(rotationalRecordingsByAxis);
  });

  let lastRotation = finalRecording.startData.rotation.clone();
  console.log(lastRotation);
  let lastPosition = finalRecording.startData.position.clone();
  let isStartSet = {
    position: { x: false, y: false, z: false },
    rotation: { x: false, y: false, z: false },
  };

  const applyAxisMovements = () => {
    Object.entries(positionalRecordingsByAxis).forEach(([axis]) => {
      positionalRecordingsByAxis[axis].forEach((recording) => {
        recording.recordingData.forEach((data, index) => {
          if (!finalRecording.recordingData[index]) {
            finalRecording.recordingData[index] = {
              time: data.time,
              position: lastPosition.clone(),
              rotation: lastRotation.clone(),
              scale: finalRecording.startData.scale.clone(),
            };
          }

          switch (axis) {
            case "x":
              finalRecording.recordingData[index].position.x = data.position.x;
              lastPosition.x = data.position.x;
              if (!isStartSet.position.x) {
                finalRecording.startData.position.x = data.position.x;
                isStartSet.position.x = true;
              }

              break;
            case "y":
              finalRecording.recordingData[index].position.y = data.position.y;
              lastPosition.y = data.position.y;
              if (!isStartSet.position.y) {
                finalRecording.startData.position.y = data.position.y;
                isStartSet.position.y = true;
              }
              break;
            case "z":
              finalRecording.recordingData[index].position.z = data.position.z;
              lastPosition.z = data.position.z;
              if (!isStartSet.position.z) {
                finalRecording.startData.position.z = data.position.z;
                isStartSet.position.z = true;
              }
              break;
            case "xy":
              finalRecording.recordingData[index].position.x = data.position.x;
              finalRecording.recordingData[index].position.y = data.position.y;
              lastPosition.x = data.position.x;
              lastPosition.y = data.position.y;
              if (!isStartSet.position.x || !isStartSet.position.y) {
                finalRecording.startData.position.x = data.position.x;
                finalRecording.startData.position.y = data.position.y;
                isStartSet.position.x = true;
                isStartSet.position.y = true;
              }
              break;
            case "xz":
              finalRecording.recordingData[index].position.x = data.position.x;
              finalRecording.recordingData[index].position.z = data.position.z;
              lastPosition.x = data.position.x;
              lastPosition.z = data.position.z;
              if (!isStartSet.position.x || !isStartSet.position.z) {
                finalRecording.startData.position.x = data.position.x;
                finalRecording.startData.position.y = data.position.z;
                isStartSet.position.x = true;
                isStartSet.position.z = true;
              }

              break;
            case "yz":
              finalRecording.recordingData[index].position.y = data.position.y;
              finalRecording.recordingData[index].position.z = data.position.z;
              lastPosition.y = data.position.y;
              lastPosition.z = data.position.z;
              if (!isStartSet.position.y || !isStartSet.position.z) {
                finalRecording.startData.position.y = data.position.y;
                finalRecording.startData.position.z = data.position.z;
                isStartSet.position.y = true;
                isStartSet.position.z = true;
              }
              break;
            case "xyz":
              finalRecording.recordingData[index].position.copy(data.position);
              lastPosition.copy(data.position);
              if (
                !isStartSet.position.x ||
                !isStartSet.position.y ||
                !isStartSet.position.z
              ) {
                finalRecording.startData.position.x = data.position.x;
                finalRecording.startData.position.y = data.position.y;
                finalRecording.startData.position.z = data.position.z;
                isStartSet.position.x = true;
                isStartSet.position.y = true;
                isStartSet.position.z = true;
              }

              break;
            default:
              break;
          }
        });

        for (
          let i = recordings[0].recordingData.length;
          i < maxRecordingLength;
          i++
        ) {
          if (!finalRecording.recordingData[i]) {
            finalRecording.recordingData[i] = {
              time: i * (finalRecording.totalTime / maxRecordingLength),
              position: lastPosition.clone(),
              rotation: new THREE.Euler(),
              scale: new THREE.Vector3(1, 1, 1),
            };
          } else {
            finalRecording.recordingData[i].position.copy(lastPosition);
          }
        }
      });
    });
  };
  applyAxisMovements();
  console.log("final");

  const applyAxisRotations = () => {
    Object.entries(rotationalRecordingsByAxis).forEach(([axis]) => {
      rotationalRecordingsByAxis[axis].forEach((recording) => {
        recording.recordingData.forEach((data, index) => {
          if (!finalRecording.recordingData[index]) {
            finalRecording.recordingData[index] = {
              time: data.time,
              position: lastPosition.clone(),
              rotation: lastRotation.clone(),
              scale: finalRecording.startData.scale.clone(),
            };
          }
          switch (axis) {
            case "x":
              finalRecording.recordingData[index].rotation.x = data.rotation.x;
              lastRotation.x = data.rotation.x;
              if (!isStartSet.rotation.x) {
                finalRecording.startData.rotation.x = data.rotation.x;
                isStartSet.rotation.x = true;
              }
              break;
            case "y":
              finalRecording.recordingData[index].rotation.y = data.rotation.y;
              lastRotation.y = data.rotation.y;
              if (!isStartSet.rotation.y) {
                finalRecording.startData.rotation.y = data.rotation.y;
                isStartSet.rotation.y = true;
              }
              break;
            case "z":
              finalRecording.recordingData[index].rotation.z = data.rotation.z;
              lastRotation.z = data.rotation.z;
              if (!isStartSet.rotation.z) {
                finalRecording.startData.rotation.z = data.rotation.z;
                isStartSet.rotation.z = true;
              }
              break;
            default:
              break;
          }
        });

        for (
          let i = recordings[0].recordingData.length;
          i < maxRecordingLength;
          i++
        ) {
          if (finalRecording.recordingData[i]) {
            finalRecording.recordingData[i].rotation.copy(lastRotation);
          }
        }
      });
    });
  };

  applyAxisRotations();
  console.log(finalRecording);
  finalRecording.totalTime = maxRecordingLength;
  return finalRecording;
};

const classifyAxisType = (deltaValue: THREE.Vector3): string => {
  const hasX = Math.abs(deltaValue.x) > 0.0001;
  const hasY = Math.abs(deltaValue.y) > 0.0001;
  const hasZ = Math.abs(deltaValue.z) > 0.0001;

  if (hasX && hasY && hasZ) return "xyz";
  if (hasX && hasY) return "xy";
  if (hasX && hasZ) return "xz";
  if (hasY && hasZ) return "yz";
  if (hasX) return "x";
  if (hasY) return "y";
  if (hasZ) return "z";
  return "no axis could be found";
};
