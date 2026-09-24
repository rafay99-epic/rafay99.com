import { useEffect, useState } from "react";

const C = {
	bg: "#1a1b26",
	line: "#3b4261",
	text: "#c0caf5",
	muted: "#737aa2",
	yellow: "#e0af68",
	red: "#f7768e",
	mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
	sans: "ui-sans-serif, system-ui, -apple-system, sans-serif",
} as const;

const STEPS = [
	{ t: "12:00", rate: 0.1, label: "baseline · accepted as debt for later" },
	{ t: "13:00", rate: 0.5, label: "dashboard rollout at 5%, complaints start" },
	{ t: "13:20", rate: 20, label: "flag set to 20% before lunch" },
	{ t: "13:31", rate: 50, label: "every alert firing · rollback pushed" },
	{ t: "13:42", rate: 0.1, label: "recovered · 11 minutes end to end" },
] as const;

const MAX_RATE = 50;

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

export default function IncidentSpike() {
	const active = useCycle(STEPS.length, 2200);
	const current = STEPS[active] ?? STEPS[0];

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
					error rate · the friday
				</span>
				<span style={{ fontFamily: C.mono, fontSize: 10, color: C.muted }}>
					incident: 11 min
				</span>
			</div>

			<div
				style={{
					display: "flex",
					alignItems: "flex-end",
					gap: 10,
					height: 120,
					marginBottom: 18,
				}}
			>
				{STEPS.map((step, i) => {
					const on = i === active;
					const hot = step.rate >= 20;
					const h = Math.max(4, (step.rate / MAX_RATE) * 100);
					return (
						<div
							key={step.t}
							style={{
								flex: 1,
								display: "flex",
								flexDirection: "column",
								justifyContent: "flex-end",
								height: "100%",
								gap: 6,
							}}
						>
							<span
								style={{
									fontFamily: C.mono,
									fontSize: 10,
									textAlign: "center",
									color: on ? (hot ? C.red : C.text) : C.muted,
									transition: "color .4s ease",
								}}
							>
								{step.rate}%
							</span>
							<div
								style={{
									height: `${h}%`,
									borderRadius: 4,
									background: hot ? C.red : C.line,
									opacity: on ? 1 : 0.55,
									transition: "opacity .45s ease, background .45s ease",
								}}
							/>
							<span
								style={{
									fontFamily: C.mono,
									fontSize: 9,
									textAlign: "center",
									color: on ? C.text : C.muted,
									transition: "color .4s ease",
								}}
							>
								{step.t}
							</span>
						</div>
					);
				})}
			</div>

			<div
				style={{
					borderTop: `1px solid ${C.line}`,
					paddingLeft: 12,
					borderLeft: `2px solid ${current.rate >= 20 ? C.red : C.yellow}`,
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
						animation: "is-fade .5s ease both",
					}}
				>
					<strong
						style={{
							color: current.rate >= 20 ? C.red : C.yellow,
							fontFamily: C.mono,
						}}
					>
						{current.t}
					</strong>{" "}
					— {current.label}
				</p>
			</div>

			<style>{`
        @keyframes is-fade {
          from { opacity: 0; transform: translateY(3px); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="is-fade"] { animation: none !important; }
        }
      `}</style>
		</div>
	);
}
