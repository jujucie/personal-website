// year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// NAV: hide on down, show on up
const nav = document.querySelector(".nav");
let lastY = 0;
let ticking = false;

function getScrollTop() {
  return (document.scrollingElement && document.scrollingElement.scrollTop) ||
         (document.documentElement && document.documentElement.scrollTop) ||
         document.body.scrollTop ||
         0;
}

function updateNav() {
  if (!nav) return;

  const y = getScrollTop();

  // always show near top
  if (y < 40) {
    nav.classList.remove("nav--hidden");
    lastY = y;
    ticking = false;
    return;
  }

  // down -> hide
  if (y > lastY + 6) nav.classList.add("nav--hidden");

  // up -> show
  if (y < lastY - 6) nav.classList.remove("nav--hidden");

  lastY = y;
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateNav);
  }
}, { passive: true });

lastY = getScrollTop();
updateNav();

// mobile nav drawer
const navToggle = document.querySelector(".nav-toggle");
const navDrawer = document.querySelector(".nav-drawer");

if (navToggle && navDrawer) {
  navToggle.addEventListener("click", () => {
    const open = navDrawer.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navDrawer.setAttribute("aria-hidden", String(!open));
  });

  navDrawer.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navDrawer.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navDrawer.setAttribute("aria-hidden", "true");
    });
  });
}

// reveal on scroll (MATCHES YOUR CSS: is-visible)
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) e.target.classList.add("is-visible");
    }
  },
  { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
);
revealEls.forEach((el) => io.observe(el));


// focus management for modals
let lastFocusEl = null;

// image lightbox
const lightbox = document.querySelector(".lightbox");
const lbContent = document.querySelector(".lightbox-content");

function openLightbox(imgSrc, altText) {
  if (!lightbox || !lbContent) return;
  lastFocusEl = document.activeElement;
  lbContent.innerHTML = "";
  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = altText || "Image";
  lbContent.appendChild(img);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  const closeBtn = lightbox.querySelector('.lightbox-close');
  if (closeBtn) closeBtn.focus();
}

function closeLightbox() {
  if (!lightbox || !lbContent) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lbContent.innerHTML = "";
  document.body.style.overflow = "";
  if (lastFocusEl && typeof lastFocusEl.focus === 'function') lastFocusEl.focus();
  lastFocusEl = null;
}

document.querySelectorAll(".js-lightbox").forEach((img) => {
  img.addEventListener("click", () => openLightbox(img.src, img.alt));
  img.style.cursor = "zoom-in";
});

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    const close = e.target && e.target.getAttribute("data-close");
    if (close) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

// video modal
const vmodal = document.querySelector(".vmodal");
const vContent = document.querySelector(".vmodal-content");

function ensureVideoModalExists() {
  if (vmodal) return;

  // If you don't already have a vmodal in HTML, create it.
  // If you DO have it, this does nothing.
  const modal = document.createElement("div");
  modal.className = "vmodal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="vmodal-backdrop" data-vclose="1"></div>
    <div class="vmodal-panel" role="dialog" aria-modal="true" aria-label="Video viewer">
      <button class="vmodal-close" type="button" aria-label="Close" data-vclose="1">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"/>
        </svg>
      </button>
      <div class="vmodal-content"></div>
    </div>
  `;
  document.body.appendChild(modal);
}
ensureVideoModalExists();

const vmodalEl = document.querySelector(".vmodal");
const vContentEl = document.querySelector(".vmodal-content");

function openVideoModal(src, poster) {
  if (!vmodalEl || !vContentEl) return;
  lastFocusEl = document.activeElement;
  vContentEl.innerHTML = "";

  const v = document.createElement("video");
  v.controls = true;
  v.playsInline = true;
  if (poster) v.poster = poster;

  const s = document.createElement("source");
  s.src = src;
  s.type = "video/mp4";
  v.appendChild(s);

  vContentEl.appendChild(v);
  vmodalEl.classList.add("is-open");
  vmodalEl.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  const closeBtn = vmodalEl.querySelector('.vmodal-close');
  if (closeBtn) closeBtn.focus();
  v.play().catch(() => {});
}

function closeVideoModal() {
  if (!vmodalEl || !vContentEl) return;
  vmodalEl.classList.remove("is-open");
  vmodalEl.setAttribute("aria-hidden", "true");
  vContentEl.innerHTML = "";
  document.body.style.overflow = "";
  if (lastFocusEl && typeof lastFocusEl.focus === 'function') lastFocusEl.focus();
  lastFocusEl = null;
}

document.querySelectorAll(".js-video-fullscreen").forEach((btn) => {
  btn.addEventListener("click", () => {
    const src = btn.getAttribute("data-src");
    const poster = btn.getAttribute("data-poster");
    if (src) openVideoModal(src, poster);
  });
});

if (vmodalEl) {
  vmodalEl.addEventListener("click", (e) => {
    const close = e.target && e.target.getAttribute("data-vclose");
    if (close) closeVideoModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeVideoModal();
  });
}