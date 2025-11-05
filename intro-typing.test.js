/**
 * @jest-environment jsdom
 */
const { typeText, createIntroLoader } = require("./intro-typing.js");

describe("Intro Typing Loader", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("typeText types out text character by character", async () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    const text = "Hello!";
    const promise = typeText(el, text, 10);

    jest.advanceTimersByTime(10 * text.length + 100);
    await promise;

    expect(el.textContent).toBe(text);
    // jsdom may leave borderRight as "" even if set to "none"
    expect(el.style.borderRight === "none" || el.style.borderRight === "").toBe(
      true
    );
  });

  test("createIntroLoader adds overlay and types text", async () => {
    createIntroLoader();

    const overlay = document.getElementById("intro-overlay");
    expect(overlay).not.toBeNull();

    const typingEl = document.getElementById("typing-text");
    expect(typingEl).not.toBeNull();

    jest.advanceTimersByTime(5000);
    expect(document.body.contains(overlay)).toBe(true);
  });
});
