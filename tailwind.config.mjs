import { colors, generateTailwindColors } from "./src/config/theme/colors.ts";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Geist Variable", "system-ui", "sans-serif"],
				mono: ["Geist Mono Variable", "ui-monospace", "monospace"],
				display: [
					"Bricolage Grotesque Variable",
					"Geist Variable",
					"sans-serif",
				],
				serif: ["Instrument Serif", "Georgia", "serif"],
			},
			colors: {
				...generateTailwindColors(colors),
				accent: {
					DEFAULT: "#7aa2f7",
					dark: "#1f2335",
				},
			},
			animation: {
				fadeSlideIn: "fadeSlideIn 0.8s ease-out forwards",
			},
			screens: {
				mobile: {
					max: "767px",
				},
			},
			maxWidth: {
				"7.5xl": "85rem",
			},
			keyframes: {
				fadeSlideIn: {
					"0%": {
						opacity: "0",
						transform: "translateY(20px)",
					},
					"100%": {
						opacity: "1",
						transform: "translateY(0)",
					},
				},
			},
			boxShadow: {
				custom:
					"0 2px 6px rgba(76, 80, 106, 0.25), 0 8px 24px rgba(76, 80, 106, 0.33)",
			},
		},
	},
};
