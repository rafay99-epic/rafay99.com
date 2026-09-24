import { useEffect, useState } from "react";

const stages = [
	{
		label: "Sandbox",
		detail: "isolated eval environment",
		icon: "⊞",
		accent: "#7aa2f7",
	},
	{
		label: "Zero-day",
		detail: "exploited package proxy vulnerability",
		icon: "⚡",
		accent: "#e0af68",
	},
	{
		label: "Open Internet",
		detail: "lateral movement + escalation",
		icon: "🌐",
		accent: "#73daca",
	},
	{
		label: "Hugging Face",
		detail: "RCE via stolen creds + zero-day chain",
		icon: "🤗",
		accent: "#bb9af7",
	},
	{
		label: "Cheat",
		detail: "stole ExploitGym answers from production DB",
		icon: "🎯",
		accent: "#f7768e",
	},
];

const c = {
	bg: "#1a1b26",
	panel: "#24283b",
	line: "#3b4261",
	text: "#c0caf5",
	muted: "#737aa2",
	blue: "#7aa2f7",
	red: "#f7768e",
};

export default function KillChain() {
	const [step, setStep] = useState(0);

	useEffect(() => {
		const id = setInterval(() => setStep((s) => (s + 1) % stages.length), 1800);
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
				Attack chain · five stages
			</div>

			<div
				style={{
					display: "flex",
					gap: 4,
					overflowX: "auto",
					padding: 14,
					margin: "-14px -14px 6px",
				}}
			>
				{stages.map((s, i) => {
					const on = i === step;
					const done = i < step;
					const fillWidth = on ? "100%" : done ? "100%" : "0%";

					return (
						<div
							key={s.label}
							style={{
								flex: 1,
								border: `1px solid ${on ? s.accent : done ? s.accent : c.line}`,
								borderRadius: 10,
								background: on
									? `${s.accent}14`
									: done
										? `${s.accent}08`
										: c.panel,
								padding: "10px 6px",
								textAlign: "center",
								transition: "box-shadow .4s ease, opacity .4s ease",
								boxShadow: on ? `0 0 20px -6px ${s.accent}` : "none",
								opacity: done ? 0.7 : 1,
							}}
						>
							<div
								style={{
									fontSize: 18,
									marginBottom: 4,
									transition: "filter .3s ease",
									filter: on ? "none" : "grayscale(0.6)",
								}}
							>
								{s.icon}
							</div>

							<div
								style={{
									fontSize: 11,
									fontWeight: 700,
									color: on ? s.accent : done ? s.accent : c.muted,
									fontFamily: "ui-monospace, Menlo, monospace",
									transition: "color .3s ease",
								}}
							>
								{s.label}
							</div>

							<div
								style={{
									marginTop: 8,
									height: 3,
									borderRadius: 2,
									background: c.bg,
									overflow: "hidden",
								}}
							>
								<div
									style={{
										height: "100%",
										width: fillWidth,
										borderRadius: 2,
										background: s.accent,
										transition: "width .5s cubic-bezier(.2,.8,.2,1)",
									}}
								/>
							</div>
						</div>
					);
				})}
			</div>

			{(() => {
				const currentStage = stages[step];
				if (!currentStage) return null;
				return (
					<div
						style={{
							padding: "12px 16px",
							borderRadius: 10,
							background: c.panel,
							border: `1px solid ${c.line}`,
							borderLeft: `3px solid ${currentStage.accent}`,
							minHeight: 44,
							display: "flex",
							alignItems: "center",
							gap: 10,
						}}
					>
						<div
							style={{
								width: 28,
								height: 28,
								borderRadius: "50%",
								background: `${currentStage.accent}20`,
								border: `1.5px solid ${currentStage.accent}`,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontFamily: "ui-monospace, Menlo, monospace",
								fontSize: 12,
								fontWeight: 700,
								color: currentStage.accent,
								flexShrink: 0,
							}}
						>
							{step + 1}
						</div>
						<div>
							<div
								style={{
									fontSize: 13,
									fontWeight: 600,
									color: currentStage.accent,
									fontFamily: "ui-monospace, Menlo, monospace",
								}}
							>
								{currentStage.label}
							</div>
							<div style={{ fontSize: 12, color: c.muted, marginTop: 1 }}>
								{currentStage.detail}
							</div>
						</div>
					</div>
				);
			})()}

			<div
				style={{
					display: "flex",
					justifyContent: "center",
					gap: 6,
					marginTop: 14,
				}}
			>
				{stages.map((s, i) => (
					<div
						key={s.label}
						style={{
							width: 8,
							height: 8,
							borderRadius: "50%",
							background:
								i === step ? s.accent : i < step ? `${s.accent}60` : c.line,
							boxShadow: i === step ? `0 0 10px 1px ${s.accent}` : "none",
							transition: "box-shadow .3s ease",
						}}
					/>
				))}
			</div>

			<div
				style={{
					marginTop: 10,
					textAlign: "center",
					fontSize: 11,
					color: c.muted,
					fontFamily: "ui-monospace, Menlo, monospace",
				}}
			>
				From sandboxed evaluation to production data in five steps
			</div>
		</div>
	);
}
