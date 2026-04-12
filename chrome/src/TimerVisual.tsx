import { useEffect, type CSSProperties } from "react";
import "./App.css";

interface TimerVisualProps {
  toggleIsRunning: () => void;
  time: number;
  progress: number;
  disabled: boolean;
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
      className="timer-ring rounded-full w-20 h-20 justify-center flex items-center shadow-sm"
      style={{ "--progress": clampedProgress } as CSSProperties}
    >
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full border border-tropic-green/15 bg-white ${props.disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
        onClick={() => {
          if (props.disabled) return;
          props.toggleIsRunning();
        }}
      >
        <div className="text-center text-xs font-semibold text-tropic-green">
          {convertSecondsToHMS(props.time)}
        </div>
      </div>
    </div>
  );
}

export { TimerVisual };
