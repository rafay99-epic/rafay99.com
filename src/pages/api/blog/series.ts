import { getCollection } from "astro:content";
import { createHash } from "node:crypto";
import { featureFlags } from "@config/featureFlag/featureFlag.json";
import { getAllSeriesMeta, getSeriesPosts, groupBySeries } from "@util/series";
import { SeriesMetaSchema } from "../../../types/series";

const errorHeaders = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "https://www.rafay99.com",
	"Cache-Control": "no-store, no-cache",
};

export async function GET() {
	try {
		if (!featureFlags.showBlog || !featureFlags.showSeries) {
			return new Response(
				JSON.stringify({ error: "Series feature is disabled" }),
				{ status: 403, headers: errorHeaders },
			);
		}

		const allPosts = await getCollection("blog");
		const metas = getAllSeriesMeta(allPosts);

		const validatedMetas = metas.map((meta) => {
			try {
				return SeriesMetaSchema.parse(meta);
			} catch (error) {
				console.error("Validation error for series:", meta.slug, error);
				throw error;
			}
		});

		const seriesPosts = getSeriesPosts(allPosts);
		const grouped = groupBySeries(seriesPosts);

		const response = validatedMetas.map((meta) => {
			const posts = grouped.get(meta.slug) ?? [];
			return {
				...meta,
				latestDate: meta.latestDate.toISOString(),
				posts: posts.map((p) => ({
					id: p.id,
					title: p.data.title,
					part: p.data.seriesPart,
					pubDate: p.data.pubDate.toISOString(),
					url: `/blog/${p.id}`,
				})),
			};
		});

		const responseBody = JSON.stringify(response);
		const successHeaders = {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "https://www.rafay99.com",
			"Cache-Control": "public, max-age=3600",
			ETag: `"${createHash("sha1").update(responseBody).digest("hex")}"`,
		};

		return new Response(responseBody, {
			status: 200,
			headers: successHeaders,
		});
	} catch (error) {
		console.error("Error fetching series data:", error);
		return new Response(
			JSON.stringify({ error: "Failed to fetch series data" }),
			{ status: 500, headers: errorHeaders },
		);
	}
}
