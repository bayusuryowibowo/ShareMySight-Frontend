import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                "dark-green": "#213E3A",
                peach: "#F3EDDE",
                sage: "#5E6B62",
                leaf: "#054F3E",
            },
            flexGrow: {
                3: "3",
                4: "4",
            },
            boxShadow: {
                custom: "3px 0 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            },
            keyframes: {
                scrollup: {
                    "0%": { transform: "translateY(0)" },
                    "100%": { transform: "translateY(-100vh)" },
                },
            },
            animation: {
                scrollup: "scrollup 1s forward",
            },
        },
    },
    plugins: [],
};
export default config;
