import type {
	AspectRatio,
	Layout,
	LayoutClasses,
	Theme,
	ThemeClasses,
	ThumbnailPosition,
} from "types/image_slider";

export const useSliderStyles = (
	theme: Theme,
	layout: Layout,
	aspectRatio: AspectRatio,
	thumbnailPosition: ThumbnailPosition,
	isFullScreen: boolean,
) => {
	const themeClasses = ((): ThemeClasses => {
		switch (theme) {
			case "light":
				return {
					container: "bg-(--text-light)",
					controls: "bg-(--text-light)/75 text-(--accent-dark)",
					buttons:
						"bg-(--text-light)/75 text-(--accent-dark) hover:bg-(--text-light)",
					ring: "ring-(--accent)",
				};
			case "glass":
				return {
					container: "backdrop-blur-md bg-(--accent-dark)/10",
					controls:
						"backdrop-blur-md bg-(--accent-dark)/20 text-(--text-light)",
					buttons:
						"backdrop-blur-md bg-(--accent)/20 text-(--text-light) hover:bg-(--accent)/30",
					ring: "ring-(--accent)",
				};
			default:
				return {
					container: "bg-(--accent-dark)",
					controls: "bg-(--accent-dark)/75 text-(--text-light)",
					buttons:
						"bg-(--accent-dark)/75 text-(--text-light) hover:bg-(--accent)",
					ring: "ring-(--accent)",
				};
		}
	})();

	const layoutClasses = ((): LayoutClasses => {
		switch (layout) {
			case "modern":
				return {
					container: "rounded-2xl overflow-hidden shadow-2xl",
					image: "transition-all duration-500 ease-out",
					controls:
						"opacity-0 group-hover:opacity-100 transition-opacity duration-300",
					thumbnails:
						thumbnailPosition === "bottom"
							? "flex gap-2 p-4 justify-center"
							: "flex flex-col gap-2 p-4",
				};
			case "minimal":
				return {
					container: "rounded-none",
					image: "transition-all duration-300",
					controls:
						"opacity-0 group-hover:opacity-100 transition-opacity duration-200",
					thumbnails: "hidden",
				};
			case "gallery":
				return {
					container: "rounded-lg shadow-xl p-4",
					image: "transition-all duration-500 ease-out rounded-lg",
					controls: "opacity-100",
					thumbnails: "grid grid-cols-4 gap-2 p-4",
				};
			case "carousel":
				return {
					container: "rounded-none overflow-visible",
					image:
						"transition-all duration-500 ease-out scale-90 hover:scale-100",
					controls: "opacity-100",
					thumbnails: "flex gap-4 justify-center py-4",
				};
			default:
				return {
					container: "rounded-lg overflow-hidden",
					image: "transition-all duration-300",
					controls: "opacity-100",
					thumbnails: "flex gap-2 p-2",
				};
		}
	})();

	const containerClasses = (() => `
    relative w-full max-w-7xl mx-auto
    ${layoutClasses.container}
    ${themeClasses.container}
    ${isFullScreen ? "fixed inset-0 z-50" : ""}
    group
  `)();

	const mainContentClasses = (() => `
    relative flex
    ${thumbnailPosition === "left" ? "flex-row-reverse" : ""}
    ${thumbnailPosition === "right" ? "flex-row" : "flex-col"}
  `)();

	const aspectRatioClass = (() => {
		switch (aspectRatio) {
			case "square":
				return "aspect-square";
			case "video":
				return "aspect-video";
			case "wide":
				return "aspect-21/9";
			default:
				return "";
		}
	})();

	return {
		themeClasses,
		layoutClasses,
		containerClasses,
		mainContentClasses,
		aspectRatioClass,
	};
};
