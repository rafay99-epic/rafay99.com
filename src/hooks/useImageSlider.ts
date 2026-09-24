import { useEffect, useRef, useState } from "react";
import type { UseImageSliderResult } from "types/image_slider";

export const useImageSlider = (imagesLength: number): UseImageSliderResult => {
	const [current, setCurrent] = useState(0);
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
	const [isHovered, setIsHovered] = useState(false);
	const sliderRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const touchStart = useRef(0);

	const handleImageLoad = (index: number) => {
		setLoadedImages((prev) => new Set(prev).add(index));
	};

	const isImageLoaded = (index: number) => loadedImages.has(index);

	const prevSlide = () => {
		setCurrent((prev) => (prev === 0 ? imagesLength - 1 : prev - 1));
	};

	const nextSlide = () => {
		setCurrent((prev) => (prev === imagesLength - 1 ? 0 : prev + 1));
	};

	const goToSlide = (index: number) => {
		setCurrent(index);
	};

	const toggleFullScreen = () => {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			sliderRef.current?.requestFullscreen();
		}
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		const touch = e.touches[0];
		if (!touch) return;
		touchStart.current = touch.clientX;
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!touchStart.current) return;
		const firstTouch = e.touches[0];
		if (!firstTouch) return;
		const currentTouch = firstTouch.clientX;
		const diff = touchStart.current - currentTouch;
		if (Math.abs(diff) > 50) {
			if (diff > 0) {
				nextSlide();
			} else {
				prevSlide();
			}
			touchStart.current = 0;
		}
	};

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	useEffect(() => {
		const handleFullScreenChange = () => {
			setIsFullScreen(Boolean(document.fullscreenElement));
		};
		document.addEventListener("fullscreenchange", handleFullScreenChange);
		return () =>
			document.removeEventListener("fullscreenchange", handleFullScreenChange);
	}, []);

	const handlersRef = useRef({ prevSlide, nextSlide, toggleFullScreen });
	useEffect(() => {
		handlersRef.current = { prevSlide, nextSlide, toggleFullScreen };
	});

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowLeft") handlersRef.current.prevSlide();
			if (event.key === "ArrowRight") handlersRef.current.nextSlide();
			if (event.key === "Escape" && isFullScreen)
				handlersRef.current.toggleFullScreen();
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isFullScreen]);

	return {
		current,
		isFullScreen,
		loadedImages,
		isHovered,
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
	};
};
