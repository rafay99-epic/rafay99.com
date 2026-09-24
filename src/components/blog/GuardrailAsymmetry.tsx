import { useEffect, useState } from "react";

const c = {
	bg: "#1a1b26",
	panel: "#24283b",
	line: "#3b4261",
	text: "#c0caf5",
	muted: "#737aa2",
	blue: "#7aa2f7",
	red: "#f7768e",
	green: "#9ece6a",
};

export default function GuardrailAsymmetry() {
	const [side, setSide] = useState(0);

	useEffect(() => {
		const id = setInterval(() => setSide((s) => (s + 1) % 3), 2000);
		return () => clearInterval(id);
	}, []);

	const attacker = {
		label: "Attacker agent",
		barrier: "No guardrails",
		canDo: "Exploit payloads, C2, attack commands",
		barrierColor: c.green,
		active: side === 0,
	};

	const defender = {
		label: "Defender (hosted model)",
		barrier: "Guardrails BLOCK forensic analysis",
		canDo: "Cannot submit real attack artifacts",
		barrierColor: c.red,
		active: side === 1,
	};

	const solution = {
		label: "Defender (open-weight, self-hosted)",
		barrier: "No guardrail lockout",
		canDo: "Full forensic analysis on own infra",
		barrierColor: c.green,
		active: side === 2,
	};

	const current = side === 0 ? attacker : side === 1 ? defender : solution;

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
				The asymmetry problem
			</div>

			<div style={{ display: "flex", gap: 10 }}>
				<div
					style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}
				>
					<div
						style={{
							textAlign: "center",
							fontSize: 12,
							fontWeight: 700,
							color: current.label.includes("Defender") ? c.text : c.muted,
							fontFamily: "ui-monospace, Menlo, monospace",
							opacity: current.label.includes("Defender") ? 1 : 0.5,
							transition: "color .4s ease, opacity .4s ease",
						}}
					>
						Defender
					</div>
					<div
						style={{
							flex: 1,
							border: `1px solid ${current.label.includes("Defender") ? current.barrierColor : c.line}`,
							borderRadius: 10,
							background: current.label.includes("Defender")
								? `${current.barrierColor}10`
								: c.panel,
							padding: "12px 10px",
							textAlign: "center",
							boxShadow: current.label.includes("Defender")
								? `0 0 20px -6px ${current.barrierColor}`
								: "none",
						}}
					>
						<div
							style={{
								fontSize: 12,
								fontWeight: 600,
								color: current.label.includes("Defender") ? c.text : c.muted,
								marginBottom: 6,
								transition: "color .3s ease",
							}}
						>
							{side === 1 ? "Hosted LLM API" : "Self-hosted GLM 5.2"}
						</div>
						<div
							style={{
								padding: "4px 8px",
								borderRadius: 4,
								fontSize: 10,
								fontFamily: "ui-monospace, Menlo, monospace",
								background: `${current.barrierColor}20`,
								color: current.barrierColor,
								border: `1px solid ${current.barrierColor}40`,
							}}
						>
							{side === 1
								? "BLOCKED by safety classifiers"
								: "Unrestricted access"}
						</div>
						<div
							style={{
								marginTop: 10,
								fontSize: 11,
								color: c.muted,
								fontFamily: "ui-monospace, Menlo, monospace",
							}}
						>
							{current.canDo}
						</div>
					</div>
				</div>

				<div
					style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}
				>
					<div
						style={{
							textAlign: "center",
							fontSize: 12,
							fontWeight: 700,
							color: side === 0 ? c.text : c.muted,
							fontFamily: "ui-monospace, Menlo, monospace",
							opacity: side === 0 ? 1 : 0.5,
							transition: "color .4s ease, opacity .4s ease",
						}}
					>
						Attacker
					</div>
					<div
						style={{
							flex: 1,
							border: `1px solid ${side === 0 ? c.green : c.line}`,
							borderRadius: 10,
							background: side === 0 ? `${c.green}10` : c.panel,
							padding: "12px 10px",
							textAlign: "center",
							transition:
								"border-color .4s ease, background .4s ease, box-shadow .4s ease",
							boxShadow: side === 0 ? `0 0 20px -6px ${c.green}` : "none",
						}}
					>
						<div
							style={{
								fontSize: 12,
								fontWeight: 600,
								color: side === 0 ? c.text : c.muted,
								marginBottom: 6,
								transition: "color .3s ease",
							}}
						>
							{side === 0
								? "Open-weight / jailbroken model"
								: "Attacker (uncensored)"}
						</div>
						<div
							style={{
								padding: "4px 8px",
								borderRadius: 4,
								fontSize: 10,
								fontFamily: "ui-monospace, Menlo, monospace",
								background: `${c.green}20`,
								color: c.green,
								border: `1px solid ${c.green}40`,
							}}
						>
							No restrictions
						</div>
						<div
							style={{
								marginTop: 10,
								fontSize: 11,
								color: c.muted,
								fontFamily: "ui-monospace, Menlo, monospace",
							}}
						>
							Free to run any payload
						</div>
					</div>
				</div>
			</div>

			<div
				style={{
					textAlign: "center",
					margin: "14px 0 0",
					fontSize: 12,
					color: c.muted,
					padding: "8px 12px",
					borderRadius: 8,
					background: c.panel,
					border: `1px solid ${c.line}`,
				}}
			>
				<span style={{ color: c.red, fontWeight: 600 }}>The gap: </span>
				Safety guardrails block defenders from analyzing attacks, while
				attackers face no such limits.
			</div>
		</div>
	);
}
