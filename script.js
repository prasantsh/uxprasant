/* ================================================================
   Prasant Shrestha - Portfolio
   Archive rendering + editorial motion (no frameworks).
   ================================================================ */

/* ---- Lightbox viewer ----
   One overlay shared by the brand galleries. Click a design to view
   it full size; Escape, the close button or the backdrop dismisses it. */
let lightboxEls = null;

function ensureLightbox() {
  if (lightboxEls) return lightboxEls;

  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Design viewer");
  overlay.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close viewer">Close</button>
    <figure class="lightbox-body">
      <img alt="" />
      <figcaption></figcaption>
    </figure>`;
  document.body.appendChild(overlay);

  const img = overlay.querySelector("img");
  const caption = overlay.querySelector("figcaption");
  const close = () => {
    overlay.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    img.removeAttribute("src");
  };

  overlay.addEventListener("click", (event) => {
    if (!event.target.closest(".lightbox-body img")) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      close();
    }
  });

  lightboxEls = { overlay, img, caption };
  return lightboxEls;
}

function openLightbox(src, label) {
  const { overlay, img, caption } = ensureLightbox();
  img.src = src;
  img.alt = label || "";
  caption.textContent = label || "";
  overlay.classList.add("is-open");
  document.body.classList.add("lightbox-open");
}

function setupLightbox() {
  document.addEventListener("click", (event) => {
    const img = event.target.closest(".brand-frame-media img");
    if (!img) return;
    openLightbox(img.currentSrc || img.src, img.alt);
  });
}

/* ---- Branding dropdown ----
   Compact trigger toggles an inline accordion of the designs.
   Escape closes it while focus is inside. */
function setupBrandPopouts() {
  const groups = document.querySelectorAll("[data-brand-popout]");
  if (!groups.length) return;

  groups.forEach((group) => {
    const trigger = group.querySelector(".brand-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const isOpen = group.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
    });

    group.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && group.classList.contains("is-open")) {
        group.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
        trigger.focus();
      }
    });
  });
}

/* ---- scroll reveals ---- */
function setupReveals() {
  const targets = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---- ticker: duplicate content so the loop is seamless ---- */
function setupTicker() {
  const track = document.querySelector(".ticker-track");
  if (!track) return;
  track.appendChild(track.querySelector(".ticker-group").cloneNode(true));
}

/* ---- header compacts after 60px; on the home page it also swaps
   from dark-transparent to paper once scrolled past the hero.
   Subpages set is-past-hero in the HTML and keep it. ---- */
function setupHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  /* pages that start past the hero (subpages) keep their paper header;
     only a page with a full-height hero swaps on scroll */
  const swapsPastHero =
    !header.classList.contains("is-past-hero") &&
    Boolean(document.querySelector(".hero"));
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 60);
    if (swapsPastHero) {
      header.classList.toggle(
        "is-past-hero",
        window.scrollY > window.innerHeight - 80
      );
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

setupTicker();
setupHeader();
setupBrandPopouts();
setupLightbox();
setupReveals();
