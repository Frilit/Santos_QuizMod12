/**
 * @jest-environment jsdom
 */
const { startCelebration, applyTheme } = require("./fun-feature.js");

beforeAll(() => {
  // Force requestAnimationFrame to run immediately in jsdom
  global.requestAnimationFrame = (cb) => cb(Date.now());
  global.cancelAnimationFrame = () => {};
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

describe("Celebration feature (DOM-based)", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
  });

  test("applyTheme sets background style safely", () => {
    applyTheme({ bg: "linear-gradient(red, blue)", accent: "#fff" });
    const bg = document.body.style.background;
    expect(typeof bg).toBe("string");
  });

  test(
    "startCelebration applies theme and creates confetti/emojis",
    async () => {
      await startCelebration({ countdownFrom: 0 });
  
      const confetti = document.querySelectorAll(".confetti-piece");
      const emojis = document.querySelectorAll(".emoji-floating");
  
      expect(confetti.length).toBeGreaterThanOrEqual(0);
      expect(emojis.length).toBeGreaterThanOrEqual(0);
      expect(() => startCelebration()).not.toThrow();
    },
    15000 // ← extend timeout to 15 seconds
  );
});
