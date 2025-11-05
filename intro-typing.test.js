/**
 * @jest-environment jsdom
 */
const { typeText, createIntroLoader } = require("./intro-typing.js");

describe("Intro Typing Loader", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
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
    const promise = typeText(el, text, 20);

    jest.advanceTimersByTime(20 * text.length + 100);
    await promise;

    expect(el.textContent).toBe(text);
    expect(el.style.borderRight).toBe("none");
  });

  test("createIntroLoader adds overlay and types text", async () => {
    createIntroLoader();

    const overlay = document.getElementById("intro-overlay");
    expect(overlay).not.toBeNull();

    const typingEl = document.getElementById("typing-text");
    expect(typingEl).not.toBeNull();

    // Simulate time passing for typing + fade out
    jest.advanceTimersByTime(8000);

    expect(document.body.contains(overlay)).toBe(true);
  });
});
