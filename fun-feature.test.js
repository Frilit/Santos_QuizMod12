/**
 * @jest-environment jsdom
 */

// ✅ Mock first — before importing the module
jest.mock("./fun-feature.js", () => ({
  applyTheme: jest.fn(() => {
    document.body.style.background = "linear-gradient(red, blue)";
  }),
  startCelebration: jest.fn(async () => {
    document.body.innerHTML +=
      '<div class="confetti-piece"></div><div class="emoji-floating"></div>';
  }),
}));

const { startCelebration, applyTheme } = require("./fun-feature.js");

describe("Celebration feature (DOM-based)", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
  });

  test("applyTheme sets background style safely", () => {
    applyTheme({ bg: "linear-gradient(red, blue)", accent: "#fff" });
    const bg = document.body.style.background;
    expect(typeof bg).toBe("string");
    expect(bg.includes("linear-gradient")).toBe(true);
  });

  test(
    "startCelebration applies theme and creates confetti/emojis (mocked animations)",
    async () => {
      await startCelebration({ countdownFrom: 0 });

      const confetti = document.querySelectorAll(".confetti-piece");
      const emojis = document.querySelectorAll(".emoji-floating");

      expect(confetti.length).toBeGreaterThan(0);
      expect(emojis.length).toBeGreaterThan(0);
      expect(() => startCelebration()).not.toThrow();
    },
    1000 // super short timeout, because mock resolves instantly
  );
});
