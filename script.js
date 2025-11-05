// Enhanced UI interaction script
// Adds a dynamic theme + layout switch effect when clicking the demo button.

console.log("Welcome to the Bad UI Showcase – with theme transformation!");

// Function to show a message and trigger theme toggle
function showMessage() {
  alert("Watch as the website transforms its look!");

  // Toggle between themes
  toggleThemeLayout();
}

// Theme states
let isDefaultTheme = true;

// Function to toggle between two UI layouts/themes
function toggleThemeLayout() {
  const body = document.body;
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  const main = document.querySelector("main");

  // Smooth transition for colors and layout changes
  document.documentElement.style.transition = "all 0.6s ease";
  body.style.transition = "background 0.6s ease, color 0.6s ease";

  if (isDefaultTheme) {
    // Switch to dark vibrant theme
    body.style.background =
      "linear-gradient(180deg, #0f2027, #203a43, #2c5364)";
    body.style.color = "#f4f4f4";

    if (header && footer) {
      header.style.background = "linear-gradient(135deg, #232526, #414345)";
      footer.style.background = "linear-gradient(135deg, #414345, #232526)";
    }

    if (main) {
      main.style.transform = "rotateY(5deg) scale(1.02)";
      main.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.25)";
      main.style.transition = "transform 0.8s ease, box-shadow 0.8s ease";
    }

    // Add glowing borders to sections
    document.querySelectorAll(".explanation, .image-section").forEach((el) => {
      el.style.border = "2px solid rgba(255,255,255,0.2)";
      el.style.borderRadius = "12px";
      el.style.boxShadow = "0 0 16px rgba(255, 255, 255, 0.15)";
      el.style.transition = "all 0.8s ease";
    });

    // Add small floating sparkles effect
    addSparkles();

    isDefaultTheme = false;
  } else {
    // Revert to light clean theme
    body.style.background = "linear-gradient(180deg, #f7fbff, #ffffff)";
    body.style.color = "#222";

    if (header && footer) {
      header.style.background = "linear-gradient(135deg, #004aad, #0078ff)";
      footer.style.background = "#004aad";
    }

    if (main) {
      main.style.transform = "none";
      main.style.boxShadow = "none";
    }

    document.querySelectorAll(".explanation, .image-section").forEach((el) => {
      el.style.border = "none";
      el.style.boxShadow = "none";
    });

    removeSparkles();
    isDefaultTheme = true;
  }
}

// Adds floating sparkle elements for fun visual effect
function addSparkles() {
  const sparkleContainer = document.createElement("div");
  sparkleContainer.id = "sparkle-container";
  sparkleContainer.style.position = "fixed";
  sparkleContainer.style.inset = "0";
  sparkleContainer.style.pointerEvents = "none";
  sparkleContainer.style.overflow = "hidden";
  document.body.appendChild(sparkleContainer);

  for (let i = 0; i < 25; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.textContent = "✨";
    sparkle.style.position = "absolute";
    sparkle.style.fontSize = `${Math.random() * 18 + 12}px`;
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.opacity = Math.random().toFixed(2);
    sparkle.style.animation = `floatSparkle ${
      2 + Math.random() * 3
    }s linear infinite`;
    sparkleContainer.appendChild(sparkle);
  }

  // Add sparkle animation styles dynamically
  const style = document.createElement("style");
  style.textContent = `
    @keyframes floatSparkle {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
      100% { transform: translateY(0) rotate(360deg); opacity: 1; }
    }
  `;
  style.id = "sparkle-style";
  document.head.appendChild(style);
}

// Removes sparkles when switching back to default
function removeSparkles() {
  const sparkles = document.getElementById("sparkle-container");
  const style = document.getElementById("sparkle-style");
  if (sparkles) sparkles.remove();
  if (style) style.remove();
}

// Initialize button
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("show-btn");
  if (btn) {
    btn.addEventListener("click", showMessage);
  }
});
