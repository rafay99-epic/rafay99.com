import { useEffect, useState } from "react";

const predictions = [
	{
		number: 1,
		label: "Fable returns",
		detail: "Partially, within weeks — region-locked or US-persons-gated",
		color: "#7aa2f7",
	},
	{
		number: 2,
		label: "Global developer market fractures",
		detail:
			"Frontier tier becomes US-citizens-only. The rest of the world reads about it.",
		color: "#f7768e",
	},
	{
		number: 3,
		label: "Competition wins quietly",
		detail:
			"Non-US teams pick models without export controls. The safe procurement choice shifts.",
		color: "#e0af68",
	},
	{
		number: 4,
		label: "Safety honesty chills",
		detail:
			"Labs stop loudly warning about dangers. Transparency decreases across the industry.",
		color: "#bb9af7",
	},
	{
		number: 5,
		label: "Capability doesn't disappear",
		detail:
			"Like 90s crypto wars — you can remove the product, not the capability.",
		color: "#73daca",
	},
	{
		number: 6,
		label: "Defender asymmetry becomes the norm",
		detail:
			"Open-weight self-hosted models become mandatory IR toolkit components.",
		color: "#9ece6a",
	},
];

const c = {
	bg: "#1a1b26",
	panel: "#24283b",
	line: "#3b4261",
	text: "#c0caf5",
	muted: "#737aa2",
};

export default function PredictionsPanel() {
	const [prediction, setPrediction] = useState(0);

	useEffect(() => {
		const id = setInterval(
			() => setPrediction((p) => (p + 1) % predictions.length),
			2600,
		);
		return () => clearInterval(id);
	}, []);

	const current = predictions[prediction];
	if (!current) return null;

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
				Predictions · what happens next
			</div>

			<div
				style={{
					border: `1px solid ${current.color}`,
					borderRadius: 12,
					background: `${current.color}10`,
					padding: 20,
					marginBottom: 16,
					boxShadow: `0 0 24px -8px ${current.color}`,
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "flex-start",
						gap: 14,
					}}
				>
					<div
						style={{
							width: 36,
							height: 36,
							borderRadius: "50%",
							border: `2px solid ${current.color}`,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontFamily: "ui-monospace, Menlo, monospace",
							fontSize: 14,
							fontWeight: 700,
							color: current.color,
							flexShrink: 0,
							background: `${current.color}15`,
						}}
					>
						{current.number}
					</div>
					<div style={{ flex: 1 }}>
						<div
							style={{
								fontSize: 15,
								fontWeight: 700,
								color: current.color,
								marginBottom: 4,
								fontFamily: "ui-monospace, Menlo, monospace",
								transition: "color .3s ease",
							}}
						>
							{current.label}
						</div>
						<div style={{ fontSize: 13, color: c.muted, lineHeight: 1.5 }}>
							{current.detail}
						</div>
					</div>
				</div>
			</div>

			<div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
				{predictions.map((p, i) => (
					<div
						key={p.number}
						style={{
							flex: 1,
							maxWidth: 32,
							height: 4,
							borderRadius: 2,
							background: i === prediction ? p.color : c.line,
							transition: "background .3s ease, box-shadow .3s ease",
							boxShadow: i === prediction ? `0 0 8px 1px ${p.color}` : "none",
						}}
					/>
				))}
			</div>

			<div
				style={{
					marginTop: 12,
					textAlign: "center",
					fontSize: 11,
					color: c.muted,
					fontFamily: "ui-monospace, Menlo, monospace",
				}}
			>
				Personal predictions · time will tell how many land
			</div>
		</div>
	);
}
