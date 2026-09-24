import { type CollectionEntry, getCollection } from "astro:content";
import authorConfig from "@config/siteConfig/info.json";
import type { APIRoute } from "astro";

const cleanContent = (content: string): string => {
	let cleaned = content;

	cleaned = cleaned.replace(/^---\n[\s\S]*?\n---/, "");

	cleaned = cleaned.replace(/import\s+.*\s+from\s+['"].*['"];?\s*/g, "");

	cleaned = cleaned.replace(/<\w+\s+[^>]*\/>/g, "");
	cleaned = cleaned.replace(/<\/?[A-Z]\w*[^>]*>/g, "");

	cleaned = cleaned.replace(/\/\/\s*@noErrors/g, "");
	cleaned = cleaned.replace(/\/\/\s*@\w+.*$/gm, "");

	cleaned = cleaned.replace(/export\s+.*$/gm, "");

	cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

	return cleaned.trim();
};

export const GET: APIRoute = async ({ site }) => {
	try {
		const siteUrl = site?.href ?? "https://www.rafay99.com";

		const posts = (await getCollection("blog")).filter(
			(post: CollectionEntry<"blog">) =>
				!post.data.draft && !post.data.archived,
		);
		const sortedPosts = posts.sort(
			(a: CollectionEntry<"blog">, b: CollectionEntry<"blog">) =>
				new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf(),
		);

		let content = "";

		content += `# ${authorConfig.SiteName} - Full Blog Content\n\n`;
		content += `> ${authorConfig.SiteDescription}\n\n`;
		content += `---\n\n`;

		for (const post of sortedPosts) {
			const url = `${siteUrl}blog/${post.id}/`;

			content += `# ${post.data.title}\n\n`;
			content += `- **URL**: ${url}\n`;
			content += `- **Published**: ${post.data.pubDate.toISOString().split("T")[0]}\n`;
			content += `- **Author**: ${post.data.authorName}\n`;
			content += `- **Tags**: ${post.data.tags.join(", ")}\n`;
			if (post.data.description) {
				content += `- **Description**: ${post.data.description}\n`;
			}
			content += "\n";

			if (post.body) {
				const processedContent = cleanContent(post.body);
				content += `${processedContent}\n\n`;
			}

			content += "---\n\n";
		}

		return new Response(content.trim(), {
			headers: { "Content-Type": "text/plain; charset=utf-8" },
		});
	} catch (error) {
		console.error("Failed to generate llms-full.txt:", error);
		return new Response("Error generating llms-full.txt", { status: 500 });
	}
};
