const TIMER_ALARM_NAME = "kunnskap_timer";

const defaultTimerState = {
  durationSeconds: 10,
  remainingSeconds: 10,
  isRunning: false,
  endTimeMs: null,
};

async function getTimerState() {
  const stored = await chrome.storage.local.get("timerState");
  return { ...defaultTimerState, ...(stored.timerState ?? {}) };
}

async function setTimerState(updated) {
  await chrome.storage.local.set({ timerState: updated });
}

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  (async () => {
    const current = await getTimerState();

    if (message?.type === "timer:start") {
      const durationSeconds = Math.max(
        Number(
          message?.payload?.durationSeconds ?? current.remainingSeconds ?? 0,
        ),
        0,
      );
      const endTimeMs = Date.now() + durationSeconds * 1000;

      await chrome.alarms.clear(TIMER_ALARM_NAME);
      await chrome.alarms.create(TIMER_ALARM_NAME, { when: endTimeMs });

      const nextState = {
        ...current,
        durationSeconds,
        remainingSeconds: durationSeconds,
        isRunning: durationSeconds > 0,
        endTimeMs: durationSeconds > 0 ? endTimeMs : null,
      };

      await setTimerState(nextState);
      sendResponse({ ok: true, state: nextState });
      return;
    }

    if (message?.type === "timer:pause") {
      const remainingSeconds = Math.max(
        Number(
          message?.payload?.remainingSeconds ?? current.remainingSeconds ?? 0,
        ),
        0,
      );
      await chrome.alarms.clear(TIMER_ALARM_NAME);

      const nextState = {
        ...current,
        remainingSeconds,
        isRunning: false,
        endTimeMs: null,
      };

      await setTimerState(nextState);
      sendResponse({ ok: true, state: nextState });
      return;
    }

    if (message?.type === "timer:reset") {
      const durationSeconds = Math.max(
        Number(
          message?.payload?.durationSeconds ?? current.durationSeconds ?? 0,
        ),
        0,
      );
      await chrome.alarms.clear(TIMER_ALARM_NAME);

      const nextState = {
        ...current,
        durationSeconds,
        remainingSeconds: durationSeconds,
        isRunning: false,
        endTimeMs: null,
      };

      await setTimerState(nextState);
      sendResponse({ ok: true, state: nextState });
      return;
    }

    if (message?.type === "timer:getState") {
      sendResponse({ ok: true, state: current });
      return;
    }

    sendResponse({ ok: false });
  })();

  return true;
});

chrome.runtime.onInstalled.addListener(async () => {
  const state = await getTimerState();
  await setTimerState(state);
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== TIMER_ALARM_NAME) return;

  const current = await getTimerState();
  const nextState = {
    ...current,
    remainingSeconds: 0,
    isRunning: false,
    endTimeMs: null,
  };

  await setTimerState(nextState);

  await chrome.action.openPopup();
});
