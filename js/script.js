/**
 * Copies the contents of an element to the clipboard.
 *
 * @param {string} id - The ID of the element to copy.
 */
function copyText(id) {

    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    const text = element.textContent;

    navigator.clipboard.writeText(text)
        .then(() => {
            alert("Copied!");
        })
        .catch(() => {
            alert("Unable to copy.");
        });

}