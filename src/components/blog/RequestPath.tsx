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
};

type Node = {
	label: string;
	sub?: string;
	hot?: boolean;
};

const beforeNodes: Node[] = [
	{ label: "browser", sub: "GET /p/a1b2c3" },
	{ label: "middleware", sub: "Clerk · cookie parse + JWT verify", hot: true },
	{ label: "function", sub: "route handler · dynamic", hot: true },
	{ label: "ListObjectsV2", sub: "resolve title from key", hot: true },
	{ label: "GetObject", sub: "900 KB buffered to string", hot: true },
	{ label: "re-encode", sub: "decode + two copies of CPU", hot: true },
];

const afterNodes: Node[] = [
	{ label: "browser", sub: "GET /p/a1b2c3" },
	{ label: "edge cache", sub: "s-maxage=60 · SWR=86400" },
	{ label: "function", sub: "only on cache miss" },
	{ label: "GetObject", sub: "streamed, never buffered" },
];

export default function RequestPath() {
	const [mode, setMode] = useState<"before" | "after">("before");
	const [active, setActive] = useState(0);

	const nodes = mode === "before" ? beforeNodes : afterNodes;

	useEffect(() => {
		const id = setInterval(
			() => {
				setActive((a) => (a + 1) % nodes.length);
			},
			mode === "before" ? 700 : 900,
		);
		return () => clearInterval(id);
	}, [mode, nodes.length]);

	useEffect(() => {
		const id = setInterval(() => {
			setMode((m) => (m === "before" ? "after" : "before"));
			setActive(0);
		}, 6500);
		return () => clearInterval(id);
	}, []);

	const billed = nodes[active]?.hot ? 1 : 0;

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
					marginBottom: 18,
				}}
			>
				<div
					style={{
						fontFamily: "ui-monospace, Menlo, monospace",
						fontSize: 11,
						letterSpacing: ".18em",
						textTransform: "uppercase",
						color: c.muted,
					}}
				>
					One view of /p/&#60;id&#62;
				</div>
				<div style={{ display: "flex", gap: 8 }}>
					{(["before", "after"] as const).map((m) => (
						<button
							type="button"
							key={m}
							onClick={() => {
								if (m !== mode) {
									setMode(m);
									setActive(0);
								}
							}}
							style={{
								fontSize: 11,
								fontFamily: "ui-monospace, Menlo, monospace",
								padding: "4px 10px",
								borderRadius: 6,
								cursor: "pointer",
								border: `1px solid ${mode === m ? c.blue : c.line}`,
								background: mode === m ? "rgba(122,162,247,.12)" : c.bg,
								color: mode === m ? c.blue : c.muted,
							}}
						>
							{m}
						</button>
					))}
				</div>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
				{nodes.map((n, i) => (
					<div
						key={n.label}
						style={{ display: "flex", alignItems: "center", gap: 10 }}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							<div
								style={{
									width: 10,
									height: 10,
									borderRadius: "50%",
									background:
										i === active
											? n.hot
												? c.red
												: i === 0
													? c.blue
													: c.green
											: c.line,
									boxShadow:
										i === active
											? `0 0 12px -2px ${n.hot ? c.red : c.green}`
											: "none",
								}}
							/>
						</div>
						<div
							style={{
								flex: 1,
								display: "flex",
								justifyContent: "space-between",
								alignItems: "baseline",
								padding: "8px 12px",
								borderRadius: 8,
								background: c.panel,
								border: `1px solid ${i === active ? (n.hot ? c.red : c.green) : c.line}`,
								opacity: i === active ? 1 : i < active ? 0.75 : 0.4,
								transition: "border-color .3s ease, opacity .3s ease",
							}}
						>
							<span
								style={{
									fontFamily: "ui-monospace, Menlo, monospace",
									fontSize: 12.5,
									fontWeight: i === active ? 700 : 400,
								}}
							>
								{n.label}
							</span>
							<span style={{ fontSize: 10.5, color: c.muted }}>{n.sub}</span>
						</div>
					</div>
				))}
			</div>

			<div
				style={{
					marginTop: 14,
					display: "flex",
					justifyContent: "space-between",
					fontSize: 11.5,
					color: c.muted,
				}}
			>
				<span>
					{mode === "before"
						? "every refresh and every Slack unfurl replays all six steps"
						: "edge absorbs the repeats · origin sees ~1 hit per page per minute"}
				</span>
				<span
					style={{
						fontFamily: "ui-monospace, Menlo, monospace",
						color: mode === "before" && billed ? c.red : c.green,
					}}
				>
					{mode === "before" ? "billed at every step" : "mostly free"}
				</span>
			</div>
		</div>
	);
}
