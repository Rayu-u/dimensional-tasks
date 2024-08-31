import * as THREE from "three";

export interface Recording {
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

export interface RecordingGroup {
  name: string;
  objectRecordings: { objectUUID: string; recordings: Recording[] }[];
}
