import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import { defineConfig } from "astro/config";
import robotsTxt from "astro-robots-txt";
import dotenv from "dotenv";

dotenv.config();

import partytown from "@astrojs/partytown";
import playformCompress from "@playform/compress";
import { fontProviders } from "astro/config";
import icon from "astro-icon";
import { remarkReadingTime } from "./remark-reading-time.mjs";

export default defineConfig({
	site: "https://www.rafay99.com",
	output: "server",
	image: {
		remotePatterns: [{ protocol: "https", hostname: "7huqjqx8yo.ufs.sh" }],
	},
	build: {
		concurrency: 10,
		format: "directory",
	},
	fonts: [
		{
			name: "Poppins",
			cssVariable: "--font-poppins",
			provider: fontProviders.google(),
		},
	],
	prefetch: {
		prefetchAll: false,
	},
	experimental: {
		queuedRendering: {
			enabled: true,
			poolSize: 3000,
		},
	},
	markdown: {
		syntaxHighlight: {
			excludeLangs: ["mermaid"],
		},
		remarkPlugins: [remarkReadingTime],
		gfm: true,

		shikiConfig: {
			theme: "tokyo-night",
			defaultColor: false,
			langAlias: {
				cjs: "javascript",
			},
			wrap: false,
			transformers: [],
		},
	},

	redirects: {
		"/snaprescue.sh": "/downloads/scripts/snaprescue.sh",
		"/MSBridge": "https://msbridge.rafay99.com",
		"/Meaning-Mate-APK": "/downloads/app/meaning_mate/Meaning-Mate-APK.apk",
		"/MSBridge-APK":
			"https://msbridge.rafay99.com/downloads/ms-bridge-stable.apk",
		"/MSBridge-beta":
			"https://msbridge.rafay99.com/downloads/ms-bridge-beta.apk",
		"/SimpleThread-APK": "/downloads/app/SimpleThread/simple_thread.apk",
		"/MeetTime-APK": "/downloads/app/meet_time/MeetTime.apk",
		"/webwiki": "https://rafay99-docs.vercel.app/",
	},

	security: {
		checkOrigin: true,
	},
	integrations: [
		partytown({
			config: {
				forward: ["dataLayer.push"],
			},
		}),
		mdx({}),
		sitemap({}),
		react({
			experimentalDisableStreaming: true,

			include: ["**/ReactComponent/**", "**/*.{jsx,tsx}"],
			babel: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
		tailwind(),
		robotsTxt({
			sitemap: true,
			host: "www.rafay99.com",
		}),
		playformCompress({
			CSS: true,
			HTML: {
				"html-minifier-terser": {
					removeAttributeQuotes: false,
					collapseWhitespace: true,
					removeComments: true,
				},
			},
			Image: {
				quality: 80,
				avif: {
					quality: 80,
					effort: 7,
				},
				webp: {
					quality: 80,
					effort: 5,
				},
			},
			JavaScript: false,
			SVG: false,
			Logger: 2,
		}),
		icon(),
	],
	adapter: vercel({
		webAnalytics: {
			enabled: true,
		},
		speedInsights: {
			enabled: true,
		},
		maxDuration: 3,
		imageService: true,
		isr: true,
	}),
	vite: {
		build: {
			cssMinify: true,
			chunkSizeWarningLimit: 2500,
			rollupOptions: {
				onwarn(warning, warn) {
					if (
						warning.code === "EMPTY_BUNDLE" ||
						warning.code === "CIRCULAR_DEPENDENCY" ||
						warning.message?.includes("Generated an empty chunk") ||
						warning.message?.includes("Circular chunk")
					) {
						return;
					}
					warn(warning);
				},
				output: {
					experimentalMinChunkSize: 30000,
					manualChunks(id) {
						if (!id.includes("node_modules")) return;
						if (id.includes("d3-")) return "vendor-d3";
						if (id.includes("@chevrotain") || id.includes("langium"))
							return "vendor-parser";
						if (
							id.includes("cytoscape") ||
							id.includes("dagre-d3-es") ||
							id.includes("dagre")
						)
							return "vendor-graph";
						if (id.includes("mermaid")) return "vendor-mermaid";
						if (id.includes("katex")) return "vendor-katex";
						if (id.includes("framer-motion")) return "vendor-framer";
						if (id.includes("lucide-react")) return "vendor-lucide";
						if (
							id.includes("/react/") ||
							id.includes("/react-dom/") ||
							id.includes("/scheduler/")
						)
							return "react-vendor";
					},
				},
			},
		},
		ssr: {
			noExternal: ["@astrojs/*"],
		},
		optimizeDeps: {
			exclude: ["@astrojs/image", "sharp"],
		},
		resolve: {
			dedupe: ["react", "react-dom"],
			alias: {
				"@assets": "/src/assets",
				"@components": "/src/components",
				"@astro": "/src/components/AstroComponent",
				"@react": "/src/components/ReactComponent",
				"@content": "/src/content",
				"@layouts": "/src/layouts",
				"@pages": "/src/pages",
				"@styles": "/src/styles",
				"@types": "/src/types",
				"@util": "/src/util",
				"@config": "/src/config",
				"@server": "/src/server",
				"@hooks": "/src/hooks",
				"@package.json": "/package.json",
			},
		},
	},
});
