import { useEffect, useState } from "react";

const C = {
	bg: "#1a1b26",
	line: "#3b4261",
	text: "#c0caf5",
	muted: "#737aa2",
	blue: "#7aa2f7",
	purple: "#bb9af7",
	green: "#9ece6a",
	mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
	sans: "ui-sans-serif, system-ui, -apple-system, sans-serif",
} as const;

const FACTS = [
	{
		label: "shared, framework-agnostic",
		pct: 97,
		color: C.green,
		note: "one #shared/ alias, lint rules forbid importing either framework",
	},
	{
		label: "Next.js specific",
		pct: 3,
		color: C.blue,
		note: "what was left right before the Next.js code got deleted",
	},
	{
		label: "lovable.dev serving path",
		pct: 0.02,
		color: C.purple,
		note: "under 200 lines unique to serving the site on their own platform",
	},
] as const;

function useCycle(length: number, ms: number): number {
	const [index, setIndex] = useState<number>(0);

	useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (query.matches) return;
		const id = window.setInterval(() => {
			setIndex((current) => (current + 1) % length);
		}, ms);
		return () => window.clearInterval(id);
	}, [length, ms]);

	return index;
}

export default function SharedCodeSplit() {
	const active = useCycle(FACTS.length, 3000);
	const current = FACTS[active] ?? FACTS[0];

	return (
		<div
			style={{
				background: C.bg,
				border: `1px solid ${C.line}`,
				borderRadius: 14,
				padding: "26px 24px 20px",
				fontFamily: C.sans,
				color: C.text,
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "baseline",
					marginBottom: 24,
				}}
			>
				<span
					style={{
						fontFamily: C.mono,
						fontSize: 10,
						letterSpacing: ".2em",
						textTransform: "uppercase",
						color: C.muted,
					}}
				>
					850K lines · where it lived
				</span>
				<span style={{ fontFamily: C.mono, fontSize: 10, color: C.muted }}>
					end of migration
				</span>
			</div>

			<div
				style={{
					display: "flex",
					height: 14,
					borderRadius: 7,
					overflow: "hidden",
					border: `1px solid ${C.line}`,
					marginBottom: 20,
				}}
			>
				<div
					style={{
						width: "97%",
						background: C.green,
						opacity: active === 0 ? 0.95 : 0.45,
						transition: "opacity .55s ease",
					}}
				/>
				<div
					style={{
						width: "3%",
						background: C.blue,
						opacity: active === 1 ? 0.95 : 0.45,
						transition: "opacity .55s ease",
					}}
				/>
			</div>

			<div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
				{FACTS.slice(0, 2).map((fact, i) => (
					<div key={fact.label} style={{ display: "flex", gap: 8 }}>
						<span
							style={{
								width: 8,
								height: 8,
								borderRadius: 2,
								background: fact.color,
								marginTop: 4,
								flexShrink: 0,
							}}
						/>
						<span
							style={{
								fontFamily: C.mono,
								fontSize: 11,
								color: i === active ? C.text : C.muted,
								transition: "color .55s ease",
							}}
						>
							{fact.pct}% {fact.label}
						</span>
					</div>
				))}
			</div>

			<div
				style={{
					borderTop: `1px solid ${C.line}`,
					paddingLeft: 12,
					borderLeft: `2px solid ${current.color}`,
					minHeight: 34,
					display: "flex",
					alignItems: "center",
				}}
			>
				<p
					key={active}
					style={{
						margin: 0,
						fontSize: 12.5,
						lineHeight: 1.5,
						color: C.muted,
						animation: "scs-fade .5s ease both",
					}}
				>
					<strong style={{ color: current.color, fontFamily: C.mono }}>
						{current.label}
					</strong>{" "}
					— {current.note}
				</p>
			</div>

			<style>{`
        @keyframes scs-fade {
          from { opacity: 0; transform: translateY(3px); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="scs-fade"] { animation: none !important; }
        }
      `}</style>
		</div>
	);
}
