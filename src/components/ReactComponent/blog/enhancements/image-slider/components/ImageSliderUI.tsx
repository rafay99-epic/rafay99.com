import { useImageSlider } from "@hooks/useImageSlider";
import { useSliderStyles } from "@hooks/useSliderStyles";
import { AnimatePresence, m } from "framer-motion";
import type { ImageSliderProps } from "types/image_slider";
import { NavigationButton } from "./NavigationButton";
import { Thumbnail } from "./Thumbnail";

export function ImageSliderUI({
	images,
	aspectRatio = "auto",
	showThumbnails = true,
	layout = "classic",
	theme = "dark",
	thumbnailPosition = "bottom",
}: ImageSliderProps) {
	const {
		current,
		isFullScreen,
		sliderRef,
		containerRef,
		handleImageLoad,
		isImageLoaded,
		prevSlide,
		nextSlide,
		goToSlide,
		toggleFullScreen,
		handleTouchStart,
		handleTouchMove,
		handleMouseEnter,
		handleMouseLeave,
	} = useImageSlider(images.length);

	const {
		themeClasses,
		layoutClasses,
		containerClasses,
		mainContentClasses,
		aspectRatioClass,
	} = useSliderStyles(
		theme,
		layout,
		aspectRatio,
		thumbnailPosition,
		isFullScreen,
	);

	return (
		<div
			ref={containerRef}
			className={containerClasses}
			onPointerEnter={handleMouseEnter}
			onPointerLeave={handleMouseLeave}
		>
			<div className={mainContentClasses}>
				<div
					ref={sliderRef}
					className="relative grow"
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
				>
					<AnimatePresence mode="wait">
						<m.div
							key={current}
							initial={{ opacity: 0, scale: 1.1 }}
							animate={{
								opacity: isImageLoaded(current) ? 1 : 0.5,
								scale: isImageLoaded(current) ? 1 : 1.1,
								filter: isImageLoaded(current) ? "blur(0px)" : "blur(10px)",
							}}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className={`relative ${aspectRatioClass}`}
						>
							<img
								src={images[current]}
								alt={`Slide ${current + 1}`}
								onLoad={() => handleImageLoad(current)}
								className={`w-full ${
									isFullScreen
										? "h-screen object-contain"
										: "h-[500px] object-cover md:h-[600px] lg:h-[700px] xl:h-[800px]"
								} ${layoutClasses.image}`}
							/>

							{!isImageLoaded(current) && (
								<m.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="bg-(--accent-dark)/10 absolute inset-0 flex items-center justify-center backdrop-blur-sm"
								>
									<m.div
										animate={{
											rotate: 360,
											transition: {
												duration: 1.5,
												ease: "linear",
												repeat: Infinity,
											},
										}}
										className={`h-12 w-12 rounded-full border-4 border-(--accent) border-t-transparent`}
									/>
								</m.div>
							)}
						</m.div>
					</AnimatePresence>

					<div className={layoutClasses.controls}>
						<NavigationButton
							direction="prev"
							onClick={prevSlide}
							themeClasses={themeClasses}
						/>
						<NavigationButton
							direction="next"
							onClick={nextSlide}
							themeClasses={themeClasses}
						/>

						<div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
							<m.span
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className={`rounded-full px-3 py-1 text-sm ${themeClasses.controls}`}
							>
								{current + 1} / {images.length}
							</m.span>

							<m.button
								type="button"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={toggleFullScreen}
								className={`rounded-full px-3 py-1 text-sm transition-colors focus:outline-none focus:ring-2 ${themeClasses.buttons} ${themeClasses.ring}`}
								aria-label={
									isFullScreen ? "Exit fullscreen" : "Enter fullscreen"
								}
							>
								{isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
							</m.button>
						</div>
					</div>
				</div>

				{showThumbnails && (
					<m.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className={`${layoutClasses.thumbnails} ${
							thumbnailPosition !== "bottom" ? "w-24" : "w-full"
						}`}
					>
						{images.map((image, index) => (
							<Thumbnail
								key={image}
								image={image}
								index={index}
								current={current}
								onClick={() => goToSlide(index)}
								thumbnailPosition={thumbnailPosition}
								themeClasses={themeClasses}
							/>
						))}
					</m.div>
				)}
			</div>
		</div>
	);
}
