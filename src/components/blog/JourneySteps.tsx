import { useEffect, useState } from "react";

const steps = [
	{ label: "Write", detail: "paste a React component in the editor" },
	{
		label: "Preview",
		detail: "Sucrase compiles it — it runs live, instantly",
	},
	{ label: "Insert", detail: "drop <Name /> into your MDX post" },
	{ label: "Publish", detail: "commit the .tsx + inject the import" },
	{
		label: "Live",
		detail: "your blog builds it and it animates for readers",
	},
];

const c = {
	bg: "#1a1b26",
	panel: "#24283b",
	line: "#3b4261",
	text: "#c0caf5",
	muted: "#737aa2",
	blue: "#7aa2f7",
	purple: "#bb9af7",
	green: "#9ece6a",
};

export default function JourneySteps() {
	const [step, setStep] = useState(0);

	useEffect(() => {
		const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1500);
		return () => clearInterval(id);
	}, []);

	const currentStep = steps[step];
	if (!currentStep) return null;

	const pct = (step / (steps.length - 1)) * 100;

	return (
		<div
			style={{
				background: c.bg,
				border: `1px solid ${c.line}`,
				borderRadius: 16,
				padding: 26,
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
					marginBottom: 22,
				}}
			>
				Editor to live · in five steps
			</div>

			<div style={{ position: "relative", padding: "0 6px" }}>
				<div
					style={{
						position: "absolute",
						top: 11,
						left: 6,
						right: 6,
						height: 2,
						background: c.line,
					}}
				/>
				<div
					style={{
						position: "absolute",
						top: 11,
						left: 6,
						width: `calc(${pct}% - 12px * ${pct / 100})`,
						height: 2,
						background: `linear-gradient(90deg, ${c.blue}, ${c.purple})`,
						transition: "width .6s cubic-bezier(.2,.8,.2,1)",
					}}
				/>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						position: "relative",
					}}
				>
					{steps.map((s, i) => {
						const on = i === step;
						const done = i < step;
						return (
							<div key={s.label} style={{ textAlign: "center", width: 70 }}>
								<div
									style={{
										width: 24,
										height: 24,
										margin: "0 auto",
										borderRadius: "50%",
										background: c.bg,
										border: `2px solid ${on || done ? c.blue : c.line}`,
										color: on || done ? c.blue : c.muted,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontFamily: "ui-monospace, Menlo, monospace",
										fontSize: 11,
										fontWeight: 700,
										transition:
											"border-color .4s ease, color .4s ease, box-shadow .4s ease, transform .4s ease",
										boxShadow: on ? `0 0 14px -2px ${c.blue}` : "none",
										transform: on ? "scale(1.15)" : "scale(1)",
									}}
								>
									{done ? "✓" : i + 1}
								</div>
								<div
									style={{
										marginTop: 8,
										fontSize: 12,
										fontWeight: 600,
										color: on ? c.text : c.muted,
										transition: "color .4s ease",
									}}
								>
									{s.label}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div
				style={{
					marginTop: 22,
					padding: "12px 16px",
					borderRadius: 10,
					background: c.panel,
					border: `1px solid ${c.line}`,
					borderLeft: `3px solid ${c.green}`,
					fontSize: 13.5,
					color: c.text,
					minHeight: 20,
				}}
			>
				<span style={{ color: c.green, fontWeight: 600 }}>
					{currentStep.label}.
				</span>{" "}
				{currentStep.detail}
			</div>
		</div>
	);
}
