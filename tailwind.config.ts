/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                lightGreen: "rgb(23,166,28)",
                darkGreen: "rgb(2,17,24)",

                lightPurple: "rgba(94, 23, 235, 0.6)",
                darkPurple: "rgba(94, 23, 235, 1)",

                pinky: "rgb(206,77,187)",
            },
        },
    },
    plugins: [],
}
