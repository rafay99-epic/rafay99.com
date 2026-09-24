import { type CollectionEntry, getCollection } from "astro:content";
import { createHash } from "node:crypto";
import { featureFlags } from "@config/featureFlag/featureFlag.json";
import { PostSchema } from "../../../types/articles";

const errorHeaders = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "https://www.rafay99.com",
	"Cache-Control": "no-store, no-cache",
};

export async function GET() {
	try {
		if (!featureFlags.showBlog) {
			return new Response(
				JSON.stringify({ error: "Blog feature is disabled" }),
				{
					status: 403,
					headers: errorHeaders,
				},
			);
		}

		const posts = await getCollection("blog");

		const filteredPosts = posts.filter(
			(post: CollectionEntry<"blog">) =>
				!post.data.draft && !post.data.archived,
		);

		const validatedPosts = filteredPosts.map(
			(post: CollectionEntry<"blog">) => {
				try {
					return PostSchema.parse({
						id: post.id,
						collection: post.collection,
						data: post.data,
					});
				} catch (error) {
					console.error("Validation error for post:", post.id, error);
					throw error;
				}
			},
		);

		const responseBody = JSON.stringify(validatedPosts);
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
		console.error("Error fetching blog posts:", error);
		return new Response(
			JSON.stringify({ error: "Failed to fetch blog posts" }),
			{
				status: 500,
				headers: errorHeaders,
			},
		);
	}
}
