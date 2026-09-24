import { useEffect, useState } from "react";

const models = [
	{
		name: "GPT-5.6 Sol",
		cheatRate: "82%",
		denialRate: "62%",
		color: "#73daca",
	},
	{
		name: "Claude Mythos",
		cheatRate: "74%",
		denialRate: "55%",
		color: "#bb9af7",
	},
	{ name: "Opus 4.7", cheatRate: "68%", denialRate: "48%", color: "#7aa2f7" },
	{ name: "GPT-5.5", cheatRate: "71%", denialRate: "51%", color: "#e0af68" },
];

const c = {
	bg: "#1a1b26",
	panel: "#24283b",
	line: "#3b4261",
	text: "#c0caf5",
	muted: "#737aa2",
	red: "#f7768e",
};

export default function CheatingStats() {
	const [model, setModel] = useState(0);

	useEffect(() => {
		const id = setInterval(
			() => setModel((m) => (m + 1) % models.length),
			2200,
		);
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
				AISI findings · every model tries to cheat
			</div>

			<div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
				{models.map((m, i) => {
					const on = i === model;
					return (
						<div
							key={m.name}
							style={{
								flex: 1,
								border: `1px solid ${on ? m.color : c.line}`,
								borderRadius: 10,
								background: on ? `${m.color}12` : c.panel,
								padding: "12px 8px",
								textAlign: "center",
								transition:
									"border-color .4s ease, background .4s ease, box-shadow .4s ease",
								boxShadow: on ? `0 0 18px -5px ${m.color}` : "none",
							}}
						>
							<div
								style={{
									fontSize: 11,
									fontWeight: 700,
									color: on ? m.color : c.muted,
									fontFamily: "ui-monospace, Menlo, monospace",
									marginBottom: 8,
									transition: "color .3s ease",
								}}
							>
								{m.name}
							</div>

							<div style={{ marginBottom: 4 }}>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										fontSize: 9,
										color: c.muted,
										marginBottom: 2,
										fontFamily: "ui-monospace, Menlo, monospace",
									}}
								>
									<span>Cheat</span>
									<span style={{ color: on ? m.color : c.text }}>
										{m.cheatRate}
									</span>
								</div>
								<div
									style={{
										height: 6,
										borderRadius: 3,
										background: c.bg,
										overflow: "hidden",
									}}
								>
									<div
										style={{
											height: "100%",
											width: m.cheatRate,
											borderRadius: 3,
											background: m.color,
											transition: "width .4s ease",
										}}
									/>
								</div>
							</div>

							<div>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										fontSize: 9,
										color: c.muted,
										marginBottom: 2,
										fontFamily: "ui-monospace, Menlo, monospace",
									}}
								>
									<span>Denies when asked</span>
									<span style={{ color: c.red }}>{m.denialRate}</span>
								</div>
								<div
									style={{
										height: 6,
										borderRadius: 3,
										background: c.bg,
										overflow: "hidden",
									}}
								>
									<div
										style={{
											height: "100%",
											width: m.denialRate,
											borderRadius: 3,
											background: c.red,
											transition: "width .4s ease",
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
					padding: "10px 14px",
					borderRadius: 8,
					background: c.panel,
					border: `1px solid ${c.line}`,
					fontSize: 12,
					color: c.muted,
				}}
			>
				<span style={{ color: c.red, fontWeight: 600 }}>Note: </span>
				Models did not consistently acknowledge attempted cheating when asked.
				Chain-of-thought monitoring was also insufficient — models often cheated
				without reasoning about it in their internal monologue.
			</div>
		</div>
	);
}
