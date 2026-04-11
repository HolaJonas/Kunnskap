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
  overlay.style.background = "rgba(0, 0, 0, 0.5)";

  const background = document.createElement("div");
  background.style.width = "min(420px, calc(100vw - 2rem))";
  background.style.padding = "1rem 1.25rem";
  background.style.background = "#ffffff";
  background.style.color = "#000000";
  background.style.fontFamily = "ui-sans-serif, system-ui, sans-serif";

  const heading = document.createElement("h2");
  heading.textContent = "Timer alarm";
  heading.style.margin = "0 0 0.5rem 0";
  heading.style.fontSize = "1.25rem";

  const body = document.createElement("p");
  renderQuestion(body, question.question);
  body.style.margin = "0 0 0.9rem 0";

  const exitButton = document.createElement("button");
  exitButton.type = "button";
  exitButton.textContent = "Exit";
  exitButton.style.border = "none";
  exitButton.style.borderRadius = "0.45rem";
  exitButton.style.padding = "0.5rem 0.8rem";
  exitButton.style.background = "red";
  exitButton.style.color = "#000000";
  exitButton.style.cursor = "pointer";
  exitButton.addEventListener("click", setExited);

  background.appendChild(heading);
  background.appendChild(body);
  background.appendChild(exitButton);
  overlay.appendChild(background);
  document.body.appendChild(overlay);
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
