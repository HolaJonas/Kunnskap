const MODAL_ROOT_ID = "kunnskap_modal";

function removeModal() {
  const existing = document.getElementById(MODAL_ROOT_ID);
  if (existing) existing.remove();
}

async function setExited() {
  await chrome.runtime.sendMessage({ type: "modal:exited" });
}

function createModal() {
  if (document.getElementById(MODAL_ROOT_ID)) return;

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
  body.textContent = "Question placeholder";
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

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "modal:create") createModal();
  if (message?.type === "modal:remove") removeModal();
});
