const body = document.body;
const welcomeMessage = document.querySelector("#welcome-message");
const projectProgress = document.querySelector("#case-progress");
const projects = document.querySelectorAll("[data-project]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const welcomeMessages = [
  "Welcome in. Take a thoughtful look around.",
  "You found the workbench. Start wherever curiosity leads.",
  "A small studio, a lot of questions, and a few useful answers."
];
let welcomeIndex = 0;

function updateWelcomeMessage() {
  if (!welcomeMessage) return;
  welcomeIndex = (welcomeIndex + 1) % welcomeMessages.length;
  welcomeMessage.textContent = welcomeMessages[welcomeIndex];
}

document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", updateWelcomeMessage);
});

projects.forEach((project) => {
  const number = project.dataset.project;
  const updateProgress = () => {
    if (projectProgress) projectProgress.textContent = `${number} / 03`;
  };
  project.addEventListener("mouseenter", updateProgress);
  project.addEventListener("focusin", updateProgress);
  project.addEventListener("mouseenter", () => updateWorkStage(project.dataset.stage || "Work"));
  project.addEventListener("focusin", () => updateWorkStage(project.dataset.stage || "Work"));

  const noteToggle = project.querySelector(".note-toggle");
  noteToggle?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const isOpen = project.classList.toggle("note-open");
    noteToggle.setAttribute("aria-expanded", String(isOpen));
  });
});

const workLabel = document.querySelector(".icon-work")?.nextElementSibling;
const stageNames = ["Problem", "Research", "Design", "Testing", "Outcome"];
const updateWorkStage = (stage) => {
  if (workLabel) workLabel.textContent = stage;
};

if ("IntersectionObserver" in window) {
  const stageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const projectNumber = Number(entry.target.dataset.project) - 1;
        updateWorkStage(stageNames[projectNumber] || "Work");
      }
    });
  }, { threshold: 0.65 });
  projects.forEach((project) => stageObserver.observe(project));
}

const projectSection = document.querySelector("#projects");
const viewButtons = document.querySelectorAll("[data-view]");
viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const quickView = button.dataset.view === "quick";
    projectSection?.classList.toggle("quick-mode", quickView);
    const quickViewPanel = document.querySelector("#quick-view");
    if (quickViewPanel) quickViewPanel.hidden = !quickView;
    viewButtons.forEach((viewButton) => viewButton.classList.toggle("active", viewButton === button));
  });
});

document.querySelectorAll("[data-cursor]").forEach((visual) => {
  visual.addEventListener("pointermove", (event) => {
    if (reducedMotion) return;
    const bounds = visual.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 6;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 6;
    visual.style.setProperty("--cursor-x", `${x.toFixed(1)}px`);
    visual.style.setProperty("--cursor-y", `${y.toFixed(1)}px`);
  });

  visual.addEventListener("pointerleave", () => {
    visual.style.setProperty("--cursor-x", "0px");
    visual.style.setProperty("--cursor-y", "0px");
  });
});

document.querySelectorAll(".button, .round-link, .text-link, .contact-email").forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    if (reducedMotion) return;
    const bounds = button.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 4;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 4;
    button.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  });

  button.addEventListener("pointerleave", () => {
    button.style.transform = "";
  });
});

const designModeToggle = document.querySelector("#design-mode-toggle");
designModeToggle?.addEventListener("click", () => {
  const isActive = body.classList.toggle("design-mode");
  designModeToggle.setAttribute("aria-pressed", String(isActive));
});

const logo = document.querySelector(".logo");
let logoClicks = 0;
logo?.addEventListener("click", (event) => {
  logoClicks += 1;
  if (logoClicks === 5) {
    event.preventDefault();
    body.classList.toggle("easter-egg");
    logoClicks = 0;
  }
});
