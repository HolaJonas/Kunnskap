import type { CSSProperties } from "react";
import "./App.css";

interface TimerVisualProps {
  toggleIsRunning: () => void;
  time: number;
  progress: number;
}

function leadingZero(number: number) {
  return number > 9 ? number : `0${number}`;
}

function convertSecondsToHMS(seconds: number) {
  let hours = Math.floor(seconds / 3600);
  seconds = seconds % 3600;
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  return `${leadingZero(hours)}:${leadingZero(minutes)}:${leadingZero(seconds)}`;
}

function TimerVisual(props: TimerVisualProps) {
  const clampedProgress = Math.min(Math.max(props.progress, 0), 100);

  return (
    <div
      className="timer-ring rounded-full w-20 h-20 justify-center flex items-center"
      style={{ "--progress": clampedProgress } as CSSProperties}
    >
      <div
        className="bg-white rounded-full w-16 h-16 flex items-center justify-center cursor-pointer"
        onClick={() => props.toggleIsRunning()}
      >
        <div className="text-center">{convertSecondsToHMS(props.time)}</div>
      </div>
    </div>
  );
}

export { TimerVisual };
