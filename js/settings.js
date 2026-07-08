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
            CrossplayPlatforms: "Crossplay",

            ExpRate: "Experience Rate",
            PalCaptureRate: "Capture Rate",
            PalSpawnNumRate: "Pal Spawn Rate",

            WorkSpeedRate: "Work Speed",
            PalEggDefaultHatchingTime: "Egg Hatch Time",

            CollectionDropRate: "Resource Drops",
            CollectionObjectHpRate: "Resource Health",
            EnemyDropItemRate: "Enemy Drops",

            DayTimeSpeedRate: "Day Length",
            NightTimeSpeedRate: "Night Length",

            DeathPenalty: "Death Penalty",

            PlayerStaminaDecreaceRate: "Stamina Decrease Rate",
            PlayerDamageRateAttack: "Player Damage",
            PlayerDamageRateDefense: "Player Defense",

            bEnableFastTravel: "Fast Travel",
            bIsPvP: "PvP",
            bEnableFriendlyFire: "Friendly Fire"
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

            if (key === "DayTimeSpeedRate") {
                const dayTimes = {
                    "0.1": "270 minutes",
                    "0.2": "135 minutes",
                    "0.3": "90 minutes",
                    "0.4": "67.5 minutes",
                    "0.5": "54 minutes",
                    "0.6": "45 minutes",
                    "0.7": "38.5 minutes",
                    "0.8": "33.75 minutes",
                    "0.9": "30 minutes",
                    "1": "27 minutes",
                    "2": "13.5 minutes",
                    "3": "9 minutes",
                    "4": "6.75 minutes",
                    "5": "5.4 minutes"
                };

                return dayTimes[Number(value)] || `${value}x`;
            }

            if (key === "NightTimeSpeedRate") {
                const nightTimes = {
                    "0.1": "50 minutes",
                    "0.2": "25 minutes",
                    "0.3": "16.6 minutes",
                    "0.4": "12.5 minutes",
                    "0.5": "10 minutes",
                    "0.6": "8.3 minutes",
                    "0.7": "7.2 minutes",
                    "0.8": "6.25 minutes",
                    "0.9": "5.5 minutes",
                    "1": "5 minutes",
                    "2": "2.5 minutes",
                    "3": "1.66 minutes",
                    "4": "1.25 minutes",
                    "5": "1 minute"
                };

                return nightTimes[Number(value)] || `${value}x`;
            }

            if (!isNaN(value)) {
                const num = Number(value);

                // Display all rate values as "2x", "0.5x", etc.
                if (key.endsWith("Rate")) {
                    return `${num}x`;
                }

                if (key.endsWith("RateAttack") || key.endsWith("RateDefense")) {
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