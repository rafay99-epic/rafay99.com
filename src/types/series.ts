import type { CollectionEntry } from "astro:content";
import { z } from "zod";

const SeriesFrontmatterSchema = z.object({
	series: z.string().optional(),
	seriesPart: z.number().int().positive().optional(),
	seriesTotal: z.number().int().positive().optional(),
});

export const SeriesMetaSchema = z.object({
	slug: z.string(),
	title: z.string(),
	postCount: z.number().int().positive(),
	latestDate: z.coerce.date(),
	tags: z.array(z.string()),
	description: z.string().optional(),
	heroImage: z.string().optional(),
});

export type SeriesFrontmatter = z.infer<typeof SeriesFrontmatterSchema>;
export type SeriesMeta = z.infer<typeof SeriesMetaSchema>;

export type SeriesPost = CollectionEntry<"blog"> & {
	data: CollectionEntry<"blog">["data"] & {
		series: string;
		seriesPart: number;
	};
};

export interface SeriesContext {
	readonly name: string;
	readonly slug: string;
	readonly posts: ReadonlyArray<SeriesPost>;
	readonly totalParts: number;
	readonly currentIndex: number;
}
