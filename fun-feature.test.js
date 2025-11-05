// fun-feature.test.js
/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

const {
  startCountdown,
  startCelebration,
  pickPalette,
  initCelebration,
} = require("./fun-feature.js");

describe("Celebration feature (DOM-based)", () => {
  beforeEach(() => {
    // reset document body and styles between tests
    document.body.innerHTML = "<div id='root'></div>";
    document.documentElement.style.cssText = "";
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("pickPalette returns a palette with bg and accent", () => {
    const p = pickPalette();
    expect(p).toHaveProperty("bg");
    expect(p).toHaveProperty("accent");
    expect(typeof p.bg).toBe("string");
    expect(typeof p.accent).toBe("string");
  });

  test("startCountdown displays numbers and resolves after sequence", async () => {
    const promise = startCountdown({ from: 2, overlayId: "test-overlay" });
    // overlay should be present immediately
    expect(document.getElementById("test-overlay")).not.toBeNull();
    // advance timers 1s -> show 1
    jest.advanceTimersByTime(1000);
    // advance another 1s -> show 0
    jest.advanceTimersByTime(1000);
    // advance another 1s -> "Go!" then removal after small delay
    jest.advanceTimersByTime(1000 + 500);
    await expect(promise).resolves.toBeUndefined();
    // overlay should be removed
    expect(document.getElementById("test-overlay")).toBeNull();
  });

  test("startCelebration applies theme and creates confetti/emojis", async () => {
    // attach a button to test init
    const btn = document.createElement("button");
    btn.id = "start-celebration-btn";
    document.body.appendChild(btn);

    // initialize (attaches click handler)
    initCelebration("start-celebration-btn");
    // simulate click
    btn.click();
    // countdown starts: overlay present
    expect(document.getElementById("celebration-overlay")).not.toBeNull();

    // fast-forward countdown (3s) + small pause
    jest.advanceTimersByTime(3500);

    // After countdown completes, the body background should have been changed
    // (theme applied via startCelebration -> applyTheme)
    // allow flash setTimeouts to run
    jest.advanceTimersByTime(1000);

    // check that body has a background style set (applied by applyTheme)
    const bg = document.body.style.background;
    expect(bg && bg.length).toBeGreaterThan(0);

    // confetti pieces and emojis are added (class names as in implementation)
    const confetti = document.querySelectorAll(".confetti-piece");
    const emojis = document.querySelectorAll(".emoji-floating");
    expect(confetti.length).toBeGreaterThan(0);
    expect(emojis.length).toBeGreaterThan(0);

    // advance enough time for them to be removed (max life ~4s)
    jest.advanceTimersByTime(6000);

    // eventually elements clean up
    expect(
      document.querySelectorAll(".confetti-piece").length
    ).toBeLessThanOrEqual(0);
    // emojis should also be gone
    expect(
      document.querySelectorAll(".emoji-floating").length
    ).toBeLessThanOrEqual(0);
  });
});
