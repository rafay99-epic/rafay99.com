import { useEffect, useState } from "react";

const C = {
	bg: "#1a1b26",
	line: "#3b4261",
	text: "#c0caf5",
	muted: "#737aa2",
	green: "#9ece6a",
	red: "#f7768e",
	mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
	sans: "ui-sans-serif, system-ui, -apple-system, sans-serif",
} as const;

const SIDES = [
	{ name: "TanStack Start", start: 10, ram: 1.5, color: C.green },
	{ name: "Next.js v16.2", start: 70, ram: 8, color: C.red },
] as const;

const MAX_RAM = 8;

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

export default function DevServerCost() {
	const active = useCycle(SIDES.length, 2800);

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
					dev server · same codebase · same machine
				</span>
				<span style={{ fontFamily: C.mono, fontSize: 10, color: C.muted }}>
					M4 Max, idle
				</span>
			</div>

			<div style={{ display: "flex", gap: 16 }}>
				{SIDES.map((side, i) => {
					const on = i === active;
					const ramPct = (side.ram / MAX_RAM) * 100;
					return (
						<div
							key={side.name}
							style={{
								flex: 1,
								border: `1px solid ${on ? side.color : C.line}`,
								borderRadius: 10,
								padding: "16px 14px 14px",
								opacity: on ? 1 : 0.55,
								transition: "opacity .55s ease, border-color .55s ease",
							}}
						>
							<div
								style={{
									fontFamily: C.mono,
									fontSize: 11,
									color: on ? side.color : C.muted,
									marginBottom: 14,
									transition: "color .55s ease",
								}}
							>
								{side.name}
							</div>

							<div style={{ marginBottom: 12 }}>
								<div
									style={{
										fontFamily: C.mono,
										fontSize: 22,
										color: on ? C.text : C.muted,
										transition: "color .55s ease",
									}}
								>
									{side.start}s
								</div>
								<div
									style={{
										fontFamily: C.mono,
										fontSize: 10,
										color: C.muted,
										marginTop: 2,
									}}
								>
									cold start
								</div>
							</div>

							<div>
								<div
									style={{
										fontFamily: C.mono,
										fontSize: 22,
										color: on ? C.text : C.muted,
										transition: "color .55s ease",
									}}
								>
									{side.ram} GB
								</div>
								<div
									style={{
										fontFamily: C.mono,
										fontSize: 10,
										color: C.muted,
										marginTop: 2,
										marginBottom: 8,
									}}
								>
									RAM at rest
								</div>
								<div
									style={{
										height: 6,
										borderRadius: 3,
										background: C.line,
										overflow: "hidden",
									}}
								>
									<div
										style={{
											height: "100%",
											width: `${ramPct}%`,
											background: side.color,
											opacity: on ? 0.95 : 0.6,
											transition: "opacity .55s ease",
										}}
									/>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<div
				style={{
					marginTop: 18,
					paddingTop: 14,
					borderTop: `1px solid ${C.line}`,
					fontFamily: C.mono,
					fontSize: 11.5,
					lineHeight: 1.6,
					color: C.muted,
				}}
			>
				On a 16 GB machine, 8 GB for one dev server is not a stat. It is a
				lifestyle constraint. Next.js 16.3 claims up to 90% less dev memory.
			</div>
		</div>
	);
}
