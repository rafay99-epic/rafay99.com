import { useEffect, useState } from "react";

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

const home = (label: string, sub: string, accent: string, active: boolean) => (
	<div
		style={{
			flex: 1,
			border: `1px solid ${active ? accent : c.line}`,
			borderRadius: 12,
			background: c.panel,
			padding: "16px 18px",
			transition: "border-color .5s ease, box-shadow .5s ease",
			boxShadow: active ? `0 0 24px -8px ${accent}` : "none",
		}}
	>
		<div
			style={{
				fontFamily: "ui-monospace, Menlo, monospace",
				fontSize: 10,
				letterSpacing: ".16em",
				textTransform: "uppercase",
				color: active ? accent : c.muted,
				transition: "color .5s ease",
				marginBottom: 8,
			}}
		>
			{label}
		</div>
		<div style={{ fontSize: 13, color: c.text, fontWeight: 600 }}>{sub}</div>
		<div
			style={{
				marginTop: 10,
				height: 6,
				borderRadius: 3,
				background: c.bg,
				overflow: "hidden",
			}}
		>
			<div
				style={{
					height: "100%",
					width: active ? "100%" : "0%",
					background: accent,
					transition: "width .8s cubic-bezier(.2,.8,.2,1)",
				}}
			/>
		</div>
	</div>
);

export default function TwoHomes() {
	const [beat, setBeat] = useState(0);

	useEffect(() => {
		const id = setInterval(() => setBeat((b) => (b + 1) % 2), 1600);
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
					marginBottom: 16,
				}}
			>
				One source · two homes
			</div>

			<div
				style={{
					margin: "0 auto 6px",
					maxWidth: 260,
					textAlign: "center",
					border: `1px solid ${c.purple}`,
					borderRadius: 10,
					background: "rgba(187,154,247,.08)",
					padding: "8px 14px",
					fontFamily: "ui-monospace, Menlo, monospace",
					fontSize: 13,
					color: c.purple,
				}}
			>
				{"<Pulse />"} · source
			</div>

			<div
				style={{
					display: "flex",
					justifyContent: "space-around",
					height: 26,
					position: "relative",
				}}
			>
				{[0, 1].map((i) => (
					<div
						key={i}
						style={{
							width: 8,
							height: 8,
							borderRadius: "50%",
							background: beat === i ? c.blue : c.line,
							boxShadow: beat === i ? `0 0 12px 2px ${c.blue}` : "none",
							transform: `translateY(${beat === i ? 12 : 0}px)`,
							transition:
								"background .6s cubic-bezier(.5,0,.4,1), box-shadow .6s cubic-bezier(.5,0,.4,1), transform .6s cubic-bezier(.5,0,.4,1)",
						}}
					/>
				))}
			</div>

			<div style={{ display: "flex", gap: 14 }}>
				{home("Editor · Convex", "in-browser eval", c.blue, beat === 0)}
				{home("Repo · .tsx", "compiled at build", c.green, beat === 1)}
			</div>

			<div
				style={{
					marginTop: 14,
					textAlign: "center",
					fontSize: 12.5,
					color: c.muted,
				}}
			>
				renders NOW while you write · and again on the live site
			</div>
		</div>
	);
}
