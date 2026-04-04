import { useEffect, useState } from "react";
import { TimerVisual } from "./TimerVisual";
import { TimerSettings } from "./TimerSettings";
import { TimerState } from "./types/timerState";
import { Message } from "./types/message";

const DEFAULT_PERIOD = 10;

function getRemainingSecsFromEnd(endTimeMs: number) {
  return Math.max(Math.ceil((endTimeMs - Date.now()) / 1000), 0);
}

async function sendTimerMessage(message: Message) {
  return new Promise<{ ok: boolean; state?: TimerState }>((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        resolve({ ok: false });
        return;
      }
      resolve(response ?? { ok: false });
    });
  });
}

function TimerMenu() {
  let [showTimerSettings, setShowTimerSettings] = useState(false);
  let [period, setPeriod] = useState(DEFAULT_PERIOD);
  let [timeRemaining, setTimeRemaining] = useState(DEFAULT_PERIOD);
  let [isRunning, setIsRunning] = useState(false);
  let [endTimeMs, setEndTimeMs] = useState<number | null>(null);
  let [isModalShowing, setIsModalShowing] = useState(false);
  const progress = period > 0 ? (timeRemaining / period) * 100 : 0;

  useEffect(() => {
    async function configureTimer() {
      const response = await sendTimerMessage({ type: "timer:getState" });
      if (!response.ok || !response.state) return;

      const state = response.state;
      const nextPeriod = Math.max(
        Number(state.durationSeconds ?? DEFAULT_PERIOD),
        0,
      );
      setPeriod(nextPeriod);
      setIsModalShowing(Boolean(state.expired));

      if (state.isRunning && state.endTimeMs) {
        setIsRunning(true);
        setEndTimeMs(state.endTimeMs);
        setTimeRemaining(getRemainingSecsFromEnd(state.endTimeMs));
        return;
      }

      setIsRunning(false);
      setEndTimeMs(null);
      setTimeRemaining(
        Math.max(Number(state.remainingSeconds ?? nextPeriod), 0),
      );
    }

    function handleStorageUpdate(
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string,
    ) {
      if (areaName !== "local" || !changes.timerState?.newValue) return;

      const state = changes.timerState.newValue as TimerState;
      const nextPeriod = Math.max(
        Number(state.durationSeconds ?? DEFAULT_PERIOD),
        0,
      );
      setPeriod(nextPeriod);
      setIsModalShowing(Boolean(state.expired));

      if (state.isRunning && state.endTimeMs) {
        setIsRunning(true);
        setEndTimeMs(state.endTimeMs);
        setTimeRemaining(getRemainingSecsFromEnd(state.endTimeMs));
        return;
      }

      setIsRunning(false);
      setEndTimeMs(null);
      setTimeRemaining(
        Math.max(Number(state.remainingSeconds ?? nextPeriod), 0),
      );
    }

    configureTimer();
    chrome.storage.onChanged.addListener(handleStorageUpdate);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageUpdate);
    };
  }, []);

  useEffect(() => {
    if (!isRunning || !endTimeMs) return;

    const timer = window.setInterval(() => {
      setTimeRemaining(getRemainingSecsFromEnd(endTimeMs));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, endTimeMs]);

  useEffect(() => {
    if (timeRemaining === 0) {
      setIsRunning(false);
      setEndTimeMs(null);
    }
  }, [timeRemaining]);

  async function toggleRunning() {
    if (isRunning) {
      const remainingSeconds = endTimeMs
        ? getRemainingSecsFromEnd(endTimeMs)
        : Math.max(timeRemaining, 0);
      await sendTimerMessage({
        type: "timer:pause",
        payload: { remainingSeconds },
      });
      setIsRunning(false);
      setEndTimeMs(null);
      setTimeRemaining(remainingSeconds);
      return;
    }

    if (isModalShowing || timeRemaining <= 0) return;

    const response = await sendTimerMessage({
      type: "timer:start",
      payload: { durationSeconds: timeRemaining },
    });

    if (!response.ok || !response.state) return;

    const nextEndTimeMs = response.state.endTimeMs;
    setIsRunning(true);
    setEndTimeMs(nextEndTimeMs);
    if (nextEndTimeMs) setTimeRemaining(getRemainingSecsFromEnd(nextEndTimeMs));
  }

  async function applyPeriod(nextPeriod: number) {
    const normalizedPeriod = Math.max(nextPeriod, 0);
    setPeriod(normalizedPeriod);
    setTimeRemaining(normalizedPeriod);
    setIsRunning(false);
    setEndTimeMs(null);
    await sendTimerMessage({
      type: "timer:reset",
      payload: { durationSeconds: normalizedPeriod },
    });
  }

  return (
    <section className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-slate-300 p-2 text-center space-y-2">
      <TimerVisual
        toggleIsRunning={toggleRunning}
        time={timeRemaining}
        progress={progress}
        disabled={isModalShowing}
      />
      <button onClick={() => setShowTimerSettings(!showTimerSettings)}>
        Edit Timer
      </button>
      <TimerSettings setPeriod={applyPeriod} hide={!showTimerSettings} />
    </section>
  );
}

export { TimerMenu };
