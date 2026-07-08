/**
 * Attach copy functionality to every copy button.
 */

document.querySelectorAll(".copyButton").forEach(button => {

    button.addEventListener("click", () => {

        const targetId = button.dataset.copy;
        const element = document.getElementById(targetId);

        if (!element) {
            return;
        }

        navigator.clipboard.writeText(element.textContent)
            .then(() => {

                button.innerHTML = "✔";
                button.classList.add("copied");
                button.disabled = true;

                setTimeout(() => {
                    button.innerHTML = "📋 Copy";
                    button.classList.remove("copied");
                    button.disabled = false;
                }, 1500);

            })
            .catch(() => {

                button.innerHTML = "❌";

                setTimeout(() => {
                    button.innerHTML = "📋 Copy";
                }, 1500);

            });

    });

});