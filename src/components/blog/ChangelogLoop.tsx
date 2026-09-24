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

export default function ChangelogLoop() {
	const [mode, setMode] = useState<"before" | "after">("before");
	const [tick, setTick] = useState(0);

	useEffect(() => {
		const id = setInterval(() => setTick((t) => t + 1), 1400);
		return () => clearInterval(id);
	}, []);

	useEffect(() => {
		const id = setInterval(() => {
			setMode((m) => (m === "before" ? "after" : "before"));
			setTick(0);
		}, 6000);
		return () => clearInterval(id);
	}, []);

	const isBefore = mode === "before";
	const regens = isBefore ? (tick % 5) + 1 : 0;

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
					The changelog tax · revalidate = 60 vs build time
				</div>
				<div style={{ display: "flex", gap: 8 }}>
					{(["before", "after"] as const).map((m) => (
						<button
							type="button"
							key={m}
							onClick={() => {
								setMode(m);
								setTick(0);
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

			<div
				style={{
					display: "flex",
					gap: 16,
					alignItems: "stretch",
					minHeight: 170,
				}}
			>
				<div
					style={{
						flex: 1,
						background: c.panel,
						border: `1px solid ${c.line}`,
						borderRadius: 10,
						padding: 14,
						display: "flex",
						flexDirection: "column",
						gap: 6,
					}}
				>
					<div
						style={{
							fontSize: 10,
							fontFamily: "ui-monospace, Menlo, monospace",
							color: c.muted,
						}}
					>
						{isBefore
							? "convex/features/community/changelog"
							: "content/CHANGELOG.md"}
					</div>
					{[78, 92, 64].map((w, i) => (
						<div
							key={w}
							style={{
								height: 8,
								width: `${w}%`,
								borderRadius: 4,
								background: i === 0 ? (isBefore ? c.blue : c.green) : c.line,
								opacity: isBefore ? 1 : 0.9,
								transition: "background .4s ease",
							}}
						/>
					))}
					<div style={{ marginTop: "auto", fontSize: 10.5, color: c.muted }}>
						{isBefore
							? "79 entries in a database table"
							: "79 entries in one markdown file"}
					</div>
				</div>

				<div
					style={{
						flex: 1,
						background: c.panel,
						border: `1px solid ${regens > 0 && isBefore ? c.red : c.green}`,
						borderRadius: 10,
						padding: 14,
						display: "flex",
						flexDirection: "column",
						transition: "border-color .4s ease",
					}}
				>
					<div
						style={{
							fontSize: 10,
							fontFamily: "ui-monospace, Menlo, monospace",
							color: c.muted,
							marginBottom: 8,
						}}
					>
						{isBefore ? "/changelog · ISR" : "/changelog · ○ static"}
					</div>

					<div
						style={{
							display: "flex",
							gap: 4,
							flexWrap: "wrap",
							minHeight: 44,
							alignContent: "flex-start",
						}}
					>
						{Array.from({ length: 15 }).map((_, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: decorative fixed grid, cells never reorder
								key={i}
								style={{
									width: 12,
									height: 12,
									borderRadius: 3,
									background: isBefore && i < regens * 3 ? c.red : c.line,
									opacity: isBefore && i < regens * 3 ? 0.85 : 1,
									transition: "background .35s ease, opacity .35s ease",
								}}
							/>
						))}
					</div>

					<div
						style={{
							marginTop: "auto",
							fontSize: 20,
							fontWeight: 900,
							fontFamily: "ui-monospace, Menlo, monospace",
							color: isBefore ? c.red : c.green,
							transition: "color .4s ease",
						}}
					>
						{isBefore ? `${regens * 288}/day` : "0/day"}
					</div>
					<div style={{ fontSize: 10.5, color: c.muted }}>
						{isBefore
							? "ISR writes · page regenerates every 60s, forever"
							: "rendered once at build · visitors hit pure CDN"}
					</div>
				</div>
			</div>

			<div
				style={{
					marginTop: 12,
					textAlign: "center",
					fontSize: 11.5,
					color: c.muted,
				}}
			>
				changelog changes ~4x/month · it regenerated 1,440x/day
			</div>
		</div>
	);
}
