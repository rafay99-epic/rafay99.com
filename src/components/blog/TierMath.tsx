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

const plans = [
	{
		name: "Hobby · $0",
		cpu: "4h fluid CPU",
		invocations: "1M functions",
		writes: "200k ISR writes",
		transfer: "100 GB fast data",
		verdict: "fixed now, one HN front page from the cap",
		color: c.orange,
	},
	{
		name: "Pro · $20/mo",
		cpu: "20h fluid CPU",
		invocations: "1M included, then metered",
		writes: "1M ISR writes",
		transfer: "1 TB fast data",
		verdict: "buy before the launch, not during",
		color: c.green,
	},
];

export default function TierMath() {
	const [sel, setSel] = useState(0);

	useEffect(() => {
		const id = setInterval(() => setSel((s) => (s + 1) % plans.length), 3500);
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
				The two honest options after optimizing
			</div>

			<div style={{ display: "flex", gap: 14 }}>
				{plans.map((p, i) => (
					<button
						type="button"
						key={p.name}
						onClick={() => setSel(i)}
						style={{
							flex: 1,
							fontFamily: "inherit",
							textAlign: "left",
							background: c.panel,
							border: `1px solid ${sel === i ? p.color : c.line}`,
							borderRadius: 12,
							padding: 16,
							cursor: "pointer",
							opacity: sel === i ? 1 : 0.55,
							transition: "border-color .4s ease, opacity .4s ease",
						}}
					>
						<div
							style={{
								fontSize: 14,
								fontWeight: 700,
								marginBottom: 10,
								color: sel === i ? p.color : c.text,
								transition: "color .3s ease",
							}}
						>
							{p.name}
						</div>
						{[
							["fluid cpu", p.cpu],
							["functions", p.invocations],
							["isr writes", p.writes],
							["data transfer", p.transfer],
						].map(([k, v]) => (
							<div
								key={k}
								style={{
									display: "flex",
									justifyContent: "space-between",
									fontSize: 11.5,
									padding: "4px 0",
									borderBottom: `1px solid ${c.line}`,
								}}
							>
								<span style={{ color: c.muted }}>{k}</span>
								<span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
									{v}
								</span>
							</div>
						))}
						<div
							style={{
								marginTop: 12,
								fontSize: 11.5,
								fontStyle: "italic",
								color: p.color,
							}}
						>
							{p.verdict}
						</div>
					</button>
				))}
			</div>

			<div
				style={{
					marginTop: 14,
					textAlign: "center",
					fontSize: 11.5,
					color: c.muted,
				}}
			>
				waste is waste at any tier · optimize first, then pay for traffic you
				actually want
			</div>
		</div>
	);
}
