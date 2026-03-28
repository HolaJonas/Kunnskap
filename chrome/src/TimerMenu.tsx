import { useState } from "react";
import { TimerVisual } from "./TimerVisual";
import { TimerSettings } from "./TimerSettings";

function TimerMenu() {
  let [showTimerSettings, setShowTimerSettings] = useState(false);
  let [period, setPeriod] = useState(10);
  let [isRunning, setIsRunning] = useState(false);

  return (
    <section className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-slate-300 p-2 text-center space-y-2">
      <TimerVisual toggleIsRunning={() => setIsRunning(!isRunning)} />
      <button onClick={() => setShowTimerSettings(!showTimerSettings)}>
        Edit Timer
      </button>
      <TimerSettings setPeriod={setPeriod} hide={!showTimerSettings} />
    </section>
  );
}

export { TimerMenu };
