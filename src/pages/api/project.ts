import { type CollectionEntry, getCollection } from "astro:content";
import { createHash } from "node:crypto";
import { featureFlags } from "@config/featureFlag/featureFlag.json";
import { ProjectSchema } from "../../types/ProjectTypes";

const headers = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "https://www.rafay99.com",
	"Cache-Control": "public, max-age=3600",
};

export async function GET() {
	try {
		if (!featureFlags.showProjects) {
			return new Response(
				JSON.stringify({ error: "Projects API is disabled" }),
				{
					status: 403,
					headers: headers,
				},
			);
		}

		const posts = await getCollection("projects");
		const filteredPosts = posts.filter(
			(post: CollectionEntry<"projects">) => !post.data.draft,
		);

		const validatedProjects = filteredPosts.map(
			(project: CollectionEntry<"projects">) => {
				try {
					return ProjectSchema.parse({
						id: project.id,
						data: project.data,
					});
				} catch (error) {
					console.error("Validation error for project:", project.id, error);
					throw error;
				}
			},
		);

		const responseBody = JSON.stringify(validatedProjects);
		return new Response(responseBody, {
			status: 200,
			headers: {
				...headers,
				ETag: `"${createHash("sha1").update(responseBody).digest("hex")}"`,
			},
		});
	} catch (error) {
		console.error("Error fetching Project posts:", error);
		return new Response(
			JSON.stringify({ error: "Failed to fetch project posts" }),
			{
				status: 500,
				headers: headers,
			},
		);
	}
}
