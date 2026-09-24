import { readFileSync } from "node:fs";

const HOST = "www.rafay99.com";
const KEY = "ddcf61e7a5b03b2785cb7274c52a03c7";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = "dist/client/sitemap-0.xml";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_AGE_DAYS = 14;
const MAX_URLS = 10_000;
const REQUEST_TIMEOUT_MS = 10_000;

function recentUrlsFromSitemap(xml) {
	const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
	const urls = [];
	const re =
		/<url>\s*<loc>([^<]+)<\/loc>(?:[\s\S]*?<lastmod>([^<]+)<\/lastmod>)?[\s\S]*?<\/url>/g;
	let match = re.exec(xml);
	while (match !== null) {
		const [, loc, lastmod] = match;
		if (lastmod) {
			const ts = new Date(lastmod).getTime();
			if (!Number.isNaN(ts) && ts >= cutoff) urls.push(loc);
		}
		match = re.exec(xml);
	}
	return urls.slice(0, MAX_URLS);
}

async function main() {
	if (process.env.VERCEL_ENV !== "production") {
		console.log(
			`[indexnow] skipping (VERCEL_ENV=${process.env.VERCEL_ENV ?? "unset"})`,
		);
		return;
	}

	let xml;
	try {
		xml = readFileSync(SITEMAP_PATH, "utf8");
	} catch {
		console.log(`[indexnow] no sitemap at ${SITEMAP_PATH}, skipping`);
		return;
	}

	const urlList = recentUrlsFromSitemap(xml);
	if (urlList.length === 0) {
		console.log("[indexnow] no URLs updated in the last 14 days, skipping");
		return;
	}

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
	const res = await fetch(ENDPOINT, {
		method: "POST",
		headers: { "Content-Type": "application/json; charset=utf-8" },
		signal: controller.signal,
		body: JSON.stringify({
			host: HOST,
			key: KEY,
			keyLocation: KEY_LOCATION,
			urlList,
		}),
	}).finally(() => clearTimeout(timeout));
	console.log(
		`[indexnow] submitted ${urlList.length} URL(s) -> HTTP ${res.status}`,
	);
}

main()
	.catch((err) => {
		console.log("[indexnow] error (ignored):", err?.message ?? err);
	})
	.finally(() => process.exit(0));
