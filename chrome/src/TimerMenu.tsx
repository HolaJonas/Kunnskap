import { useEffect, useState } from "react";
import { TimerVisual } from "./TimerVisual";
import { TimerSettings } from "./TimerSettings";

function TimerMenu() {
  let [showTimerSettings, setShowTimerSettings] = useState(false);
  let [period, setPeriod] = useState(10);
  let [timeRemaining, setTimeRemaining] = useState(10);
  let [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTimeRemaining(period);
    setIsRunning(false);
  }, [period]);

  useEffect(() => {
    if (!isRunning || timeRemaining === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setTimeRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [isRunning, timeRemaining]);

  useEffect(() => {
    if (timeRemaining === 0) {
      setIsRunning(false);
    }
  }, [timeRemaining]);

  return (
    <section className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-slate-300 p-2 text-center space-y-2">
      <TimerVisual
        toggleIsRunning={() => setIsRunning(!isRunning)}
        time={timeRemaining}
      />
      <button onClick={() => setShowTimerSettings(!showTimerSettings)}>
        Edit Timer
      </button>
      <TimerSettings setPeriod={setPeriod} hide={!showTimerSettings} />
    </section>
  );
}

export { TimerMenu };
