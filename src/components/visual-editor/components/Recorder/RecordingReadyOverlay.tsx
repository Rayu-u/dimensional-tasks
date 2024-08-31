import React, { useEffect } from "react";
import { useVisualEditorContext } from "../../visualEditorContext";
// property of ALbert Gonzalez: https://github.com/albert-gonzalez/easytimer-react-hook
import useTimer from "easytimer-react-hook";

interface RecordingReadyOverlayProps {}

const RecordingReadyOverlay: React.FC<RecordingReadyOverlayProps> = () => {
  const { activeRecording, setActiveWriting, activeWriting } =
    useVisualEditorContext();
  const [timer, isTargetAchieved] = useTimer({
    countdown: true,
    startValues: { seconds: 5 },
    target: { seconds: 0 },
    updateWhenTargetAchieved: true,
  });

  useEffect(() => {
    if (!activeRecording) return;

    timer.start({
      countdown: true,
      startValues: { seconds: 2 },
    });

    // wont need this later
    setActiveWriting(false);

    // start the countdown
  }, [activeRecording]);

  useEffect(() => {
    if (isTargetAchieved) {
      setActiveWriting(true);
    }
  }, [isTargetAchieved]);

  const styles: { overlayColor: React.CSSProperties } = {
    overlayColor: {
      backgroundColor:
        activeRecording && !activeWriting ? "#EF5350" : "transparent",
      width: "100%",
      height: "100%",
      position: "absolute",
      opacity: "0.8",
      pointerEvents: "none",
    },
  };

  return (
    <div style={styles.overlayColor}>
      {!isTargetAchieved && timer.getTimeValues().seconds.toString()}
    </div>
  );
};

export default RecordingReadyOverlay;
