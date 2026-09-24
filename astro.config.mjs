import { readdirSync, readFileSync } from "node:fs";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import playformCompress from "@playform/compress";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import mermaid from "astro-mermaid";
import robotsTxt from "astro-robots-txt";
import { load as loadYaml } from "js-yaml";
import { remarkReadingTime } from "./remark-reading-time.mjs";

function buildBlogLastmod() {
	const dir = new URL("./src/content/blog/", import.meta.url);
	const map = new Map();
	let files = [];
	try {
		files = readdirSync(dir);
	} catch {
		return map;
	}
	for (const file of files) {
		if (!/\.(md|mdx)$/.test(file)) continue;
		let raw;
		try {
			raw = readFileSync(new URL(file, dir), "utf8");
		} catch {
			continue;
		}
		const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
		if (!fm) continue;
		let data;
		try {
			data = loadYaml(fm[1]) ?? {};
		} catch {
			continue;
		}
		if (data.draft || data.archived) continue;
		const date = data.updatedDate ?? data.pubDate;
		if (!date) continue;
		const ts = new Date(date).getTime();
		if (Number.isNaN(ts)) continue;
		const id =
			typeof data.slug === "string" && data.slug
				? data.slug
				: file.replace(/\.(md|mdx)$/, "");
		map.set(`/blog/${id}/`, new Date(ts).toISOString());
	}
	return map;
}
const blogLastmod = buildBlogLastmod();

function tagReactIslands() {
	const reactModule = /\/src\/components\/.+\.(tsx|jsx)$/;
	return {
		name: "tag-react-islands",
		enforce: "post",
		transform(code, id) {
			if (this.environment?.config.consumer !== "server") return;
			if (!reactModule.test(id) || !/export default|as default/.test(code)) {
				return;
			}
			return `${code}
import * as __self from ${JSON.stringify(id)};
{
	const c = __self.default;
	if (c && (typeof c === "function" || typeof c === "object")) {
		c[Symbol.for("astro:renderer")] = "@astrojs/react";
	}
}
`;
		},
	};
}

export default defineConfig({
	site: "https://www.rafay99.com",
	trailingSlash: "always",
	output: "server",
	image: {
		remotePatterns: [
			{ protocol: "https", hostname: "7huqjqx8yo.ufs.sh" },
			{ protocol: "https", hostname: "utfs.io" },
		],
	},
	build: {
		concurrency: 50,
		format: "directory",
	},
	prefetch: {
		prefetchAll: false,
	},
	markdown: {
		syntaxHighlight: {
			excludeLangs: ["mermaid"],
		},
		processor: unified({
			remarkPlugins: [remarkReadingTime],
		}),
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
		mermaid({
			theme: "base",
			autoTheme: false,
			mermaidConfig: {
				themeVariables: {
					primaryColor: "#7aa2f7",
					primaryTextColor: "#c0caf5",
					primaryBorderColor: "#7aa2f7",
					lineColor: "#7aa2f7",
					secondaryColor: "#bb9af7",
					tertiaryColor: "#565f89",
					background: "#1a1b26",
					mainBkg: "#24283b",
					secondaryBkg: "#414868",
					tertiaryBkg: "#565f89",
					secondaryTextColor: "#a9b1d6",
					tertiaryTextColor: "#9aa5ce",
					secondaryBorderColor: "#bb9af7",
					tertiaryBorderColor: "#565f89",
					noteBkgColor: "#24283b",
					noteTextColor: "#c0caf5",
					noteBorderColor: "#7aa2f7",
					darkMode: "true",
					fontFamily: "Geist Variable, system-ui, sans-serif",
					fontSize: "16px",
				},
				flowchart: { htmlLabels: true, curve: "basis", useMaxWidth: true },
				sequence: {
					useMaxWidth: true,
					actorFontSize: 16,
					noteFontSize: 16,
					messageFontSize: 16,
				},
			},
		}),
		mdx({}),
		sitemap({
			filter: (page) =>
				!page.includes("/blog/archive/") &&
				!page.includes("/access-denied") &&
				!page.match(/\/(blog|tag)\/page\/\d+/),
			serialize(item) {
				const lastmod = blogLastmod.get(new URL(item.url).pathname);
				if (lastmod) item.lastmod = lastmod;
				return item;
			},
		}),
		react({
			experimentalDisableStreaming: true,
			include: ["**/ReactComponent/**", "**/*.{jsx,tsx}"],
			compiler: true,
		}),
		robotsTxt({
			sitemap: true,
			host: "www.rafay99.com",
		}),
		playformCompress({
			CSS: false,
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
		maxDuration: 3,
		imageService: false,
		isr: true,
	}),
	vite: {
		plugins: [tailwindcss(), tagReactIslands()],
		build: {
			cssMinify: true,
			chunkSizeWarningLimit: 2500,
			rolldownOptions: {
				onwarn(warning, warn) {
					if (
						(warning.code === "MODULE_LEVEL_DIRECTIVE" &&
							warning.message?.includes("astro:head-inject")) ||
						warning.code === "EMPTY_BUNDLE" ||
						warning.code === "CIRCULAR_DEPENDENCY" ||
						warning.message?.includes("Generated an empty chunk") ||
						warning.message?.includes("Circular chunk")
					) {
						return;
					}
					warn(warning);
				},
			},
		},
		ssr: {
			noExternal: ["@astrojs/*"],
		},
		optimizeDeps: {
			exclude: ["sharp"],
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
			},
		},
	},
});
