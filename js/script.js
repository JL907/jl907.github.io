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

    try {

        await navigator.clipboard.writeText(element.textContent);

        button.innerHTML = "✔ Copied";
        button.classList.add("copied");

        setTimeout(() => {
            button.innerHTML = "Copy";
            button.classList.remove("copied");
        }, 1500);

    } catch (error) {

        console.error(error);

        button.innerHTML = "❌ Failed";

        setTimeout(() => {
            button.innerHTML = "Copy";
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