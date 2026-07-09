/**
 * Copy-to-clipboard buttons.
 * Buttons are wired via data-target="<id>" (see markup below) and
 * icon swap handled entirely here — no inline onclick needed.
 */

const CLIPBOARD_ICON = `<svg viewBox="0 0 24 24"><path d="M16 1H8C6.9 1 6 1.9 6 3v2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-2h2c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2h-4zm0 18H4V7h2v10c0 1.1.9 2 2 2h8v0zm4-4H8V3h12v12z"/></svg>`;
const CHECK_ICON = `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
const RESET_DELAY = 1500;

/**
 * Copies the contents of an element to the clipboard and gives the
 * button temporary visual feedback (check mark or error).
 *
 * @param {string} id - id of the element whose text should be copied
 * @param {HTMLButtonElement} button - the button that triggered the copy
 */
async function copyText(id, button) {
    const element = document.getElementById(id);
    if (!element || !button) return;

    // Cancel any pending reset from a previous click so rapid
    // re-clicks don't race each other and leave a stale icon.
    clearTimeout(button._resetTimer);

    let succeeded = true;
    try {
        await navigator.clipboard.writeText(element.textContent.trim());
    } catch (error) {
        console.error("Copy failed:", error);
        succeeded = false;
    }

    button.innerHTML = succeeded ? CHECK_ICON : "✖";
    button.classList.add("copied");

    button._resetTimer = setTimeout(() => {
        button.innerHTML = CLIPBOARD_ICON;
        button.classList.remove("copied");
    }, RESET_DELAY);
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".copyButton").forEach((button) => {
        button.innerHTML = CLIPBOARD_ICON;
        button.addEventListener("click", () => {
            const target = button.dataset.target;
            if (target) copyText(target, button);
        });
        // No keydown handler needed: native <button> elements already
        // fire a click event on Enter/Space.
    });
});