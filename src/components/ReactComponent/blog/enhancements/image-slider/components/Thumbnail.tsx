import { m } from "framer-motion";
import type { ThumbnailProps } from "types/image_slider";

export function Thumbnail({
	image,
	index,
	current,
	onClick,
	thumbnailPosition,
	themeClasses,
}: ThumbnailProps) {
	return (
		<m.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			onClick={onClick}
			className={`shrink-0 transition-all duration-200 ${current === index ? `ring-2 ${themeClasses.ring} scale-95` : ""}`}
		>
			<img
				src={image}
				alt={`Thumbnail ${index + 1}`}
				className={`${
					thumbnailPosition === "bottom" ? "h-16 w-16" : "aspect-square w-full"
				} rounded-lg object-cover`}
				loading="lazy"
			/>
		</m.button>
	);
}
