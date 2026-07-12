/* ================================================================
   Prasant Shrestha - Portfolio
   Archive rendering + editorial motion (no frameworks).
   ================================================================ */

/* ---- The Archive ----
   Numbered entries, Lookback-style: "№ 01 - Title (Category)".
   Add or remove entries here; numbering is automatic. */
const archive = [
  // RepairMate / RepairMart - Mate Australia
  { title: "RepairMate Brand Banner", category: "Brand campaign", src: "assets/social/repairmart/brand-banner.jpg" },
  { title: "iPhone 14 Accessories", category: "Product creative", src: "assets/social/repairmart/iphone14-accessories.jpg" },
  { title: "iPhone 14 Teaser", category: "Product creative", src: "assets/social/repairmart/iphone14-coming-soon.jpg" },
  { title: "OnePlus Protection", category: "Product creative", src: "assets/social/repairmart/oneplus-protect.jpg" },
  { title: "MagSafe Cover", category: "Product creative", src: "assets/social/repairmart/magsafe-cover.jpg" },
  { title: "Baseus Earphones", category: "Product creative", src: "assets/social/repairmart/baseus-earphones.jpg" },
  { title: "New vs Repair", category: "Campaign visual", src: "assets/social/repairmart/new-vs-old.jpg" },
  { title: "Data Privacy Day", category: "Awareness creative", src: "assets/social/repairmart/data-privacy-day.jpg" },
  // Liumia & Alif Online - Brotherhood, Maldives
  { title: "Premium Bag Gift", category: "E-commerce creative", src: "assets/social/liumia-alif/premium-bag.jpg" },
  { title: "Victoria's Secret Set", category: "E-commerce creative", src: "assets/social/liumia-alif/victorias-secret.jpg" },
  { title: "October Gift Pack", category: "E-commerce creative", src: "assets/social/liumia-alif/october-gift.jpg" },
  { title: "Nobel Smart TV", category: "E-commerce creative", src: "assets/social/liumia-alif/smart-tv.jpg" },
  { title: "Nobel Water Dispenser", category: "E-commerce creative", src: "assets/social/liumia-alif/water-dispenser.jpg" },
  { title: "Ramadan Cookware", category: "E-commerce creative", src: "assets/social/liumia-alif/cookware.jpg" },
  { title: "Portable Ice Maker", category: "E-commerce creative", src: "assets/social/liumia-alif/ice-maker.jpg" },
  { title: "Kids Kick Scooter", category: "E-commerce creative", src: "assets/social/liumia-alif/kick-scooter.jpg" },
];

function renderArchive() {
  const grid = document.getElementById("archive-grid");
  if (!grid) return;

  grid.innerHTML = archive
    .map((item, index) => {
      const no = String(index + 1).padStart(2, "0");
      const media = item.src
        ? `<img src="${item.src}" alt="${item.title} - ${item.category}" loading="lazy" />`
        : "";
      return `
        <article class="entry">
          <figure class="entry-media">${media}</figure>
          <div class="entry-caption">
            <p class="entry-no">№ ${no}</p>
            <p class="entry-title">${item.title}<em>(${item.category})</em></p>
          </div>
        </article>`;
    })
    .join("");

  grid.querySelectorAll(".entry-media, .entry-caption").forEach((el) => {
    el.classList.add("reveal");
  });
}

/* ---- Lightbox viewer ----
   One overlay shared by the archive grid, the brand galleries and
   the hero gallery. Click a design to view it full size;
   Escape, the close button or the backdrop dismisses it. */
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
    const img = event.target.closest(
      ".entry-media img, .brand-frame-media img"
    );
    if (!img) return;
    openLightbox(img.currentSrc || img.src, img.alt);
  });
}

/* ---- The Lookback hero gallery ----
   Infinite momentum loop ported from The Lookback Studio.
   Moves only on user input: drag to fling, horizontal swipe.
   Vertical wheel is left alone so the page still scrolls. */
/* Real frames from the design archive. An entry without `src`
   falls back to a generated placeholder. */
const heroImages = [
  { title: "RepairMate - Brand Campaign", src: "assets/social/repairmart/brand-banner.jpg", variant: "wide" },
  { title: "Liumia - Premium Gift", src: "assets/social/liumia-alif/premium-bag.jpg" },
  { title: "RepairMart - Baseus Earphones", src: "assets/social/repairmart/baseus-earphones.jpg", variant: "tall" },
  { title: "RepairMart - iPhone 14 Series", src: "assets/social/repairmart/iphone14-accessories.jpg", variant: "wide" },
  { title: "Liumia - Victoria's Secret", src: "assets/social/liumia-alif/victorias-secret.jpg" },
  { title: "Alif Online - Ramadan Cookware", src: "assets/social/liumia-alif/cookware.jpg", variant: "tall" },
  { title: "Alif Online - Nobel Smart TV", src: "assets/social/liumia-alif/smart-tv.jpg", variant: "wide" },
  { title: "RepairMart - MagSafe Cover", src: "assets/social/repairmart/magsafe-cover.jpg" },
];

function heroPlaceholderSrc(no, variant) {
  const [w, h] =
    variant === "wide" ? [1600, 900] : variant === "tall" ? [800, 1300] : [1000, 1250];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect width="100%" height="100%" fill="#141414"/>
    <path d="M0 0 L${w} ${h} M${w} 0 L0 ${h}" stroke="#242424" stroke-width="2"/>
    <rect x="3" y="3" width="${w - 6}" height="${h - 6}" fill="none" stroke="#2c2c2c" stroke-width="4"/>
    <text x="50%" y="50%" fill="#3d3d3d" font-family="Archivo, sans-serif" font-size="${Math.round(
      Math.min(w, h) / 5
    )}" font-weight="500" text-anchor="middle" dominant-baseline="central">${no}</text>
  </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

function setupHeroGallery() {
  const hero = document.querySelector("[data-hero-gallery]");
  const viewport = document.querySelector("[data-hero-viewport]");
  const track = document.querySelector("[data-hero-track]");
  const soundToggle = document.querySelector("[data-sound-toggle]");
  if (!hero || !viewport || !track) return;

  const lerpStrength = 0.075;
  const dragMultiplier = 1.25;
  const dragReleaseImpulse = 0.36;
  const motorFriction = 0.925;
  const maxMotorVelocity = 82;
  const maxSoundVolume = 0.72;
  const soundShiftIntervalPx = (3 * 96) / 25.4; // every 3mm of travel
  const minSoundPlaybackRate = 0.42;
  const maxSoundPlaybackRate = 1.05;
  const soundPoolSize = 6;

  let setWidth = 0;
  let currentX = 0;
  let targetX = 0;
  let motorVelocity = 0;
  let lastFrameTime = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartTarget = 0;
  let dragLastX = 0;
  let dragVelocity = 0;
  let dragMoved = 0;
  let dragDownTarget = null;
  let scrollSounds = [];
  let soundPoolIndex = 0;
  let soundEnabled = false;
  let shiftedSinceSound = 0;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  track.innerHTML = heroImages
    .map((image, index) => {
      const no = String(index + 1).padStart(2, "0");
      const variant = image.variant ? ` hero-card--${image.variant}` : "";
      const src = image.src
        ? encodeURI(image.src)
        : heroPlaceholderSrc(no, image.variant);
      return `
        <article class="hero-card${variant}" data-index="${no}" data-title="${image.title}">
          <img src="${src}" alt="${image.title}" loading="eager" draggable="false" />
        </article>`;
    })
    .join("");

  /* size each frame from its image's natural aspect ratio -
     the card width becomes height x ratio (see .hero-card CSS) */
  Array.from(track.children).forEach((card) => {
    const img = card.querySelector("img");
    if (!img) return;
    const applyRatio = () => {
      if (!img.naturalWidth || !img.naturalHeight) return;
      card.style.setProperty(
        "--card-ar",
        (img.naturalWidth / img.naturalHeight).toFixed(4)
      );
      setup(); // widths changed - rebuild clones and re-measure the loop
    };
    if (img.complete) applyRatio();
    else img.addEventListener("load", applyRatio, { once: true });
  });

  function cloneOriginalSet() {
    track
      .querySelectorAll('[data-clone="true"]')
      .forEach((clone) => clone.remove());
    const fragment = document.createDocumentFragment();
    Array.from(track.children).forEach((item) => {
      const clone = item.cloneNode(true);
      clone.dataset.clone = "true";
      clone.setAttribute("aria-hidden", "true");
      fragment.appendChild(clone);
    });
    track.appendChild(fragment);
  }

  function measureSetWidth() {
    const firstClone = track.querySelector('[data-clone="true"]');
    if (!firstClone || !track.firstElementChild) return 0;
    return firstClone.offsetLeft - track.firstElementChild.offsetLeft;
  }

  function wrapPosition() {
    if (setWidth <= 0) return;
    while (targetX <= -setWidth) {
      targetX += setWidth;
      currentX += setWidth;
    }
    while (targetX > 0) {
      targetX -= setWidth;
      currentX -= setWidth;
    }
  }

  function initSounds() {
    if (scrollSounds.length) return;
    scrollSounds = Array.from({ length: soundPoolSize }, () => {
      const sound = new Audio("fx.mp3");
      sound.preload = "auto";
      sound.volume = 0;
      sound.load();
      return sound;
    });
  }

  function playScrollSound(intensity) {
    const speed = clamp(intensity, 0.18, 1);
    const sound = scrollSounds[soundPoolIndex];
    soundPoolIndex = (soundPoolIndex + 1) % scrollSounds.length;
    sound.pause();
    sound.currentTime = 0;
    sound.playbackRate =
      minSoundPlaybackRate + speed * (maxSoundPlaybackRate - minSoundPlaybackRate);
    sound.volume = maxSoundVolume * clamp(0.45 + speed * 0.55, 0, 1);
    sound.play().catch(() => {});
  }

  function playShiftSounds(shiftAmount) {
    if (!soundEnabled || shiftAmount <= 0) return;
    shiftedSinceSound += shiftAmount;
    if (shiftedSinceSound < soundShiftIntervalPx) return;
    const count = Math.min(
      Math.floor(shiftedSinceSound / soundShiftIntervalPx),
      2
    );
    shiftedSinceSound %= soundShiftIntervalPx;
    for (let i = 0; i < count; i += 1) {
      playScrollSound(shiftAmount / soundShiftIntervalPx);
    }
  }

  function render(timestamp = 0) {
    const deltaTime = lastFrameTime ? timestamp - lastFrameTime : 16.67;
    const frameScale = Math.min(deltaTime / 16.67, 2.4);
    lastFrameTime = timestamp;

    if (!isDragging) {
      targetX += motorVelocity * frameScale;
      motorVelocity *= Math.pow(motorFriction, frameScale);
      if (Math.abs(motorVelocity) < 0.015) motorVelocity = 0;
    }

    wrapPosition();

    const frameStartX = currentX;
    currentX += (targetX - currentX) * lerpStrength;
    if (Math.abs(targetX - currentX) < 0.01) currentX = targetX;

    track.style.transform = `translate3d(${currentX}px, 0, 0)`;
    playShiftSounds(Math.abs(currentX - frameStartX));
    requestAnimationFrame(render);
  }

  viewport.addEventListener("pointerdown", (event) => {
    isDragging = true;
    dragStartX = event.clientX;
    dragLastX = event.clientX;
    dragVelocity = 0;
    motorVelocity = 0;
    dragStartTarget = targetX;
    dragMoved = 0;
    dragDownTarget = event.target;
    viewport.setPointerCapture(event.pointerId);
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    dragVelocity = event.clientX - dragLastX;
    dragMoved += Math.abs(event.clientX - dragLastX);
    dragLastX = event.clientX;
    targetX = dragStartTarget + (event.clientX - dragStartX) * dragMultiplier;
  });

  const endDrag = (event) => {
    if (!isDragging) return;
    isDragging = false;
    motorVelocity = clamp(
      dragVelocity * dragReleaseImpulse,
      -maxMotorVelocity,
      maxMotorVelocity
    );
    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
    /* a press that never travelled is a click - open the design */
    if (event.type === "pointerup" && dragMoved < 8 && dragDownTarget) {
      const card = dragDownTarget.closest(".hero-card");
      const img = card ? card.querySelector("img") : null;
      if (img && !img.src.startsWith("data:")) {
        openLightbox(img.src, card.dataset.title);
      }
    }
    dragDownTarget = null;
  };

  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);

  /* horizontal trackpad swipes drive the gallery; vertical wheel scrolls the page */
  hero.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      motorVelocity = clamp(
        motorVelocity - event.deltaX * 0.18,
        -maxMotorVelocity,
        maxMotorVelocity
      );
    },
    { passive: false }
  );

  if (soundToggle) {
    soundToggle.addEventListener("click", () => {
      initSounds();
      soundEnabled = !soundEnabled;
      soundToggle.textContent = soundEnabled ? "Sound On" : "Sound Off";
      if (soundEnabled) playScrollSound(0.35);
    });
  }

  function setup() {
    cloneOriginalSet();
    setWidth = measureSetWidth();
    if (setWidth <= 0) return;
    currentX %= setWidth;
    targetX %= setWidth;
    wrapPosition();
  }

  window.addEventListener("load", setup);
  window.addEventListener("resize", setup);
  setup();
  requestAnimationFrame(render);
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
  const hasHero = Boolean(document.querySelector("[data-hero-gallery]"));
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 60);
    if (hasHero) {
      header.classList.toggle(
        "is-past-hero",
        window.scrollY > window.innerHeight - 80
      );
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

renderArchive();
setupTicker();
setupHeader();
setupHeroGallery();
setupBrandPopouts();
setupLightbox();
setupReveals();
