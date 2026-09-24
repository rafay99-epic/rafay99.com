// Accent colours cycled across index rows and roles (Tokyo Night).
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

// UTC so build-time HTML and hydrated React islands print the same day
// (frontmatter dates are midnight UTC).
export const formatDate = (date: Date) =>
	date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC",
	});

// "Env Pilot - Environment Variable Management" -> "Env Pilot"
export const shortTitle = (title: string) =>
	title.split(/\s[-–]\s/)[0] ?? title;

// "Sep 2024 - Present" -> 2024
export const startYear = (range: string) =>
	Number(range.match(/\d{4}/)?.[0] ?? 0);
