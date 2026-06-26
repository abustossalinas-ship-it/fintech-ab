const header = document.querySelector("[data-header]");
const nav = document.querySelector(".main-nav");
const navToggle = document.querySelector(".nav-toggle");
const year = document.querySelector("[data-current-year]");
const revealItems = document.querySelectorAll(".reveal");
const rotatingDomain = document.querySelector("[data-rotating-domain]");
const domains = [
  "Operaciones TI",
  "Transformación Digital",
  "Modernización Tecnológica",
  "Cloud & Arquitectura",
  "Gobierno TI",
  "FinTech e IA",
];

if (year) {
  year.textContent = new Date().getFullYear();
}

if (rotatingDomain && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let domainIndex = 0;

  window.setInterval(() => {
    rotatingDomain.classList.add("is-changing");

    window.setTimeout(() => {
      domainIndex = (domainIndex + 1) % domains.length;
      rotatingDomain.textContent = domains[domainIndex];
      rotatingDomain.classList.remove("is-changing");
    }, 220);
  }, 2400);
}

const syncHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") ?? false;
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("nav-open", isOpen);
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
