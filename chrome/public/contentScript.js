const MODAL_ROOT_ID = "kunnskapModal";
const PAUSE_STATE_KEY = "kunnskapPauseState";

let pauseState = null;

function renderQuestion(el, text) {
  const katexApi = window.katex;
  katexApi.render(text, el, { throwOnError: false, strict: "warn" });
}

function removeModal() {
  const existing = document.getElementById(MODAL_ROOT_ID);
  if (existing) existing.remove();
  resumeBackground();
}

async function setExited() {
  await chrome.runtime.sendMessage({ type: "modal:exited" });
}

function normalizeAnswerValue(value) {
  return String(value ?? "")
    .trim()
    .replace(/^\$+|\$+$/g, "")
    .replace(/\\text\{([^}]*)\}/g, "$1")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function isCorrectAnswer(userAnswer, expectedAnswer) {
  return (
    normalizeAnswerValue(userAnswer) === normalizeAnswerValue(expectedAnswer)
  );
}

function createModal(question) {
  if (document.getElementById(MODAL_ROOT_ID)) return;

  pauseBackground();

  const overlay = document.createElement("div");
  overlay.id = MODAL_ROOT_ID;
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.zIndex = "100000";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.padding = "16px";
  overlay.style.boxSizing = "border-box";
  overlay.style.background = "rgb(0 0 0 / 0.2)";
  overlay.style.backdropFilter = "blur(3px)";
  overlay.style.fontFamily =
    '"Segoe UI", "Trebuchet MS", system-ui, sans-serif';
  overlay.style.fontSize = "16px";
  overlay.style.color = "#007f4e";

  const card = document.createElement("div");
  card.style.width = "450px";
  card.style.minWidth = "450px";
  card.style.maxWidth = "450px";
  card.style.maxHeight = "min(360px, calc(100vh - 32px))";
  card.style.borderRadius = "14px";
  card.style.border = "1px solid rgb(0 127 78 / 0.24)";
  card.style.background = "rgb(248 246 227 / 0.94)";
  card.style.boxShadow = "0 22px 44px rgb(0 0 0 / 0.2)";
  card.style.overflow = "hidden";
  card.style.padding = "15px";
  card.style.display = "flex";
  card.style.flexDirection = "column";
  card.style.gap = "14px";

  const titleRow = document.createElement("div");
  titleRow.style.margin = "0";
  titleRow.style.padding = "2px 3px";

  const heading = document.createElement("h2");
  heading.textContent = "Kunnskap";
  heading.style.margin = "0";
  heading.style.fontSize = "18px";
  heading.style.lineHeight = "1.25";
  heading.style.color = "#007f4e";
  heading.style.fontWeight = "700";
  heading.style.letterSpacing = "0.03em";

  const body = document.createElement("p");
  body.style.margin = "0";
  body.style.padding = "16px 17px";
  body.style.fontSize = "16px";
  body.style.lineHeight = "1.45";
  body.style.color = "#007f4e";
  body.style.background = "#ffffff";
  body.style.border = "1px solid rgb(0 127 78 / 0.18)";
  body.style.borderRadius = "10px";
  body.style.wordBreak = "break-word";
  body.style.flex = "1";
  body.style.overflow = "auto";
  renderQuestion(body, question?.question ?? "\\text{No question available.}");

  const answer = document.createElement("input");
  answer.placeholder = "Answer";
  answer.style.margin = "0";
  answer.style.padding = "16px 17px";
  answer.style.fontSize = "16px";
  answer.style.lineHeight = "1.45";
  answer.style.color = "#007f4e";
  answer.style.background = "#ffffff";
  answer.style.border = "1px solid rgb(0 127 78 / 0.18)";
  answer.style.borderRadius = "10px";
  answer.style.outline = "none";
  answer.style.boxShadow = "none";
  answer.style.wordBreak = "break-word";
  answer.style.flex = "1";
  answer.style.overflow = "auto";
  answer.addEventListener("focus", () => {
    answer.style.boxShadow = "0 0 0 2px rgb(0 127 78 / 0.2)";
  });
  answer.addEventListener("blur", () => {
    answer.style.boxShadow = "none";
  });
  let tries = 0;
  let cooldown = false;
  let answerShown = false;

  const reveal = document.createElement("div");
  reveal.style.margin = "0";
  reveal.style.padding = "8px 0 0 0";
  reveal.style.fontSize = "15px";
  reveal.style.color = "#b30000";
  reveal.style.fontWeight = "600";
  reveal.style.display = "none";
  card.appendChild(reveal);

  answer.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !cooldown) {
      e.preventDefault();
      if (isCorrectAnswer(answer.value, question?.answer)) setExited();
      else {
        tries++;
        cooldown = true;
        answer.disabled = true;
        setTimeout(() => {
          cooldown = false;
          answer.disabled = false;
          answer.focus();
        }, 1000);
        if (tries >= 3) {
          reveal.textContent = `Correct answer: ${question?.answer ?? ""}`;
          reveal.style.display = "block";
        }
      }
    }
  });

  const actionRow = document.createElement("div");
  actionRow.style.display = "flex";
  actionRow.style.justifyContent = "flex-end";
  actionRow.style.margin = "0";
  actionRow.style.padding = "2px 0";

  titleRow.appendChild(heading);
  card.appendChild(titleRow);
  card.appendChild(body);
  card.appendChild(answer);
  card.appendChild(actionRow);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
  answer.focus();
}

function pauseBackground() {
  const html = document.documentElement;
  const body = document.body;

  const pausedMedia = [];
  const pauseMedia = () => {
    document.querySelectorAll("video, audio").forEach((e) => {
      try {
        if (!e.paused && !e.ended) {
          pausedMedia.push(e);
          e.pause();
        }
      } catch (error) {}
    });
  };

  const playListener = (event) => {
    const target = event?.target;
    try {
      target.pause();
    } catch (error) {}
  };

  pauseMedia();
  document.addEventListener("play", playListener, true);
  const mediaPauseIntervalId = window.setInterval(pauseMedia, 0);

  pauseState = {
    htmlAnimationPlayState: html.style.animationPlayState,
    htmlTransitionPlayState: html.style.transitionPlayState,
    bodyAnimationPlayState: body.style.animationPlayState,
    bodyTransitionPlayState: body.style.transitionPlayState,
    bodyOverflow: body.style.overflow,
    pausedMedia,
    mediaPauseIntervalId,
    playListener,
  };

  html.style.animationPlayState = "paused";
  html.style.transitionPlayState = "paused";
  body.style.animationPlayState = "paused";
  body.style.transitionPlayState = "paused";
  body.style.overflow = "hidden";
}

function resumeBackground() {
  if (!pauseState) return;

  const html = document.documentElement;
  const body = document.body;

  html.style.animationPlayState = pauseState.htmlAnimationPlayState;
  html.style.transitionPlayState = pauseState.htmlTransitionPlayState;
  body.style.animationPlayState = pauseState.bodyAnimationPlayState;
  body.style.transitionPlayState = pauseState.bodyTransitionPlayState;
  body.style.overflow = pauseState.bodyOverflow;

  window.clearInterval(pauseState.mediaPauseIntervalId);
  document.removeEventListener("play", pauseState.playListener, true);

  pauseState.pausedMedia.forEach((e) => {
    try {
      e.play();
    } catch (error) {}
  });

  pauseState = null;
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "modal:create") createModal(message?.payload);
  if (message?.type === "modal:remove") removeModal();
});
