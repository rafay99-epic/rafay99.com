import { useEffect, useState } from "react";

const c = {
	bg: "#1a1b26",
	panel: "#24283b",
	line: "#3b4261",
	text: "#c0caf5",
	muted: "#737aa2",
	blue: "#7aa2f7",
	green: "#9ece6a",
	red: "#f7768e",
	orange: "#ff9e64",
};

const stages = [
	{
		label: "Before any fix",
		detail: "changelog ISR + middleware on everything + no-store page views",
		minutesPerDay: 16,
	},
	{
		label: "PR #183 · changelog static",
		detail: "one MD file at build time, 1,440 regens/day gone",
		minutesPerDay: 11,
	},
	{
		label: "PR #183 · middleware scoped",
		detail: "public routes skip WorkOS boot, version hits CDN",
		minutesPerDay: 8,
	},
	{
		label: "PR #3 · PagePilot hot path",
		detail: "static landing/docs, edge-cached /p/<id>, aws4fetch cold starts",
		minutesPerDay: 5,
	},
] as const;

const capMinutesPerDay = 240 / 30;

export default function CapGauge() {
	const [stage, setStage] = useState(0);

	useEffect(() => {
		const id = setInterval(
			() => setStage((s) => (s + 1) % stages.length),
			2600,
		);
		return () => clearInterval(id);
	}, []);

	const current = stages[stage] ?? stages[0];
	const pctOfCap = Math.min(
		(current.minutesPerDay / capMinutesPerDay) * 100,
		100,
	);
	const overCap = current.minutesPerDay > capMinutesPerDay;

	return (
		<div
			style={{
				background: c.bg,
				border: `1px solid ${c.line}`,
				borderRadius: 16,
				padding: 24,
				fontFamily: "ui-sans-serif, system-ui, sans-serif",
				color: c.text,
			}}
		>
			<div
				style={{
					fontFamily: "ui-monospace, Menlo, monospace",
					fontSize: 11,
					letterSpacing: ".18em",
					textTransform: "uppercase",
					color: c.muted,
					marginBottom: 18,
				}}
			>
				Fluid Active CPU · daily burn as each fix lands
			</div>

			<div style={{ display: "flex", gap: 20, alignItems: "center" }}>
				<div style={{ flex: 1 }}>
					{stages.map((s, i) => (
						<div key={s.label} style={{ marginBottom: 10 }}>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									fontSize: 11,
									fontFamily: "ui-monospace, Menlo, monospace",
									marginBottom: 3,
									opacity: i === stage ? 1 : 0.4,
									transition: "opacity .4s ease",
								}}
							>
								<span style={{ color: i === stage ? c.blue : c.muted }}>
									{i <= stage ? "✓" : "·"} {s.label}
								</span>
								<span style={{ color: i <= stage ? c.green : c.muted }}>
									~{s.minutesPerDay} min/day
								</span>
							</div>
							<div
								style={{
									height: 8,
									borderRadius: 4,
									background: c.bg,
									border: `1px solid ${c.line}`,
									overflow: "hidden",
								}}
							>
								<div
									style={{
										height: "100%",
										width: `${(s.minutesPerDay / 16) * 100}%`,
										borderRadius: 4,
										background:
											i <= stage
												? s.minutesPerDay > capMinutesPerDay
													? c.red
													: c.blue
												: c.line,
										transition: "width .6s ease, background .4s ease",
									}}
								/>
							</div>
						</div>
					))}
				</div>

				<div
					style={{
						width: 150,
						background: c.panel,
						border: `1px solid ${c.line}`,
						borderRadius: 12,
						padding: 16,
						textAlign: "center",
						flexShrink: 0,
					}}
				>
					<div
						style={{
							fontSize: 34,
							fontWeight: 900,
							fontFamily: "ui-monospace, Menlo, monospace",
							color: overCap ? c.red : c.green,
							transition: "color .4s ease",
						}}
					>
						{current.minutesPerDay}
					</div>
					<div
						style={{
							fontSize: 10,
							fontFamily: "ui-monospace, Menlo, monospace",
							color: c.muted,
							marginBottom: 10,
						}}
					>
						min/day vs ~{capMinutesPerDay} cap
					</div>
					<div
						style={{
							fontSize: 10,
							padding: "3px 8px",
							borderRadius: 4,
							display: "inline-block",
							fontFamily: "ui-monospace, Menlo, monospace",
							color: overCap ? c.red : c.green,
							border: `1px solid ${overCap ? c.red : c.green}`,
							background: overCap
								? "rgba(247,118,142,.08)"
								: "rgba(158,206,106,.08)",
						}}
					>
						{overCap ? "123% of cap" : `${Math.round(pctOfCap)}% of cap`}
					</div>
				</div>
			</div>

			<div
				style={{
					marginTop: 14,
					fontSize: 11.5,
					color: c.muted,
					minHeight: 16,
				}}
			>
				{current.detail}
			</div>
		</div>
	);
}
