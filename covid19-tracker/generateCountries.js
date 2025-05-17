const fs = require("fs");
const fetch = (...args) =>
    import ("node-fetch").then(({ default: fetch }) => fetch(...args));


async function generateCountryList() {
    try {
        const res = await fetch("https://disease.sh/v3/covid-19/countries");
        const countries = await res.json();

        const names = countries.map(c => c.country).sort();
        fs.writeFileSync("./src/data/countriesList.json", JSON.stringify(names, null, 2));
        console.log("✅ countriesList.json generated successfully!");
    } catch (err) {
        console.error("❌ Failed to fetch or write countries list:", err);
    }
}

generateCountryList();