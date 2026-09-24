import { type CollectionEntry, getCollection } from "astro:content";

// Explicit because tsc (outside `astro check`) can't infer astro:content.
type Post = CollectionEntry<"blog">;
type Project = CollectionEntry<"projects">;

/** Posts per /blog listing page. */
export const POSTS_PER_PAGE = 9;

/** Published (non-draft, non-archived) posts, newest first. */
export async function getPublishedPosts(): Promise<Post[]> {
	return (await getCollection("blog"))
		.filter((post: Post) => !post.data.draft && !post.data.archived)
		.sort(
			(a: Post, b: Post) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
		);
}

/** Published projects ordered by ProjectRanking (1 = top). */
export async function getRankedProjects(): Promise<Project[]> {
	const rank = (p: Project) =>
		Number.parseInt(p.data.ProjectRanking ?? "9999", 10);
	return (await getCollection("projects"))
		.filter((project: Project) => !project.data.draft)
		.sort((a: Project, b: Project) => rank(a) - rank(b));
}

/** Tag -> post count, most used first. */
export function countTags(posts: Post[]): [tag: string, count: number][] {
	const counts = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.data.tags ?? []) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}
	return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
