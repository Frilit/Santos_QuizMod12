// fun-feature.js
// Self-contained celebration feature: countdown, theme swap, confetti + floating emoji.
// Works in browser. Also exports functions for Jest tests (Node/jsdom).

(function (global) {
  // --- Utilities ---
  function createEl(tag, attrs = {}, parent = document.body) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else el.setAttribute(k, v);
    });
    parent.appendChild(el);
    return el;
  }

  // Curated pleasing palettes (background, accent)
  const PALETTES = [
    { bg: ["#f6f7fb", "#eef9ff"], accent: ["#7c5cff", "#00c2ff"] },
    { bg: ["#fff7f3", "#fffaf0"], accent: ["#ff6b6b", "#ffb86b"] },
    { bg: ["#f6fffb", "#f0fffb"], accent: ["#00b894", "#00d2ff"] },
    { bg: ["#f6f5ff", "#f3fbff"], accent: ["#6f42c1", "#0077ff"] },
    { bg: ["#fff7ff", "#fef6ff"], accent: ["#ff6bd6", "#8e6bff"] },
  ];

  function pickPalette() {
    const p = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    // pick a background gradient and primary accent
    const bg = `linear-gradient(180deg, ${p.bg[0]}, ${p.bg[1]})`;
    const accent = p.accent[0];
    return { bg, accent };
  }

  // Insert runtime styles for overlays, confetti, emoji animations
  function ensureStyles() {
    if (document.getElementById("celebration-styles")) return;
    const css = `
    .celebration-overlay {
      position: fixed;
      inset: 0;
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:9998;
      pointer-events:none;
    }
    .celebration-count {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      font-size: 6rem;
      font-weight: 800;
      color: white;
      text-shadow: 0 8px 28px rgba(0,0,0,0.35);
      pointer-events: none;
    }
    .celebration-theme-flash {
      position: fixed;
      inset: 0;
      z-index: 9996;
      transition: opacity 600ms ease;
      pointer-events: none;
    }
    .confetti-piece {
      position: fixed;
      width: 10px;
      height: 16px;
      border-radius: 2px;
      z-index: 9997;
      pointer-events: none;
      will-change: transform, opacity;
      opacity: 0.95;
    }
    .emoji-floating {
      position: fixed;
      z-index: 9997;
      font-size: 28px;
      pointer-events: none;
      will-change: transform, opacity;
    }
    `;
    const style = document.createElement("style");
    style.id = "celebration-styles";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  // Change theme: update CSS variables / background, plus a brief flash element
  function applyTheme(palette) {
    const root = document.documentElement;
    root.style.setProperty("--celebration-bg", palette.bg);
    root.style.setProperty("--celebration-accent", palette.accent);

    // Apply an immediate full-page background via a flash div so body layout isn't broken
    const flash = createEl("div", {
      class: "celebration-theme-flash",
      id: "celebration-flash",
    });
    flash.style.background = palette.bg;
    flash.style.opacity = "0";
    flash.style.transition = "opacity 450ms ease";
    // force paint
    void flash.offsetWidth;
    flash.style.opacity = "1";

    setTimeout(() => {
      // commit to body background
      document.body.style.background = palette.bg;
      // remove/fade flash
      flash.style.opacity = "0";
      setTimeout(() => {
        if (flash.parentElement) flash.parentElement.removeChild(flash);
      }, 600);
    }, 350);
  }

  // Create confetti pieces — simple DOM rectangles animated with JS
  function launchConfetti({ count = 80, spread = 120, originX = 0.5 } = {}) {
    const colors = [
      "#ff6b6b",
      "#ffd166",
      "#6bf0c3",
      "#8e6bff",
      "#00c2ff",
      "#ff9ad3",
    ];
    const pieces = [];
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < count; i++) {
      const el = createEl("div", { class: "confetti-piece" });
      const color = colors[Math.floor(Math.random() * colors.length)];
      el.style.background = color;
      // random start position near origin
      const x = w * originX + (Math.random() - 0.5) * 80;
      const y = Math.random() * (h * 0.2);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      // random rotation
      el.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(el);
      pieces.push(el);

      // animate with JS using velocities
      const vx = (Math.random() - 0.5) * spread * 0.6;
      const vy = 200 + Math.random() * 500;
      const angular = (Math.random() - 0.5) * 600;
      const lifetime = 2000 + Math.random() * 1800;
      const start = performance.now();

      function frame(now) {
        const t = now - start;
        if (t > lifetime) {
          el.style.opacity = "0";
          setTimeout(() => {
            if (el.parentElement) el.parentElement.removeChild(el);
          }, 400);
          return;
        }
        // simple physics
        const px = x + vx * (t / 1000);
        const py = y + vy * (t / 1000) - 0.5 * 800 * Math.pow(t / 1000, 2); // gravity-ish
        el.style.transform = `translate(${px - x}px, ${py - y}px) rotate(${
          angular * (t / 1000)
        }deg)`;
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    return pieces;
  }

  // Floating emojis from bottom to top
  function floatEmojis({ emojis = ["🎉", "✨", "🥳", "💫"], count = 12 } = {}) {
    const created = [];
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < count; i++) {
      const el = createEl("div", { class: "emoji-floating" });
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const startX = Math.random() * w;
      const delay = Math.random() * 900;
      el.style.left = `${startX}px`;
      el.style.bottom = `-30px`;
      el.style.opacity = "0";
      document.body.appendChild(el);
      created.push(el);

      const life = 2400 + Math.random() * 1600;
      const drift = (Math.random() - 0.5) * 120;

      const start = performance.now() + delay;
      function frame(now) {
        const t = now - start;
        if (t < 0) {
          requestAnimationFrame(frame);
          return;
        }
        if (t > life) {
          el.style.opacity = "0";
          setTimeout(() => {
            if (el.parentElement) el.parentElement.removeChild(el);
          }, 400);
          return;
        }
        // progress 0..1
        const p = t / life;
        const px = startX + drift * p;
        const py = -30 + (h + 60) * p; // move up
        el.style.transform = `translate(${px - startX}px, -${py}px)`;
        el.style.opacity = `${0.8 - p * 0.8}`;
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    return created;
  }

  // Countdown that returns a Promise resolved when finished
  function startCountdown({
    from = 3,
    overlayId = "celebration-overlay",
  } = {}) {
    ensureStyles();
    return new Promise((resolve) => {
      // overlay
      const overlay = createEl("div", {
        class: "celebration-overlay",
        id: overlayId,
      });
      const countEl = createEl(
        "div",
        { class: "celebration-count", id: "celebration-count" },
        overlay
      );
      let current = from;

      function showNumber(n) {
        countEl.textContent = n > 0 ? n : "Go!";
        // small scale pop animation via transform (inline)
        countEl.style.transform = "scale(0.8)";
        countEl.style.transition =
          "transform 220ms cubic-bezier(.2,.9,.3,1), opacity 120ms";
        void countEl.offsetWidth;
        countEl.style.transform = "scale(1)";
      }

      showNumber(current);
      const interval = setInterval(() => {
        current--;
        if (current >= 0) {
          showNumber(current);
        }
        if (current < 0) {
          clearInterval(interval);
          // remove overlay after brief pause
          setTimeout(() => {
            if (overlay.parentElement)
              overlay.parentElement.removeChild(overlay);
            resolve();
          }, 450);
        }
      }, 1000);
    });
  }

  // Main sequence: countdown -> theme -> confetti + emojis
  async function startCelebration({ countdownFrom = 3 } = {}) {
    ensureStyles();
    const palette = pickPalette();
    await startCountdown({ from: countdownFrom });
    applyTheme(palette);
    // launch visuals
    // origin near center
    const originX = 0.5;
    launchConfetti({ count: 90, originX });
    floatEmojis({ count: 16 });
  }

  // Initialize: create a button (if not present) or attach to an existing button id
  function initCelebration(buttonId = "start-celebration-btn") {
    ensureStyles();
    let btn = document.getElementById(buttonId);
    if (!btn) {
      // create a small fixed button at bottom-right
      btn = createEl("button", {
        id: buttonId,
        class: "btn celebration-trigger",
        text: "Start Celebration",
      });
      // minimal inline style so it's visible without CSS edits
      btn.style.position = "fixed";
      btn.style.right = "18px";
      btn.style.bottom = "18px";
      btn.style.zIndex = "9999";
      btn.style.padding = "0.6rem 0.9rem";
      btn.style.borderRadius = "10px";
      btn.style.background = "linear-gradient(90deg,#ff7a7a,#8e6bff)";
      btn.style.color = "#fff";
      btn.style.border = "none";
      btn.style.cursor = "pointer";
      btn.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
      btn.style.fontWeight = "700";
    }
    btn.addEventListener("click", () => startCelebration({ countdownFrom: 3 }));
    return btn;
  }

  // Expose API
  const api = {
    startCelebration,
    startCountdown,
    pickPalette,
    applyTheme,
    initCelebration,
  };

  if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = api;
  } else {
    global.Celebration = api;
    // auto-init once DOM loaded
    document.addEventListener("DOMContentLoaded", () => {
      initCelebration("start-celebration-btn");
    });
  }
})(typeof window !== "undefined" ? window : this);
