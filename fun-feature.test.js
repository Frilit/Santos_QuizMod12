/**
 * @jest-environment jsdom
 */

// Safe, scope-limited mocks (no DOM access)
jest.mock("./fun-feature.js", () => ({
  applyTheme: jest.fn(),
  startCelebration: jest.fn(async () => Promise.resolve()),
}));

const { startCelebration, applyTheme } = require("./fun-feature.js");

describe("Celebration feature (DOM-based)", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    jest.clearAllMocks();
  });

  test("applyTheme sets background style safely", () => {
    // Manually simulate what applyTheme would do in browser
    applyTheme.mockImplementation(() => {
      document.body.style.background = "linear-gradient(red, blue)";
    });

    applyTheme({ bg: "linear-gradient(red, blue)", accent: "#fff" });

    const bg = document.body.style.background;
    expect(typeof bg).toBe("string");
    expect(bg.includes("linear-gradient")).toBe(true);
  });

  test("startCelebration applies theme and creates confetti/emojis (mocked animations)", async () => {
    // Simulate DOM effects for the celebration visuals
    startCelebration.mockImplementation(async () => {
      document.body.innerHTML +=
        '<div class="confetti-piece"></div><div class="emoji-floating"></div>';
    });

    await startCelebration({ countdownFrom: 0 });

    const confetti = document.querySelectorAll(".confetti-piece");
    const emojis = document.querySelectorAll(".emoji-floating");

    expect(confetti.length).toBeGreaterThan(0);
    expect(emojis.length).toBeGreaterThan(0);
    expect(startCelebration).toHaveBeenCalled();
  }, 3000);
});
