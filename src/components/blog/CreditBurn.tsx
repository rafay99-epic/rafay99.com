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
	yellow: "#e0af68",
};

const models = [
	{
		name: "Haiku 3",
		costPer: "$0.25/$1.25",
		costColor: "#73daca",
		rate: 1,
		requests: 800,
	},
	{
		name: "Sonnet 5",
		costPer: "$2/$10",
		costColor: "#7aa2f7",
		rate: 8,
		requests: 100,
	},
	{
		name: "Opus 4.8",
		costPer: "$15/$75",
		costColor: "#bb9af7",
		rate: 60,
		requests: 13,
	},
];

export default function CreditBurn() {
	const [tick, setTick] = useState(0);

	const maxTicks = 120;
	useEffect(() => {
		const id = setInterval(() => setTick((t) => (t + 1) % maxTicks), 80);
		return () => clearInterval(id);
	}, []);

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
				Credit burn rate · how fast models drain a $20 pool
			</div>

			<div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
				{models.map((m) => {
					const rawPool = 20;
					const used =
						m.name === "Haiku 3"
							? Math.min(rawPool, tick * 0.008)
							: m.name === "Sonnet 5"
								? Math.min(rawPool, tick * 0.08)
								: Math.min(rawPool, tick * 0.65);
					const pct = Math.min((used / rawPool) * 100, 100);
					const exhausted = used >= rawPool;

					const costPerRequest =
						m.name === "Haiku 3"
							? 0.0019
							: m.name === "Sonnet 5"
								? 0.015
								: 0.1125;
					const requests = Math.floor(used / costPerRequest);

					return (
						<div
							key={m.name}
							style={{
								flex: 1,
								border: `1px solid ${c.line}`,
								borderRadius: 12,
								background: c.panel,
								padding: 14,
								transition: "opacity .4s ease",
								opacity: exhausted ? 0.6 : 1,
							}}
						>
							<div
								style={{
									fontSize: 13,
									fontWeight: 700,
									color: exhausted ? c.red : c.text,
									marginBottom: 2,
									transition: "color .4s ease",
								}}
							>
								{m.name}
							</div>
							<div
								style={{
									fontSize: 10,
									color: m.costColor,
									fontFamily: "ui-monospace, Menlo, monospace",
									marginBottom: 12,
								}}
							>
								{m.costPer} / MTok
							</div>

							<div
								style={{
									height: 10,
									borderRadius: 5,
									background: c.bg,
									overflow: "hidden",
									marginBottom: 6,
								}}
							>
								<div
									style={{
										height: "100%",
										width: `${pct}%`,
										borderRadius: 5,
										background: exhausted
											? c.red
											: pct > 70
												? c.yellow
												: m.costColor,
										transition: "width .3s linear",
									}}
								/>
							</div>

							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									fontSize: 11,
									fontFamily: "ui-monospace, Menlo, monospace",
									color: c.muted,
								}}
							>
								<span>${used.toFixed(2)} used</span>
								<span
									style={{
										color: exhausted ? c.red : c.green,
									}}
								>
									{exhausted
										? "EXHAUSTED"
										: `$${(rawPool - used).toFixed(2)} left`}
								</span>
							</div>

							<div
								style={{
									marginTop: 8,
									padding: "6px 8px",
									borderRadius: 6,
									background: c.bg,
									fontSize: 11,
									fontFamily: "ui-monospace, Menlo, monospace",
									color: c.muted,
									textAlign: "center",
								}}
							>
								~{requests.toLocaleString()} requests
							</div>
						</div>
					);
				})}
			</div>

			<div
				style={{
					padding: "10px 14px",
					borderRadius: 8,
					border: `1px solid ${c.line}`,
					background: c.panel,
					fontSize: 12,
					color: c.muted,
				}}
			>
				<span style={{ color: c.blue, fontWeight: 600 }}>Note: </span>
				Auto mode on Cursor is unlimited and costs nothing extra. These burn
				rates only apply when you manually select a frontier model. The
				difference between Haiku and Opus is roughly{" "}
				<span style={{ color: c.yellow, fontWeight: 600 }}>60x</span>.
			</div>

			<div
				style={{
					marginTop: 10,
					textAlign: "center",
					fontSize: 11,
					color: c.muted,
				}}
			>
				Based on a $20 credit pool watching drain in real time
			</div>
		</div>
	);
}
