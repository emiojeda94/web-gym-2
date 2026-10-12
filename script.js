"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");
const dialog = document.querySelector("#stage-dialog");
const dialogMessage = document.querySelector("#dialog-message");

function closeMenu() {
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
}

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  navigation.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});

navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

// Las acciones pendientes informan su estado hasta desarrollar cada sección.
document.querySelectorAll("[data-section]:not(.plan-button)").forEach(button => {
  button.addEventListener("click", () => {
    closeMenu();
    dialogMessage.textContent = `${button.dataset.section}: este contenido se incorporará en una próxima etapa del diseño.`;
    dialog.showModal();
  });
});

document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});
window.matchMedia("(min-width: 851px)").addEventListener("change", event => {
  if (event.matches) closeMenu();
});

// Entrada suave de cada sección al llegar a ella, una sola vez.
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealGroups = [
  [".about", ".about-photo, .about-content > *"],
  [".hours", ".hours-content > *"],
  [".plans", ":scope > .section-label, :scope > h2, .plan-card"],
  [".classes", ".classes-photo, .classes-content > *"],
  [".location", ".location-content > .section-label, .location-content > h2, .location-details > div"],
  [".site-footer", ".footer-invitation > *, .footer-bottom"]
];

if (!motionPreference.matches && "IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealGroups.forEach(([sectionSelector, itemSelector]) => {
    const section = document.querySelector(sectionSelector);
    if (!section) return;
    section.querySelectorAll(itemSelector).forEach((item, index) => {
      item.classList.add("reveal-item");
      item.style.setProperty("--reveal-delay", `${Math.min(index * 0.15, 0.6)}s`);
    });
    sectionObserver.observe(section);
    section.classList.add("reveal-section");
  });

  motionPreference.addEventListener("change", event => {
    if (event.matches) {
      document.querySelectorAll(".reveal-section").forEach(section => {
        section.classList.add("is-visible");
      });
      sectionObserver.disconnect();
    }
  });
}

// La tarjeta emergente reutiliza los datos del plan seleccionado.
const planDialog = document.querySelector("#plan-dialog");
const planWhatsApp = document.querySelector("#plan-whatsapp");
document.querySelectorAll(".plan-button").forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".plan-card");
    const name = card.querySelector("h3").textContent.trim();
    document.querySelector("#selected-plan-title").textContent = `Plan ${name}`;
    document.querySelector("#selected-plan-price").replaceChildren(
      ...Array.from(card.querySelector(".plan-price").childNodes, node => node.cloneNode(true))
    );
    document.querySelector("#selected-plan-features").replaceChildren(
      ...Array.from(card.querySelectorAll(".plan-features li"), item => item.cloneNode(true))
    );
    const message = `Hola, quiero consultar por el plan ${name}.`;
    planWhatsApp.href = `https://wa.me/59892345678?text=${encodeURIComponent(message)}`;
    planDialog.showModal();
    document.body.classList.add("modal-open");
  });
});
document.querySelector("#close-plan-dialog").addEventListener("click", () => planDialog.close());
planDialog.addEventListener("close", () => document.body.classList.remove("modal-open"));
planDialog.addEventListener("click", event => {
  if (event.target !== planDialog) return;
  const bounds = planDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
    planDialog.close();
  }
});

// Carga el mapa al abrirlo, para evitar solicitudes antes de usarlo.
const mapDialog = document.querySelector("#map-dialog");
const locationMap = document.querySelector("#location-map");
document.querySelector("#open-map").addEventListener("click", () => {
  if (!locationMap.hasAttribute("src")) {
    const address = encodeURIComponent("Chile y Ansina, Montevideo, Uruguay");
    locationMap.src = `https://www.google.com/maps?q=${address}&output=embed`;
  }
  mapDialog.showModal();
  document.body.classList.add("modal-open");
});
document.querySelector("#close-map-dialog").addEventListener("click", () => mapDialog.close());
mapDialog.addEventListener("close", () => document.body.classList.remove("modal-open"));
mapDialog.addEventListener("click", event => {
  if (event.target !== mapDialog) return;
  const bounds = mapDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
    mapDialog.close();
  }
});

const classScheduleDialog = document.querySelector("#class-schedule-dialog");
document.querySelector("#open-class-schedule").addEventListener("click", () => {
  classScheduleDialog.showModal();
  document.body.classList.add("modal-open");
});
document.querySelector("#close-class-schedule").addEventListener("click", () => classScheduleDialog.close());
classScheduleDialog.addEventListener("close", () => document.body.classList.remove("modal-open"));
classScheduleDialog.addEventListener("click", event => {
  if (event.target !== classScheduleDialog) return;
  const bounds = classScheduleDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
    classScheduleDialog.close();
  }
});
