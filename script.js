const header = document.querySelector("[data-header]");
const nav = document.querySelector(".main-nav");
const navToggle = document.querySelector(".nav-toggle");
const year = document.querySelector("[data-current-year]");
const revealItems = document.querySelectorAll(".reveal");
const rotatingDomain = document.querySelector("[data-rotating-domain]");
const calendarStart = document.querySelector("[data-calendar-start]");
const calendarDuration = document.querySelector("[data-calendar-duration]");
const calendarSubmit = document.querySelector("[data-calendar-submit]");
const calendarMessage = document.querySelector("[data-calendar-message]");
const BUSINESS_START_HOUR = 8;
const BUSINESS_START_MINUTE = 30;
const BUSINESS_END_HOUR = 19;
const BUSINESS_END_MINUTE = 0;
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

const toDateTimeLocalValue = (date) => {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}T${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}`;
};

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

const isBusinessDay = (date) => {
  const day = date.getDay();
  return day >= 1 && day <= 5;
};

const minutesFromMidnight = (date) => date.getHours() * 60 + date.getMinutes();

const businessStartMinutes = BUSINESS_START_HOUR * 60 + BUSINESS_START_MINUTE;
const businessEndMinutes = BUSINESS_END_HOUR * 60 + BUSINESS_END_MINUTE;

const moveToNextBusinessDay = (date) => {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  next.setHours(BUSINESS_START_HOUR, BUSINESS_START_MINUTE, 0, 0);

  while (!isBusinessDay(next)) {
    next.setDate(next.getDate() + 1);
  }

  return next;
};

const getNextBusinessSlot = () => {
  const slot = new Date();
  slot.setMinutes(slot.getMinutes() + 60);
  slot.setMinutes(Math.ceil(slot.getMinutes() / 15) * 15, 0, 0);

  if (!isBusinessDay(slot)) {
    return moveToNextBusinessDay(slot);
  }

  const slotMinutes = minutesFromMidnight(slot);

  if (slotMinutes < businessStartMinutes) {
    slot.setHours(BUSINESS_START_HOUR, BUSINESS_START_MINUTE, 0, 0);
    return slot;
  }

  if (slotMinutes >= businessEndMinutes) {
    return moveToNextBusinessDay(slot);
  }

  return slot;
};

const setCalendarMessage = (message, isError = false) => {
  if (!calendarMessage) return;
  calendarMessage.textContent = message;
  calendarMessage.classList.toggle("is-error", isError);
};

const getScheduleValidationMessage = (start, durationMinutes) => {
  if (Number.isNaN(start.getTime())) {
    return "Selecciona una fecha y hora válida.";
  }

  if (!isBusinessDay(start)) {
    return "Selecciona un día de lunes a viernes.";
  }

  const startMinutes = minutesFromMidnight(start);
  const endMinutes = startMinutes + durationMinutes;

  if (startMinutes < businessStartMinutes) {
    return "El horario disponible comienza a las 08:30.";
  }

  if (endMinutes > businessEndMinutes) {
    return "La reunión debe terminar a más tardar a las 19:00.";
  }

  return "";
};

if (calendarStart instanceof HTMLInputElement) {
  const nextBusinessSlot = getNextBusinessSlot();
  calendarStart.min = toDateTimeLocalValue(nextBusinessSlot);
  calendarStart.value = toDateTimeLocalValue(nextBusinessSlot);
}

calendarSubmit?.addEventListener("click", () => {
  if (!(calendarStart instanceof HTMLInputElement) || !calendarStart.value) {
    calendarStart?.focus();
    calendarStart?.reportValidity();
    return;
  }

  const start = new Date(calendarStart.value);
  const durationMinutes = Number(calendarDuration?.value || 45);
  const validationMessage = getScheduleValidationMessage(start, durationMinutes);

  if (validationMessage) {
    calendarStart.setCustomValidity(validationMessage);
    calendarStart.reportValidity();
    setCalendarMessage(validationMessage, true);
    return;
  }

  calendarStart.setCustomValidity("");
  setCalendarMessage("Horario válido: se abrirá Google Calendar.", false);

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

[calendarStart, calendarDuration].forEach((control) => {
  control?.addEventListener("change", () => {
    calendarStart?.setCustomValidity("");
    setCalendarMessage("Lunes a viernes, 08:30 a 19:00.", false);
  });
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
