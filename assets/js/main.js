const WA_LINK = "https://wa.me/77055715506";
const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  initMenu();
  initWhatsapp();
  initReveal();
  initMagneticButtons();
  initHoverDepth();

  if (!reducedMotion && window.matchMedia("(min-width: 781px)").matches) {
    initParallax();
  }
});

function initMenu() {
  const nav = qs(".nav-links");
  const menu = qs(".menu-toggle");
  menu?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menu.setAttribute("aria-expanded", String(open));
  });
  qsa(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menu?.setAttribute("aria-expanded", "false");
    });
  });
}

function initWhatsapp() {
  const text = encodeURIComponent("Здравствуйте! Хочу обсудить проект с Silk Web.");
  qsa("[data-whatsapp]").forEach((link) => {
    link.setAttribute("href", `${WA_LINK}?text=${text}`);
  });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: .18 });
  qsa(".reveal, .reveal-text").forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
    observer.observe(item);
  });
}

function initMagneticButtons() {
  qsa("[data-magnetic]").forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .08}px, ${(event.clientY - rect.top - rect.height / 2) * .08}px)`;
    });
    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}

function initHoverDepth() {
  qsa("[data-depth]").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(1400px) rotateX(${-y * 2.2}deg) rotateY(${x * 2.2}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function initParallax() {
  const layers = qsa("[data-parallax]");
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener("mousemove", (event) => {
    targetX = (event.clientX / innerWidth - .5) * 34;
    targetY = (event.clientY / innerHeight - .5) * 26;
  }, { passive: true });

  const render = () => {
    currentX += (targetX - currentX) * .055;
    currentY += (targetY - currentY) * .055;
    const scroll = Math.min(scrollY, 900);

    layers.forEach((layer) => {
      const depth = Number(layer.dataset.parallax || 1);
      const x = currentX * depth;
      const y = currentY * depth - scroll * depth * .025;
      layer.style.translate = `${x}px ${y}px`;
    });

    requestAnimationFrame(render);
  };

  render();
}
