// intro-typing.js
// A self-contained intro loader with typing simulator effect.
// Runs automatically when the page loads.

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    createIntroLoader();
  });

  // Create overlay with typing animation
  function createIntroLoader() {
    const overlay = document.createElement("div");
    overlay.id = "intro-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      background: "linear-gradient(135deg, #004aad, #0078ff)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Poppins', sans-serif",
      fontSize: "1.5rem",
      zIndex: "9999",
      flexDirection: "column",
      transition: "opacity 0.8s ease",
    });

    const textEl = document.createElement("div");
    textEl.id = "typing-text";
    textEl.style.borderRight = "3px solid rgba(255,255,255,0.7)";
    textEl.style.padding = "0 4px";
    textEl.style.whiteSpace = "nowrap";
    textEl.style.overflow = "hidden";
    overlay.appendChild(textEl);

    document.body.appendChild(overlay);

    const message = "Welcome to the UI Transformation Showcase...";
    typeText(textEl, message, 60).then(() => {
      // Wait, then fade out
      setTimeout(() => {
        overlay.style.opacity = "0";
        setTimeout(() => {
          overlay.remove();
        }, 800);
      }, 1000);
    });
  }

  // Typing simulator function
  function typeText(element, text, speed = 80) {
    return new Promise((resolve) => {
      let i = 0;
      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          element.style.borderRight = "none";
          resolve();
        }
      }
      type();
    });
  }

  // Export for Jest testing
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { typeText, createIntroLoader };
  }
})();
