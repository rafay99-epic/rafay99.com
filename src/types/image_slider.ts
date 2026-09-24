import type { RefObject } from "react";
import { z } from "zod";

export const AspectRatioSchema = z.enum(["square", "video", "wide", "auto"]);
export const LayoutSchema = z.enum([
	"classic",
	"modern",
	"minimal",
	"gallery",
	"carousel",
]);
export const ThemeSchema = z.enum(["light", "dark", "glass"]);
export const ThumbnailPositionSchema = z.enum(["bottom", "left", "right"]);

const ImageSliderPropsSchema = z.object({
	images: z.array(z.string()),
	aspectRatio: AspectRatioSchema.optional(),
	showThumbnails: z.boolean().optional(),
	layout: LayoutSchema.optional(),
	theme: ThemeSchema.optional(),
	thumbnailPosition: ThumbnailPositionSchema.optional(),
});

export const ThemeClassesSchema = z.object({
	container: z.string(),
	controls: z.string(),
	buttons: z.string(),
	ring: z.string(),
});

const LayoutClassesSchema = z.object({
	container: z.string(),
	image: z.string(),
	controls: z.string(),
	thumbnails: z.string(),
});

const NavigationButtonPropsSchema = z.object({
	direction: z.enum(["prev", "next"]),
	onClick: z.any(),
	themeClasses: ThemeClassesSchema.pick({ buttons: true, ring: true }),
});

const ThumbnailPropsSchema = z.object({
	image: z.string(),
	index: z.number(),
	current: z.number(),
	onClick: z.any(),
	thumbnailPosition: z.string(),
	themeClasses: ThemeClassesSchema.pick({ ring: true }),
});

const UseImageSliderResultSchema = z.object({
	current: z.number(),
	isFullScreen: z.boolean(),
	loadedImages: z.custom<Set<number>>(),
	isHovered: z.boolean(),
	sliderRef: z.custom<RefObject<HTMLDivElement | null>>(),
	containerRef: z.custom<RefObject<HTMLDivElement | null>>(),
	handleImageLoad: z.any(),
	isImageLoaded: z.any(),
	prevSlide: z.any(),
	nextSlide: z.any(),
	goToSlide: z.any(),
	toggleFullScreen: z.any(),
	handleTouchStart: z.any(),
	handleTouchMove: z.any(),
	handleMouseEnter: z.any(),
	handleMouseLeave: z.any(),
});

export type AspectRatio = z.infer<typeof AspectRatioSchema>;
export type Layout = z.infer<typeof LayoutSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type ThumbnailPosition = z.infer<typeof ThumbnailPositionSchema>;
export type ImageSliderProps = z.infer<typeof ImageSliderPropsSchema>;
export type ThemeClasses = z.infer<typeof ThemeClassesSchema>;
export type LayoutClasses = z.infer<typeof LayoutClassesSchema>;
export type NavigationButtonProps = z.infer<typeof NavigationButtonPropsSchema>;
export type ThumbnailProps = z.infer<typeof ThumbnailPropsSchema>;
export type UseImageSliderResult = z.infer<typeof UseImageSliderResultSchema>;
