export const ACCENTS = [
	"--color-primary",
	"--color-secondary",
	"--color-accent",
	"--color-cyan",
	"--color-warning",
	"--color-orange",
	"--color-error",
] as const;

export const accentAt = (i: number) => `var(${ACCENTS[i % ACCENTS.length]})`;

export const formatDate = (date: Date) =>
	date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC",
	});

export const shortTitle = (title: string) =>
	title.split(/\s[-–]\s/)[0] ?? title;

export const startYear = (range: string) =>
	Number(range.match(/\d{4}/)?.[0] ?? 0);
