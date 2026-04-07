const TIMER_ALARM_NAME = "kunnskapTimer";
const KNOWLEDGE_STORAGE_KEY = "knowledgeBase";
const ACTIVE_QUESTION_STORAGE_KEY = "activeQuestion";

const defaultTimerState = {
  durationSeconds: 10,
  remainingSeconds: 10,
  isRunning: false,
  endTimeMs: null,
  expired: false,
};

let shuffled_questions = [];
let knowledgePool = [];
let activeQuestion = null;

function shuffleArray(arr) {
  return arr
    .map((val) => ({ val, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ val }) => val);
}

function normToArray(questions) {
  return Array.isArray(questions) ? questions : [];
}

async function getTimerState() {
  const stored = await chrome.storage.local.get("timerState");
  return { ...defaultTimerState, ...(stored.timerState ?? {}) };
}

async function setTimerState(updated) {
  await chrome.storage.local.set({ timerState: updated });
}

async function readKnowledgePoolFromStorage() {
  const stored = await chrome.storage.local.get(KNOWLEDGE_STORAGE_KEY);
  return normToArray(stored[KNOWLEDGE_STORAGE_KEY]);
}

async function ensureLoadKnowledgePool() {
  if (knowledgePool.length > 0) return;
  knowledgePool = await readKnowledgePoolFromStorage();
  if (shuffled_questions.length === 0 && knowledgePool.length > 0) {
    shuffled_questions = shuffleArray(
      Array.from({ length: knowledgePool.length }, (_, i) => i),
    );
  }
}

async function getActiveQuestion() {
  if (activeQuestion) return activeQuestion;
  const stored = await chrome.storage.local.get(ACTIVE_QUESTION_STORAGE_KEY);
  return stored[ACTIVE_QUESTION_STORAGE_KEY];
}

async function setActiveQuestion(question) {
  activeQuestion = question;
  await chrome.storage.local.set({ [ACTIVE_QUESTION_STORAGE_KEY]: question });
}

async function clearActiveQuestion() {
  activeQuestion = null;
  await chrome.storage.local.remove(ACTIVE_QUESTION_STORAGE_KEY);
}

async function showModalInTab(tabId, question) {
  try {
    await chrome.tabs.sendMessage(tabId, {
      type: "modal:create",
      payload: question,
    });
    return;
  } catch (error) {
    const message = String(error?.message ?? "");
    const hasNoReceiver = message.includes("Receiving end does not exist");
    if (!hasNoReceiver) {
      console.error("sendMessage failed", tabId, error);
      return;
    }
  }

  try {
    await chrome.scripting.insertCSS({
      target: { tabId },
      files: ["katex/katex.min.css"],
    });
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["katex/katex.min.js", "contentScript.js"],
    });
    await chrome.tabs.sendMessage(tabId, {
      type: "modal:create",
      payload: question,
    });
  } catch (error) {
    const message = String(error?.message ?? "");
    if (
      !(
        message.includes("Cannot access") ||
        message.includes("The extensions gallery cannot be scripted")
      )
    ) {
      console.error("modal addition failed", tabId, error);
    }
  }
}

async function removeModalInTab(tabId) {
  try {
    await chrome.tabs.sendMessage(tabId, { type: "modal:remove" });
  } catch (error) {
    const message = String(error?.message ?? "");
    const hasNoReceiver = message.includes("Receiving end does not exist");
    if (!hasNoReceiver) console.error("modal removal failed", tabId, error);
  }
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
        expired: false,
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
        expired: false,
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
        expired: current.expired,
      };

      await setTimerState(nextState);
      sendResponse({ ok: true, state: nextState });
      return;
    }

    if (message?.type === "timer:getState") {
      sendResponse({ ok: true, state: current });
      return;
    }

    if (message?.type === "modal:exited") {
      const durationSeconds = Math.max(Number(current.durationSeconds), 0);
      const endTimeMs = Date.now() + durationSeconds * 1000;

      await chrome.alarms.clear(TIMER_ALARM_NAME);
      if (durationSeconds > 0) {
        await chrome.alarms.create(TIMER_ALARM_NAME, { when: endTimeMs });
      }

      const nextState = {
        ...current,
        remainingSeconds: durationSeconds,
        isRunning: durationSeconds > 0,
        endTimeMs,
        expired: false,
      };

      await setTimerState(nextState);
      await clearActiveQuestion();

      const tabs = await chrome.tabs.query({});
      await Promise.all(tabs.map((tab) => removeModalInTab(tab.id)));

      sendResponse({ ok: true, state: nextState });
      return;
    }

    if (message?.type === "storage:update") {
      knowledgePool = normToArray(message?.payload?.knowledgeBase);
      shuffled_questions = shuffleArray(
        Array.from({ length: knowledgePool.length }, (_, i) => i),
      );
      sendResponse({ ok: true, knowledgeCount: knowledgePool.length });
      return;
    }

    sendResponse({ ok: false });
  })();

  return true;
});

chrome.runtime.onInstalled.addListener(async () => {
  const state = await getTimerState();
  await setTimerState(state);
  await ensureLoadKnowledgePool();
});

chrome.runtime.onStartup.addListener(async () => {
  await ensureLoadKnowledgePool();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== TIMER_ALARM_NAME) return;

  const current = await getTimerState();
  const durationSeconds = Math.max(
    Number(current.durationSeconds ?? defaultTimerState.durationSeconds),
    0,
  );
  const nextState = {
    ...current,
    remainingSeconds: durationSeconds,
    isRunning: false,
    endTimeMs: null,
    expired: true,
  };

  await setTimerState(nextState);
  await ensureLoadKnowledgePool();

  if (knowledgePool.length === 0) return;
  if (shuffled_questions.length === 0)
    shuffled_questions = shuffleArray(
      Array.from({ length: knowledgePool.length }, (_, i) => i),
    );
  const latestIndex = shuffled_questions.pop();
  const latest = knowledgePool[latestIndex];
  if (!latest) return;
  await setActiveQuestion(latest);
  const tabs = await chrome.tabs.query({});
  await Promise.all(tabs.map((tab) => showModalInTab(tab.id, latest)));
});

async function showModalBasedOnState(tabId) {
  const state = await getTimerState();
  if (!state.expired) return;
  const question = await getActiveQuestion();
  if (!question) return;
  await showModalInTab(tabId, question);
}

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  await showModalBasedOnState(tabId);
});

chrome.tabs.onCreated.addListener(async (tab) => {
  await showModalBasedOnState(tab.id);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === "complete") await showModalBasedOnState(tabId);
});
