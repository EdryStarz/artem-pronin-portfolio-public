// Progressive enhancement: the portfolio and all case links work without JS.
const filters = document.querySelector(".filters");
if (filters) {
  filters.hidden = false;
  const items = [...document.querySelectorAll(".archive-item")];
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    const value = button.dataset.filter;
    for (const control of filters.querySelectorAll("button"))
      control.setAttribute("aria-pressed", String(control === button));
    for (const item of items)
      item.hidden = !(
        value === "all" ||
        (value === "selected"
          ? item.dataset.selected === "true"
          : item.dataset.group === value)
      );
    document.querySelector("#filter-status").textContent =
      `Показано работ: ${items.filter((item) => !item.hidden).length}`;
  });
}
if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((element) => observer.observe(element));
}
