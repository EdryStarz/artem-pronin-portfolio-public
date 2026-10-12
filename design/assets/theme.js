// Apply the saved theme before the first paint; system preference is the default.
(() => {
  const root = document.documentElement;
  const system = matchMedia("(prefers-color-scheme: dark)");
  let saved;
  try {
    saved = localStorage.getItem("portfolio-theme");
  } catch {}
  function apply(theme) {
    root.dataset.theme = theme;
    document
      .querySelector(".theme-toggle")
      ?.setAttribute("aria-pressed", String(theme === "dark"));
  }
  apply(
    saved === "light" || saved === "dark"
      ? saved
      : system.matches
        ? "dark"
        : "light",
  );
  system.addEventListener("change", () => {
    if (!saved) apply(system.matches ? "dark" : "light");
  });
  document.addEventListener("DOMContentLoaded", () => {
    const theme = document.querySelector(".theme-toggle");
    if (theme) {
      theme.hidden = false;
      apply(root.dataset.theme);
      theme.addEventListener("click", () => {
        saved = root.dataset.theme === "dark" ? "light" : "dark";
        apply(saved);
        try {
          localStorage.setItem("portfolio-theme", saved);
        } catch {}
      });
    }
    const header = document.querySelector(".site-header");
    const menu = document.querySelector(".menu-toggle");
    const nav = document.querySelector("#site-nav");
    if (!header || !menu || !nav) return;
    header.classList.add("menu-ready");
    menu.hidden = false;
    const close = () => {
      header.classList.remove("is-open");
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Открыть меню");
    };
    menu.addEventListener("click", () => {
      const open = header.classList.toggle("is-open");
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && header.classList.contains("is-open")) {
        close();
        menu.focus();
      }
    });
    document.addEventListener("click", (event) => {
      if (!header.contains(event.target)) close();
    });
    matchMedia("(min-width: 768px)").addEventListener("change", close);
  });
})();
