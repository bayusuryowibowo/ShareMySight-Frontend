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
                "dark-purple": "#303866",
                "pale-purple": "#DEE1FA",
                "pink-purple": "#F0E4F9",
                lavender: "#AE8BC0",
                "grey-purple": "#B6BAD8",
                "midnight-blue": "#545CA0",
                periwinkle: "#CDD0E8",
            },
            flexGrow: {
                3: "3",
                4: "4",
            },
            boxShadow: {
                custom: "3px 0 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                card: "0 2px 2px 0 rgba(0, 0, 0, 0.2)",
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
