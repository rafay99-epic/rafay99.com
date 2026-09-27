import { type RefObject, useEffect, useState } from "react";

export function useOnScreen(ref: RefObject<Element | null>) {
	const [onScreen, setOnScreen] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;
		const observer = new IntersectionObserver(([entry]) =>
			setOnScreen(entry?.isIntersecting ?? false),
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [ref]);

	return onScreen;
}
