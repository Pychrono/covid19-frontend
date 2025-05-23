/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"], // make sure this line is there
    theme: {
        extend: {
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                fadeIn: "fadeIn 1s ease-out forwards",
            },
        },
    },
    plugins: [],
};

module.exports = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: "#00020C",
                surface: "#000412",
            },
        },
    },
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    plugins: [],
};