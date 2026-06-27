const header = document.querySelector("[data-header]");
const nav = document.querySelector(".main-nav");
const navToggle = document.querySelector(".nav-toggle");
const year = document.querySelector("[data-current-year]");
const revealItems = document.querySelectorAll(".reveal");
const rotatingDomain = document.querySelector("[data-rotating-domain]");
const calendarStart = document.querySelector("[data-calendar-start]");
const calendarDuration = document.querySelector("[data-calendar-duration]");
const calendarSubmit = document.querySelector("[data-calendar-submit]");
const domains = [
  "Operaciones TI",
  "Transformación Digital",
  "Modernización Tecnológica",
  "Inteligencia Artificial",
  "Cloud & Arquitectura",
  "Gobierno TI",
  "Product Strategy",
];

if (year) {
  year.textContent = new Date().getFullYear();
}

const padDatePart = (value) => String(value).padStart(2, "0");

const toGoogleCalendarDate = (date) => {
  return [
    date.getUTCFullYear(),
    padDatePart(date.getUTCMonth() + 1),
    padDatePart(date.getUTCDate()),
    "T",
    padDatePart(date.getUTCHours()),
    padDatePart(date.getUTCMinutes()),
    padDatePart(date.getUTCSeconds()),
    "Z",
  ].join("");
};

if (calendarStart instanceof HTMLInputElement) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 60);
  now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0, 0);

  calendarStart.min = `${now.getFullYear()}-${padDatePart(now.getMonth() + 1)}-${padDatePart(now.getDate())}T${padDatePart(now.getHours())}:${padDatePart(now.getMinutes())}`;
}

calendarSubmit?.addEventListener("click", () => {
  if (!(calendarStart instanceof HTMLInputElement) || !calendarStart.value) {
    calendarStart?.focus();
    calendarStart?.reportValidity();
    return;
  }

  const start = new Date(calendarStart.value);
  const durationMinutes = Number(calendarDuration?.value || 45);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Reunión con Ariel Bustos Salinas",
    details: "Hola Ariel, estuve revisando tu perfil. Me gustaría conversar contigo.",
    dates: `${toGoogleCalendarDate(start)}/${toGoogleCalendarDate(end)}`,
    add: "abustos.salinas@gmail.com",
  });

  window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, "_blank", "noopener,noreferrer");
});

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
