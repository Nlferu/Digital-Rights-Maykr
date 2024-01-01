/** @type {import('tailwindcss').Config} */

import plugin from "tailwindcss/plugin"

const Myclass = plugin(function ({ addUtilities }) {
    addUtilities({
        ".my-rotate-y-180": {
            transform: "rotateY(180deg)",
        },
    })
})

module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "linear-gradient": "linear-gradient(0, #5ddcff 10%, #3c67e3 40%, #ce4dbb)",
                "linear-light": "linear-gradient(0, #5ddcff 0%, #3c67e3 10%, #ce4dbb)",
                "linear-black": "linear-gradient(0, #000000 30%, #a4a4a4 250%, #ffffff)",
                slider: "linear-gradient(316deg, #3e187a 0%, #994ecc 74%)",
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
                dark: "4px 4px 15px 10px rgba(0, 0, 0, 1)",
                cert: "0px 0px 15px 5px #5acdf1",
            },
            dropShadow: {
                shady: "5px 5px 3px rgba(0, 0, 0, 0.9)",
                cert: "13px 13px 3px #5acdf1",
            },
            colors: {
                lightGreen: "rgb(23,166,28)",
                darkGreen: "rgb(2,17,24)",

                lightB: "#5ddcff",
                darkB: "#3c67e3",

                pinky: "rgb(206,77,187)",
                devil: "rgba(12, 9, 9, 1)",
                dev: "rgb(12, 9, 9)",
                tblack: "rgba(0, 0, 0, 0.75)",
                impale: "rgba(12, 9, 9, 0.6)",
                hpale: "rgba(12, 9, 9, 0.35)",
                certL: "rgb(221 214 254)",
                certH: "#8a2cb2",
                rami: "rgba(47, 21, 71, 1)",
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
                delayedSpin: "fullSpin 6s linear infinite 1500ms",
            },
        },
    },
    plugins: [Myclass],
}
