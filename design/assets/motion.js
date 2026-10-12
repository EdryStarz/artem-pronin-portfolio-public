// A silent, local Veo material study. The poster remains available without JS.
(() => {
  const host = document.querySelector(".ambient");
  const toggle = document.querySelector(".motion-toggle");
  if (!host || !toggle) return;
  const assets = new URL(".", document.currentScript.src);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const video = document.createElement("video");
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "none";
  video.tabIndex = -1;
  video.setAttribute("aria-hidden", "true");
  video.setAttribute("disablepictureinpicture", "");
  host.append(video);
  let preference = !navigator.connection?.saveData;
  let failed = false;
  let blocked = false;
  let revision = 0;
  let inView = true;
  try {
    const saved = localStorage.getItem("portfolio-motion");
    if (saved) preference = saved !== "off";
  } catch {}
  const active = () => preference && !reduce.matches && !failed && !blocked;
  function updateControl() {
    document.documentElement.dataset.motion = active() ? "on" : "off";
    toggle.hidden = false;
    toggle.disabled = reduce.matches || failed;
    toggle.setAttribute("aria-pressed", String(active()));
    toggle.querySelector("span").textContent = active()
      ? "Фон движется"
      : "Фон на паузе";
    toggle.title = failed
      ? "Показан статичный фон: видео недоступно"
      : reduce.matches
        ? "Уменьшение движения включено в настройках устройства"
        : "Включить или остановить анимацию";
  }
  function sync() {
    const request = ++revision;
    updateControl();
    if (!active() || document.hidden || !inView) {
      video.pause();
      return;
    }
    if (!video.hasAttribute("src")) {
      const file = matchMedia("(max-width: 767px)").matches
        ? "olive-pearl-mobile.mp4"
        : "olive-pearl.mp4";
      video.src = new URL(`video/${file}`, assets).href;
    }
    video.play().catch(() => {
      if (request !== revision) return;
      blocked = true;
      updateControl();
    });
  }
  video.addEventListener("playing", () => {
    if (!active() || document.hidden || !inView) {
      video.pause();
      return;
    }
    host.classList.add("has-video");
  });
  video.addEventListener("error", () => {
    failed = true;
    host.classList.remove("has-video");
    sync();
  });
  toggle.addEventListener("click", () => {
    preference = blocked || !preference;
    blocked = false;
    try {
      localStorage.setItem("portfolio-motion", preference ? "on" : "off");
    } catch {}
    sync();
  });
  reduce.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  addEventListener("pagehide", () => {
    ++revision;
    video.pause();
  });
  addEventListener("pageshow", sync);
  const hero = document.querySelector(".hero");
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { rootMargin: "100px" },
    ).observe(hero);
  }
  host.classList.add("is-ready");
  sync();
})();
