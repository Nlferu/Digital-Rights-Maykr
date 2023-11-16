/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "linear-gradient": "linear-gradient(0, #5ddcff 10%, #3c67e3 40%, #ce4dbb)",
            },
            transitionTimingFunction: {
                customBezier: "cubic-bezier(0.4,2.1,0.7,1)",
                customImgBezier: "cubic-bezier(0, 0, 1, 1)",
            },
            transitionDuration: {
                custom: "0.3s",
            },
            boxShadow: {
                sun: "0px 0px 5px rgba(253, 186, 116, 0.8)",
            },
            colors: {
                lightGreen: "rgb(23,166,28)",
                darkGreen: "rgb(2,17,24)",

                lightPurple: "rgba(94, 23, 235, 0.6)",
                darkPurple: "rgba(94, 23, 235, 1)",

                pinky: "rgb(206,77,187)",
                devil: "#0c0909",
                tblack: "rgba(0, 0, 0, 0.75)",
                cosm: "linear-gradient(0, #5ddcff 10%, #3c67e3 40%, #ce4dbb)",
            },
            keyframes: {
                fullSpin: {
                    "100%": {
                        transform: "rotate(360deg)",
                    },
                },
            },
            animation: {
                fullSpin: "fullSpin 3s linear infinite",
                delayedSpin: "fullSpin 3s linear infinite 1500ms",
            },
        },
    },
    plugins: [],
}
