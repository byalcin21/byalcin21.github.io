const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav-links");
const desktopNav = window.matchMedia("(min-width: 1040px)");

const setMenu = (open) => {
  if (!nav || !toggle) return;
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("nav-open", open);
};

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (event.target.closest(".site-header")) return;
    setMenu(false);
  });

  desktopNav.addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });
}

const onScroll = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const links = [...document.querySelectorAll(".nav-link")];
const sections = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (sections.length && "IntersectionObserver" in window) {
  const setCurrent = (id) => {
    links.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  const spy = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setCurrent(visible.target.id);
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: [0.05, 0.2, 0.45] }
  );

  sections.forEach((section) => spy.observe(section));
}

const revealables = document.querySelectorAll(".reveal");

if (revealables.length && "IntersectionObserver" in window) {
  revealables.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.94 && rect.bottom > 0;
    if (inView) item.classList.add("is-in");
  });

  document.documentElement.classList.add("js");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  revealables.forEach((item) => revealObserver.observe(item));
}
