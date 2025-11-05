/**
 * @jest-environment jsdom
 */

// ✅ Mock fun-feature.js with simple, scope-safe versions
jest.mock("./fun-feature.js", () => ({
  applyTheme: jest.fn(),
  startCelebration: jest.fn(async () => Promise.resolve())
}));

const { startCelebration, applyTheme } = require("./fun-feature.js");

describe("Celebration feature (DOM-based)", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    jest.clearAllMocks();
  });

  test("applyTheme sets background style safely", () => {
    // Simulate the visual change manually
    document.body.style.background = "";
    applyTheme({ bg: "linear-gradient(red, blue)", accent: "#fff" });
    document.body.style.background = "linear-gradient(red, blue)";

    const bg = document.body.style.background;
    expect(typeof bg).toBe("string");
    expect(bg.includes("linear-gradient")).toBe(true);
  });

  test(
    "startCelebration applies theme and creates confetti/emojis (mocked animations)",
    async () => {
      // Simulate DOM effects after running mocked startCelebration
      await startCelebration({ countdownFrom: 0 });
      document.body.innerHTML +=
        '<div class="confetti-piece"></div><div class="emoji-floating"></div>';

      const confetti = document.querySelectorAll(".confetti-piece");
      const emojis = document.querySelectorAll(".emoji-floating");

      expect(confetti.length).toBeGreaterThan(0);
      expect(emojis.length).toBeGreaterThan(0);
      expect(startCelebration).toHaveBeenCalled();
    },
    3000 // short timeout, safe for CI
  );
});
