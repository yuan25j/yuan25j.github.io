let cleanup: AbortController | undefined;
let revealObserver: IntersectionObserver | undefined;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function setupReveals() {
  const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
  revealObserver?.disconnect();
  const reveal = (element: Element) => {
    element.classList.add("is-visible");
    if (element.matches("[data-graphic]")) element.classList.add("is-drawn");
    element.querySelectorAll("[data-graphic]").forEach((graphic) => graphic.classList.add("is-drawn"));
  };

  if (reducedMotion() || !("IntersectionObserver" in window)) {
    elements.forEach(reveal);
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        revealObserver?.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -7% 0px" },
  );

  elements.forEach((element) => revealObserver?.observe(element));
}

function setupPointerSurfaces(signal: AbortSignal) {
  if (reducedMotion() || !finePointer()) return;

  document.querySelectorAll<HTMLElement>("[data-pointer-surface]").forEach((surface) => {
    surface.addEventListener(
      "pointermove",
      (event) => {
        const rect = surface.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        surface.style.setProperty("--pointer-x", `${x}px`);
        surface.style.setProperty("--pointer-y", `${y}px`);

        if (surface.hasAttribute("data-tilt")) {
          const rotateY = ((x / rect.width) - 0.5) * 5;
          const rotateX = (0.5 - y / rect.height) * 5;
          surface.style.setProperty("--rotate-x", `${rotateX}deg`);
          surface.style.setProperty("--rotate-y", `${rotateY}deg`);
        }
      },
      { signal },
    );

    surface.addEventListener(
      "pointerleave",
      () => {
        surface.style.setProperty("--rotate-x", "0deg");
        surface.style.setProperty("--rotate-y", "0deg");
      },
      { signal },
    );
  });
}

function setupScrollEffects(signal: AbortSignal) {
  const progress = document.querySelector<HTMLElement>("[data-scroll-progress]");
  const timelines = document.querySelectorAll<HTMLElement>("[data-timeline]");
  let scheduled = false;

  const update = () => {
    scheduled = false;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
    progress?.style.setProperty("--scroll-progress", String(ratio));

    timelines.forEach((timeline) => {
      const rect = timeline.getBoundingClientRect();
      const start = window.innerHeight * 0.65;
      const timelineProgress = Math.max(0, Math.min((start - rect.top) / rect.height, 1));
      timeline.style.setProperty("--timeline-progress", String(timelineProgress));

      timeline.querySelectorAll<HTMLElement>(".timeline-item").forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        item.classList.toggle("is-active", itemRect.top < start && itemRect.bottom > window.innerHeight * 0.2);
      });
    });
  };

  const requestUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true, signal });
  window.addEventListener("resize", requestUpdate, { passive: true, signal });
  update();
}

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.left = "-9999px";
    document.body.appendChild(input);
    input.select();
    const ok = document.execCommand("copy");
    input.remove();
    return ok;
  }
}

async function copyEmail(trigger: HTMLElement) {
  const address = trigger.dataset.email ?? trigger.getAttribute("href")?.replace(/^mailto:/i, "") ?? "";
  const status = trigger.querySelector<HTMLElement>("[data-copy-status]") ?? trigger;
  const idle = status.dataset.idleLabel ?? trigger.dataset.idleLabel ?? status.textContent ?? address;

  const copied = await writeClipboard(address);
  if (!copied) return false;
  status.textContent = "Copied";
  window.setTimeout(() => {
    status.textContent = idle;
  }, 1400);
  return true;
}

function setupEmailActions(signal: AbortSignal) {
  document.querySelectorAll<HTMLElement>("[data-copy-email]").forEach((trigger) => {
    trigger.addEventListener(
      "click",
      async (event) => {
        event.preventDefault();
        const copied = await copyEmail(trigger);
        if (copied) return;
        const href = trigger.getAttribute("href") ?? (trigger.dataset.email ? `mailto:${trigger.dataset.email}` : "");
        if (href) window.location.assign(href);
      },
      { signal },
    );
  });
}

export function initInteractions() {
  cleanup?.abort();
  cleanup = new AbortController();
  setupReveals();
  setupPointerSurfaces(cleanup.signal);
  setupScrollEffects(cleanup.signal);
  setupEmailActions(cleanup.signal);
}
