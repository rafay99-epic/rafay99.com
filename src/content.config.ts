import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
	schema: z.object({
		title: z.string().min(1),
		description: z.string().min(1),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().min(1).optional(),
		draft: z.boolean().default(true),
		archived: z.boolean().default(false),
		authorName: z.string().min(1),
		authorAvatar: z.string().min(1).optional(),
		tags: z.array(z.string().min(1)).default(["blog"]),
		readTime: z.string().optional(),
		keywords: z.array(z.string().min(1)).optional(),
		canonicalUrl: z.string().min(1).optional(),
		featured: z.boolean().default(false),
		excerpt: z.string().optional(),
		series: z.string().min(1).optional(),
		seriesPart: z.number().int().positive().optional(),
		seriesTotal: z.number().int().positive().optional(),
	}),
});

const projects = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
	schema: z.object({
		Projecttitle: z.string().min(1),
		ProjectDescription: z.string().min(1),
		ProjectImage: z.string().min(1).or(z.literal("")).optional(),
		draft: z.boolean().default(true),
		ProjectTech: z.array(z.string().min(1)).optional(),
		ProjectGithubLink: z
			.string()
			.regex(/^https?:\/\//)
			.or(z.literal(""))
			.optional(),
		ProjectDeployedLink: z
			.string()
			.regex(/^https?:\/\//)
			.or(z.literal(""))
			.optional(),
		ProjectCategory: z.array(z.string().min(1)).optional(),
		ProjectRanking: z.string().optional(),
	}),
});

const legal = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/legal" }),
	schema: z.object({
		title: z.string().min(1),
		description: z.string().min(1),
		lastUpdated: z.coerce.date().optional(),
	}),
});

export const collections = {
	blog: blog,
	projects: projects,
	legal: legal,
};
