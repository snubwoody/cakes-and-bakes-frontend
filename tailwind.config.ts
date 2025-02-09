import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}",],
	theme: {
		extend: {
			colors: {
				"primary": {
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
				}
			},
		},
	},
	plugins: [],
} satisfies Config;
