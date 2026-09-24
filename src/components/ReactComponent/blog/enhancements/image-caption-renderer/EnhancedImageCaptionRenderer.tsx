import { useEffect } from "react";

const CLICKABLE_CLASS = "enhanced-image-clickable";

function openFullscreen(src: string, alt: string): void {
	if (document.querySelector(".fullscreen-modal-active")) return;

	const overlay = document.createElement("div");
	overlay.className =
		"fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm fullscreen-modal-active";
	overlay.style.cursor = "zoom-out";

	const imageWrapper = document.createElement("div");
	imageWrapper.className = "relative max-h-[90vh] max-w-[90vw]";

	const img = document.createElement("img");
	img.src = src;
	img.alt = alt;
	img.className = "max-h-[90vh] max-w-[90vw] object-contain";

	const closeButton = document.createElement("button");
	closeButton.type = "button";
	closeButton.className =
		"absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20";
	closeButton.innerHTML =
		'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
	closeButton.setAttribute("aria-label", "Close fullscreen");

	if (alt) {
		const altText = document.createElement("div");
		altText.className =
			"absolute bottom-0 left-0 right-0 bg-black/50 p-4 text-center text-white backdrop-blur-sm";
		const altParagraph = document.createElement("p");
		altParagraph.className = "text-sm";
		altParagraph.textContent = alt;
		altText.appendChild(altParagraph);
		imageWrapper.appendChild(img);
		imageWrapper.appendChild(altText);
	} else {
		imageWrapper.appendChild(img);
	}

	overlay.appendChild(closeButton);
	overlay.appendChild(imageWrapper);

	const previousOverflow = document.body.style.overflow;
	document.body.style.overflow = "hidden";

	const close = () => {
		document.removeEventListener("keydown", onKeyDown);
		overlay.remove();
		document.body.style.overflow = previousOverflow;
	};
	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") close();
	};

	closeButton.addEventListener("click", close);
	overlay.addEventListener("click", (e) => {
		if (e.target === overlay) close();
	});
	document.addEventListener("keydown", onKeyDown);

	document.body.appendChild(overlay);
}

function handleImageClick(event: MouseEvent): void {
	const trigger = (event.target as HTMLElement | null)?.closest<HTMLElement>(
		`.${CLICKABLE_CLASS}`,
	);
	const img = trigger?.querySelector("img");
	if (!img) return;
	openFullscreen(img.src, img.getAttribute("alt") ?? "");
}

const EnhancedImageCaptionRenderer = function EnhancedImageCaptionRenderer() {
	useEffect(() => {
		const shouldProcessElement = (element: Element): boolean => {
			return element.tagName === "IMG" || element.querySelector("img") !== null;
		};

		const processImage = (img: HTMLImageElement) => {
			const alt = img.getAttribute("alt");

			if (
				!alt ||
				alt.trim() === "" ||
				img.hasAttribute("data-enhanced-processed") ||
				img.hasAttribute("data-caption-processed") ||
				img.closest("figure")
			) {
				return;
			}

			if (
				(img.naturalWidth > 0 && img.naturalWidth < 100) ||
				(img.naturalHeight > 0 && img.naturalHeight < 100)
			) {
				return;
			}

			if (img.naturalWidth === 0 || img.naturalHeight === 0) {
				img.addEventListener("load", () => processImage(img), { once: true });
				return;
			}

			const wrapper = document.createElement("div");
			wrapper.className = "my-4 text-center enhanced-image-container";

			const imageContainer = document.createElement("div");
			imageContainer.className = `relative inline-block cursor-pointer ${CLICKABLE_CLASS}`;

			const enhancedImg = img.cloneNode(true) as HTMLImageElement;
			enhancedImg.className =
				"max-w-full h-auto rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl";
			enhancedImg.setAttribute("data-enhanced-processed", "true");

			enhancedImg.addEventListener(
				"error",
				() => {
					enhancedImg.parentNode?.replaceChild(img, enhancedImg);
				},
				{ once: true },
			);

			const caption = document.createElement("p");
			caption.className = "mt-2 text-sm text-[#a9b1d6] italic";
			caption.textContent = alt;

			imageContainer.appendChild(enhancedImg);
			wrapper.appendChild(imageContainer);
			wrapper.appendChild(caption);

			const parent = img.parentNode;
			if (parent) {
				parent.insertBefore(wrapper, img);
				parent.removeChild(img);
			}
		};

		const processImages = () => {
			const mainContent = document.querySelector(
				"main, .main-content, .content-prose",
			);
			if (!mainContent) return;

			const images = mainContent.querySelectorAll<HTMLImageElement>(
				"img[alt]:not([data-enhanced-processed]):not([data-caption-processed])",
			);

			if (images.length > 0) {
				requestAnimationFrame(() => {
					images.forEach(processImage);
				});
			}
		};

		processImages();

		let timeoutId: ReturnType<typeof setTimeout> | null = null;

		const observer = new MutationObserver((mutations) => {
			const hasNewImages = mutations.some(
				(mutation) =>
					mutation.type === "childList" &&
					Array.from(mutation.addedNodes).some(
						(node) =>
							node.nodeType === Node.ELEMENT_NODE &&
							shouldProcessElement(node as Element),
					),
			);

			if (hasNewImages) {
				if (timeoutId) clearTimeout(timeoutId);
				timeoutId = setTimeout(processImages, 150);
			}
		});

		const mainContent = document.querySelector(
			"main, .main-content, .content-prose",
		);
		if (mainContent) {
			observer.observe(mainContent, { childList: true, subtree: true });
		}

		document.addEventListener("click", handleImageClick);

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
			observer.disconnect();
			document.removeEventListener("click", handleImageClick);
		};
	}, []);

	return null;
};

export default EnhancedImageCaptionRenderer;
