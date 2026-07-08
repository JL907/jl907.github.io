/**
 * Copies the contents of an element to the clipboard.
 *
 * @param {string} id
 * @param {HTMLButtonElement} button
 */
async function copyText(id, button) {
    const element = document.getElementById(id);

    if (!element || !button) return;

    const text = element.textContent.trim();
    if (!text) return;

    if (button.disabled) return;
    button.disabled = true;

    const original = button.dataset.origText || button.innerHTML;
    button.dataset.origText = original;

    const live = document.getElementById('copy-live');

    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'absolute';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            const ok = document.execCommand('copy');
            document.body.removeChild(ta);
            if (!ok) throw new Error('execCommand copy failed');
        }

        button.innerHTML = '✔ Copied';
        button.classList.add('copied');
        if (live) live.textContent = 'Copied to clipboard';

        setTimeout(() => {
            button.innerHTML = original;
            button.classList.remove('copied');
            button.disabled = false;
            if (live) live.textContent = '';
        }, 1400);

        button.focus();

    } catch (err) {
        console.error(err);
        button.innerHTML = '❌ Failed';
        if (live) live.textContent = 'Copy failed';
        setTimeout(() => {
            button.innerHTML = original;
            button.disabled = false;
            if (live) live.textContent = '';
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