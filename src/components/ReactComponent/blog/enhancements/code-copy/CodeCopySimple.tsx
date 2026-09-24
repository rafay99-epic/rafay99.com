import { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { STYLES, TOAST_STYLES } from "./styles";

const ICON_COPY =
	'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
const ICON_CHECK =
	'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

const COPIED_CLASSES = [
	"bg-[#9ece6a]/20",
	"border-[#9ece6a]/30",
	"text-[#9ece6a]",
];

const BAR_CLASS = "code-copy-bar";
const BTN_CLASS = "code-copy-btn";

const copyResetTimers = new WeakMap<HTMLElement, number>();

function extractLanguage(codeElement: HTMLElement): string | undefined {
	const match = (codeElement.className || "").match(/(?:language|lang)-(\w+)/);
	return match ? match[1] : undefined;
}

function enhanceCodeBlock(preElement: HTMLElement): void {
	if (preElement.hasAttribute("data-copy-enhanced")) return;

	const codeElement = preElement.querySelector("code");
	if (!codeElement || (codeElement.textContent ?? "").trim().length === 0) {
		return;
	}

	preElement.style.position = "relative";
	preElement.setAttribute("data-copy-enhanced", "true");

	const isMobile = window.matchMedia("(max-width: 768px)").matches;
	const language = extractLanguage(codeElement);

	const bar = document.createElement("div");
	bar.className = `${BAR_CLASS} ${STYLES.buttonContainer}`;

	if (language) {
		const label = document.createElement("span");
		label.className = `${STYLES.languageLabel} hidden md:inline-block`;
		label.textContent = language;
		Object.assign(label.style, STYLES.language);
		bar.appendChild(label);
	}

	const button = document.createElement("button");
	button.type = "button";
	button.className =
		`${BTN_CLASS} ${STYLES.copyButton} ${isMobile ? STYLES.mobileButton : ""}`.trim();
	button.setAttribute("aria-label", "Copy code to clipboard");
	button.innerHTML = ICON_COPY;
	bar.appendChild(button);

	preElement.appendChild(bar);
}

function flashCopied(button: HTMLElement): void {
	const existing = copyResetTimers.get(button);
	if (existing) window.clearTimeout(existing);

	button.innerHTML = ICON_CHECK;
	button.classList.add(...COPIED_CLASSES);

	const timer = window.setTimeout(() => {
		button.innerHTML = ICON_COPY;
		button.classList.remove(...COPIED_CLASSES);
		copyResetTimers.delete(button);
	}, 2000);
	copyResetTimers.set(button, timer);
}

async function handleCopyClick(event: MouseEvent): Promise<void> {
	const button = (event.target as HTMLElement | null)?.closest<HTMLElement>(
		`.${BTN_CLASS}`,
	);
	if (!button) return;

	const code = button.closest("pre")?.querySelector("code")?.textContent ?? "";
	if (!code.trim()) return;

	try {
		await navigator.clipboard.writeText(code);
		navigator.vibrate?.(50);
		flashCopied(button);
		toast.success("Code copied to clipboard");
	} catch (error) {
		console.error("Failed to copy to clipboard:", error);
		toast.error("Failed to copy code");
	}
}

const CodeCopySimple = function CodeCopySimple() {
	useEffect(() => {
		const enhanceAll = () => {
			document
				.querySelectorAll<HTMLElement>("pre:not([data-copy-enhanced])")
				.forEach(enhanceCodeBlock);
		};

		let scheduled = false;
		const schedule = () => {
			if (scheduled) return;
			scheduled = true;
			requestAnimationFrame(() => {
				scheduled = false;
				enhanceAll();
			});
		};

		const observer = new MutationObserver((mutations) => {
			const relevant = mutations.some(
				(m) => m.addedNodes.length > 0 || m.type === "characterData",
			);
			if (relevant) schedule();
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			characterData: true,
		});
		document.addEventListener("click", handleCopyClick);
		schedule();

		return () => {
			observer.disconnect();
			document.removeEventListener("click", handleCopyClick);
			document
				.querySelectorAll<HTMLElement>("pre[data-copy-enhanced]")
				.forEach((pre) => {
					pre.removeAttribute("data-copy-enhanced");
					pre.querySelector(`.${BAR_CLASS}`)?.remove();
				});
		};
	}, []);

	return <Toaster position="bottom-right" toastOptions={TOAST_STYLES} />;
};

export default CodeCopySimple;
