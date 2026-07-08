async function loadPalworldSettings() {
    const list = document.querySelector(".settings-list");

    if (!list) return;

    try {
        const response = await fetch("config/PalWorldSettings.ini");
        const text = await response.text();

        const match = text.match(/OptionSettings=\(([\s\S]*)\)/);

        if (!match) {
            list.innerHTML = "<div><dt>Error</dt><dd>Settings not found.</dd></div>";
            return;
        }

        const raw = match[1];

        // Split on commas that are NOT inside quotes or parentheses
        const entries = raw.match(/(?:[^,(]|\([^)]*\))+?=(?:"[^"]*"|\([^)]*\)|[^,]+)(?=,|$)/g);

        const settings = {};

        for (const entry of entries) {
            const index = entry.indexOf("=");

            if (index === -1) continue;

            const key = entry.substring(0, index).trim();
            const value = entry.substring(index + 1).trim();

            settings[key] = value.replace(/^"|"$/g, "");
        }

        const display = {
            ServerPlayerMaxNum: "Player Limit",
            DayTimeSpeedRate: "Day Speed",
            CollectionDropRate: "Resource Drops",
            EnemyDropItemRate: "Enemy Drops",
            CollectionObjectHpRate: "Resource Health",
            WorkSpeedRate: "Work Speed",
            PalEggDefaultHatchingTime: "Egg Hatch Time",
            DeathPenalty: "Death Penalty",
            bIsPvP: "PvP",
            bEnableFriendlyFire: "Friendly Fire",
            bEnableFastTravel: "Fast Travel",
            CrossplayPlatforms: "Crossplay"
        };

        function format(key, value) {

            if (/^(true|True)$/i.test(value))
                return "Enabled";

            if (/^(false|False)$/i.test(value))
                return "Disabled";

            if (key === "DeathPenalty") {
                return {
                    None: "None",
                    Item: "Items Only",
                    ItemAndEquipment: "Items & Equipment",
                    All: "All Items"
                }[value] || value;
            }

            if (key === "CrossplayPlatforms") {
                return value
                    .replace(/[()]/g, "")
                    .split(",")
                    .join(", ");
            }

            if (key === "PalEggDefaultHatchingTime") {
                const hours = parseFloat(value);

                return hours === 0
                    ? "Instant"
                    : `${hours} Hour${hours !== 1 ? "s" : ""}`;
            }

            if (key === "SupplyDropSpan") {
                return `${value} Minutes`;
            }

            if (!isNaN(value)) {
                const num = Number(value);

                // Display all rate values as "2x", "0.5x", etc.
                if (key.endsWith("Rate")) {
                    return `${num}x`;
                }

                return Number.isInteger(num)
                    ? num.toString()
                    : num.toString();
            }

            return value;
        }

        list.innerHTML = "";

        for (const [key, label] of Object.entries(display)) {

            if (!(key in settings))
                continue;

            list.insertAdjacentHTML(
                "beforeend",
                `
                <div class="setting">
                    <dt>${label}</dt>
                    <dd>${format(key, settings[key])}</dd>
                </div>
                `
            );
        }

    } catch (err) {
        console.error(err);

        list.innerHTML =
            "<div><dt>Error</dt><dd>Unable to load server settings.</dd></div>";
    }
}

loadPalworldSettings();