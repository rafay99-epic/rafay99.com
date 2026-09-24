import { useEffect, useState } from "react";

const tools = [
	{
		name: "Claude Code",
		color: "#bb9af7",
		tiers: [
			{ label: "Pro", price: 20, x: 20 },
			{ label: "Max", price: 100, x: 100 },
			{ label: "Max", price: 200, x: 200 },
		],
	},
	{
		name: "Cursor",
		color: "#7aa2f7",
		tiers: [
			{ label: "Hobby", price: 0, x: 0 },
			{ label: "Pro", price: 20, x: 20 },
			{ label: "Pro+", price: 60, x: 60 },
			{ label: "Ultra", price: 200, x: 200 },
		],
	},
	{
		name: "Copilot",
		color: "#73daca",
		tiers: [
			{ label: "Free", price: 0, x: 0 },
			{ label: "Pro", price: 10, x: 10 },
			{ label: "Pro+", price: 39, x: 39 },
			{ label: "Biz", price: 19, x: 19 },
		],
	},
	{
		name: "Windsurf",
		color: "#e0af68",
		tiers: [
			{ label: "Free", price: 0, x: 0 },
			{ label: "Pro", price: 15, x: 15 },
			{ label: "Max", price: 200, x: 200 },
		],
	},
	{
		name: "Codex",
		color: "#f7768e",
		tiers: [
			{ label: "Free", price: 0, x: 0 },
			{ label: "Go", price: 8, x: 8 },
			{ label: "Plus", price: 20, x: 20 },
			{ label: "Pro", price: 100, x: 100 },
			{ label: "Pro", price: 200, x: 200 },
		],
	},
	{
		name: "Cmd Code",
		color: "#9ece6a",
		tiers: [
			{ label: "Go", price: 1, x: 1 },
			{ label: "Pro", price: 15, x: 15 },
			{ label: "Max", price: 100, x: 100 },
		],
	},
	{
		name: "OpenCode",
		color: "#ff9e64",
		tiers: [
			{ label: "Go", price: 5, x: 5 },
			{ label: "Go", price: 10, x: 10 },
			{ label: "Zen", price: 20, x: 20 },
		],
	},
	{
		name: "Gemini CLI",
		color: "#73daca",
		tiers: [{ label: "Free", price: 0, x: 0 }],
	},
];

const c = {
	bg: "#1a1b26",
	panel: "#24283b",
	line: "#3b4261",
	text: "#c0caf5",
	muted: "#737aa2",
};

const markers = [0, 20, 50, 100, 200];

export default function PricingLandscape() {
	const [focus, setFocus] = useState(0);

	const maxPrice = 200;

	useEffect(() => {
		const id = setInterval(() => setFocus((f) => (f + 1) % tools.length), 2200);
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
				The pricing landscape · every tool on one spectrum
			</div>

			<div style={{ position: "relative", marginBottom: 16 }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginBottom: 4,
						paddingRight: 8,
					}}
				>
					{markers.map((m) => (
						<div
							key={m}
							style={{
								fontSize: 10,
								color: c.muted,
								fontFamily: "ui-monospace, Menlo, monospace",
							}}
						>
							${m}
						</div>
					))}
				</div>
				<div
					style={{
						height: 1,
						background: `linear-gradient(90deg, ${c.line}, ${c.muted})`,
						position: "relative",
					}}
				>
					{markers.map((m) => (
						<div
							key={m}
							style={{
								position: "absolute",
								left: `${(m / maxPrice) * 100}%`,
								top: -3,
								width: 1,
								height: 7,
								background: c.line,
							}}
						/>
					))}
				</div>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
				{tools.map((tool, ti) => {
					const isFocused = ti === focus;
					return (
						<div
							key={tool.name}
							style={{
								position: "relative",
								padding: "6px 0",
								opacity: isFocused ? 1 : 0.5,
								transition: "opacity .5s ease",
							}}
						>
							<div
								style={{
									position: "absolute",
									left: -2,
									top: -2,
									fontSize: 10,
									fontWeight: 600,
									color: tool.color,
									fontFamily: "ui-monospace, Menlo, monospace",
									transition: "opacity .4s ease, text-shadow .4s ease",
									opacity: isFocused ? 1 : 0.5,
									textShadow: isFocused ? `0 0 12px ${tool.color}44` : "none",
									whiteSpace: "nowrap",
								}}
							>
								{tool.name}
							</div>

							<div style={{ position: "relative", height: 24, marginTop: 14 }}>
								<div
									style={{
										position: "absolute",
										top: "50%",
										left: 0,
										right: 0,
										height: 1,
										background: c.line,
										transform: "translateY(-50%)",
									}}
								/>

								{tool.tiers.map((tier, i) => {
									const px = (tier.x / maxPrice) * 100;
									return (
										<div
											key={`${tier.label}-${tier.price}`}
											style={{
												position: "absolute",
												left: `${px}%`,
												top: "50%",
												transform: "translate(-50%, -50%)",
											}}
										>
											<div
												style={{
													width: 10,
													height: 10,
													borderRadius: "50%",
													background: tool.color,
													boxShadow:
														isFocused && i === 0
															? `0 0 12px 2px ${tool.color}`
															: "none",
													transition: "transform .3s ease",
													transform: isFocused ? "scale(1.3)" : "scale(1)",
												}}
											/>
											<div
												style={{
													position: "absolute",
													top: "100%",
													left: "50%",
													transform: "translateX(-50%)",
													marginTop: 4,
													fontSize: 9,
													fontFamily: "ui-monospace, Menlo, monospace",
													color: c.muted,
													whiteSpace: "nowrap",
													opacity: isFocused ? 1 : 0.4,
													transition: "opacity .3s ease",
												}}
											>
												{tier.label} ${tier.price}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>

			<div
				style={{
					marginTop: 14,
					textAlign: "center",
					fontSize: 12,
					color: c.muted,
				}}
			>
				Each marker is a plan tier · the x-axis is monthly price from $0 to $200
			</div>
		</div>
	);
}
