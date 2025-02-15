import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}",],
	theme: {
		extend: {
			colors: {
				primary: {
					50: "hsl(270 80% 94.1%)",
					100: "hsl(270 78.6% 89%)",
					200: "hsl(269.7 79.5% 77.1%)",
					300: "hsl(269.8 79.2% 66.1%)",
					400: "hsl(270.2 78.7% 53.9%)",
					500: "hsl(270 79.1% 43.1%)",
					600: "hsl(270.2 79.2% 33.9%)",
					700: "hsl(269.7 78.9% 26.1%)",
					800: "hsl(269.6 79.3% 17.1%)",
					900: "hsl(270 78.3% 9%)",
					950: "hsl(270 80% 3.9%)"
				},
				neutral: {
					50: "#FCFCFC", // Here to prevent things breaking
					100: "#FCFCFC",
					200: "#F7F7F7",
					300: "#F2F2F2",
					400: "#E6E6E6",
					500: "#B3B3B3",
					600: "#808080",
					700: "#4D4D4D",
					800: "#333333",
					900: "#191919",
				}
			},
		},
	},
	plugins: [],
} satisfies Config;
