import { z } from "zod";

export const ShareUrlsSchema = z.object({
	whatsapp: z.string().url(),
	twitter: z.string().url(),
	facebook: z.string().url(),
	linkedin: z.string().url(),
});

export type ShareUrls = z.infer<typeof ShareUrlsSchema>;

export const generateShareUrls = (url: string): ShareUrls => {
	const shareUrls = {
		whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
		twitter: `https://twitter.com/share?url=${encodeURIComponent(url)}`,
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
		linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`,
	};

	return ShareUrlsSchema.parse(shareUrls);
};
