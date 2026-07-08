/**
 * Copies the contents of an element to the clipboard.
 *
 * @param {string} id
 * @param {HTMLButtonElement} button
 */
async function copyText(id, button) {

    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    const clipboardIcon = `
        <svg viewBox="0 0 24 24">
            <path d="M16 1H8C6.9 1 6 1.9 6 3v2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-2h2c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2h-4zm0 18H4V7h2v10c0 1.1.9 2 2 2h8v0zm4-4H8V3h12v12z"/>
        </svg>
    `;

    const checkIcon = `
        <svg viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
    `;

    try {

        await navigator.clipboard.writeText(element.textContent.trim());

        button.innerHTML = checkIcon;
        button.classList.add("copied");

        setTimeout(() => {
            button.innerHTML = clipboardIcon;
            button.classList.remove("copied");
        }, 1500);

    } catch (error) {

        console.error(error);

        button.innerHTML = "✖";
        button.classList.add("copied");

        setTimeout(() => {
            button.innerHTML = clipboardIcon;
            button.classList.remove("copied");
        }, 1500);

    }

}

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.copyButton');

    buttons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const target = btn.getAttribute('data-target');
            if (target) {
                copyText(target, btn);
            }
        });
        // allow Enter/Space to trigger the button when focused
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
});