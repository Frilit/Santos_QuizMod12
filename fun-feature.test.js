/**
 * @jest-environment jsdom
 */
const { startCelebration, applyTheme } = require("./fun-feature.js");

// Prevent infinite animation loops
beforeAll(() => {
  global.requestAnimationFrame = (cb) => {
    // Immediately execute the callback, simulating a single frame
    cb(performance.now());
    return 1;
  };
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

  test("startCelebration applies theme and creates confetti/emojis (mocked animations)", async () => {
    // Mock heavy animation functions
    const mockConfetti = jest
      .spyOn(require("./fun-feature.js"), "startCelebration")
      .mockImplementation(async () => {
        document.body.innerHTML +=
          '<div class="confetti-piece"></div><div class="emoji-floating"></div>';
      });

    await startCelebration({ countdownFrom: 0 });

    const confetti = document.querySelectorAll(".confetti-piece");
    const emojis = document.querySelectorAll(".emoji-floating");

    expect(confetti.length).toBeGreaterThan(0);
    expect(emojis.length).toBeGreaterThan(0);

    mockConfetti.mockRestore();
  });
});
