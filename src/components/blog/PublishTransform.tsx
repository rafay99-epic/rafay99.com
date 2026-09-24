import { type ReactNode, useEffect, useState } from "react";

const c = {
	bg: "#1a1b26",
	panel: "#16161e",
	line: "#3b4261",
	text: "#c0caf5",
	muted: "#737aa2",
	blue: "#7aa2f7",
	green: "#9ece6a",
	purple: "#bb9af7",
	amber: "#e0af68",
};

export default function PublishTransform() {
	const [shipped, setShipped] = useState(false);

	useEffect(() => {
		const id = setInterval(() => setShipped((s) => !s), 2200);
		return () => clearInterval(id);
	}, []);

	const mono = "ui-monospace, Menlo, monospace";

	const line = (content: ReactNode, visible: boolean, color: string) => (
		<div
			style={{
				fontFamily: mono,
				fontSize: 12.5,
				color,
				lineHeight: 1.9,
				maxHeight: visible ? 30 : 0,
				opacity: visible ? 1 : 0,
				overflow: "hidden",
				transition: "max-height .5s ease, opacity .5s ease",
				whiteSpace: "nowrap",
			}}
		>
			{content}
		</div>
	);

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
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 16,
				}}
			>
				<span
					style={{
						fontFamily: mono,
						fontSize: 11,
						letterSpacing: ".18em",
						textTransform: "uppercase",
						color: c.muted,
					}}
				>
					Publish transform
				</span>
				<span
					style={{
						fontFamily: mono,
						fontSize: 11,
						padding: "3px 10px",
						borderRadius: 999,
						border: `1px solid ${shipped ? c.green : c.purple}`,
						color: shipped ? c.green : c.purple,
						transition: "border-color .4s ease, color .4s ease",
					}}
				>
					{shipped ? "what ships →" : "what you wrote"}
				</span>
			</div>

			<div
				style={{
					border: `1px solid ${c.line}`,
					borderRadius: 10,
					background: c.panel,
					padding: "14px 16px",
				}}
			>
				<div
					style={{
						fontSize: 10.5,
						color: c.muted,
						marginBottom: 8,
						fontFamily: mono,
					}}
				>
					content/blog/post.mdx
				</div>
				{line(
					<span>
						<span style={{ color: c.purple }}>import</span> Pulse{" "}
						<span style={{ color: c.purple }}>from</span>{" "}
						<span style={{ color: c.green }}>
							"../../components/blog/Pulse"
						</span>
						;
					</span>,
					shipped,
					c.text,
				)}
				{line(<span style={{ color: c.muted }}>&nbsp;</span>, shipped, c.muted)}
				<div
					style={{
						fontFamily: mono,
						fontSize: 12.5,
						lineHeight: 1.9,
						color: c.muted,
					}}
				>
					# How the harness works
				</div>
				<div
					style={{
						fontFamily: mono,
						fontSize: 12.5,
						lineHeight: 1.9,
						color: c.text,
					}}
				>
					{"<Pulse"}
					<span
						style={{
							color: c.blue,
							maxWidth: shipped ? 120 : 0,
							opacity: shipped ? 1 : 0,
							display: "inline-block",
							overflow: "hidden",
							verticalAlign: "bottom",
							transition: "max-width .5s ease, opacity .5s ease",
							whiteSpace: "nowrap",
						}}
					>
						{" client:visible"}
					</span>
					{" />"}
				</div>
			</div>

			<div
				style={{
					marginTop: 10,
					border: `1px solid ${shipped ? c.green : c.line}`,
					borderRadius: 10,
					background: c.panel,
					padding: "12px 16px",
					opacity: shipped ? 1 : 0.4,
					transform: `translateY(${shipped ? 0 : 6}px)`,
					transition:
						"border-color .5s ease, opacity .5s ease, transform .5s ease",
				}}
			>
				<div style={{ fontSize: 10.5, color: c.muted, fontFamily: mono }}>
					src/components/blog/Pulse.tsx
				</div>
				<div
					style={{
						fontFamily: mono,
						fontSize: 11.5,
						color: c.amber,
						marginTop: 4,
					}}
				>
					{"/* wryte:managed */"} · committed alongside
				</div>
			</div>
		</div>
	);
}
