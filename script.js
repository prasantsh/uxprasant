/* ================================================================
   Prasant Shrestha - Portfolio
   Archive rendering + editorial motion (no frameworks).
   ================================================================ */

/* ---- The Archive ----
   Numbered entries, Lookback-style: "№ 01 - Title (Category)".
   Add or remove entries here; numbering is automatic. */
const archive = [
  {
    title: "Hypnotik FX",
    category: "Product walkthrough",
    image: "manual-thumbnails/Hypnotik FX - Setting up Hypnotik LED Strip Controller.jpg",
  },
  {
    title: "X-Pro Controller",
    category: "UI documentation",
    image: "manual-thumbnails/X-Pro-Controller.png",
  },
  {
    title: "Audio Reactive",
    category: "Explainer visual",
    image: "manual-thumbnails/Audio Reactive Pixel Controller (Wi-Fi).png",
  },
  {
    title: "Effects Panel",
    category: "Feature showcase",
    image: "manual-thumbnails/Hypnotik FX - Using Effects.png",
  },
  {
    title: "Segment Setup",
    category: "Motion-led tutorial",
    image: "manual-thumbnails/Hypnotik FX - Setting Up Segments in Audio Reactive Controller.jpg",
  },
  {
    title: "Wiring Guide",
    category: "Technical thumbnail",
    image: "manual-thumbnails/Wiring_ Vibe X4 Ultra RGB + 3000K_.png",
  },
  {
    title: "Color Palettes",
    category: "Feature showcase",
    image: "manual-thumbnails/Hypnotik FX - Using Color Palletes_.png",
  },
  {
    title: "Preset Creation",
    category: "Product walkthrough",
    image: "manual-thumbnails/Hypnotik FX - How to Create Presets.png",
  },
  {
    title: "Sync Setup",
    category: "Explainer visual",
    image: "manual-thumbnails/Hypnotik FX - Setting up Sync.png",
  },
  {
    title: "Controller Comparison",
    category: "Educate",
    image: "manual-thumbnails/Difference between Controllers (Audio Reactive vs. X-Pro Controller).png",
  },
  {
    title: "LED Strip Connection",
    category: "Technical thumbnail",
    image: "manual-thumbnails/Connecting the LED Strips.png",
  },
  {
    title: "Power Specifications",
    category: "Educate",
    image: "manual-thumbnails/Hypnotik Power Supply Specifications.png",
  },
];

function renderArchive() {
  const grid = document.getElementById("archive-grid");
  if (!grid) return;

  grid.innerHTML = archive
    .map((item, index) => {
      const no = String(index + 1).padStart(2, "0");
      return `
        <article class="entry">
          <figure class="entry-media">
            <img
              src="${encodeURI(item.image)}"
              alt="${item.title} - ${item.category}"
              loading="${index < 4 ? "eager" : "lazy"}"
            />
          </figure>
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

/* ---- The Lookback hero gallery ----
   Infinite momentum loop ported from The Lookback Studio.
   Moves only on user input: drag to fling, horizontal swipe.
   Vertical wheel is left alone so the page still scrolls. */
/* Dummy frames for now. To use real work, give an entry a `src`
   (e.g. src: "manual-thumbnails/X-Pro-Controller.png") and it will
   be used instead of the generated placeholder. */
const heroImages = [
  { title: "Placeholder 01", variant: "wide" },
  { title: "Placeholder 02" },
  { title: "Placeholder 03", variant: "tall" },
  { title: "Placeholder 04", variant: "wide" },
  { title: "Placeholder 05" },
  { title: "Placeholder 06", variant: "tall" },
  { title: "Placeholder 07", variant: "wide" },
  { title: "Placeholder 08" },
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
    viewport.setPointerCapture(event.pointerId);
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    dragVelocity = event.clientX - dragLastX;
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
setupReveals();
