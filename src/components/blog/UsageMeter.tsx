import { useEffect, useState } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const c = {
	bg: "#1a1b26",
	panel: "#24283b",
	line: "#3b4261",
	text: "#c0caf5",
	muted: "#737aa2",
	blue: "#7aa2f7",
	green: "#9ece6a",
	red: "#f7768e",
	yellow: "#e0af68",
	purple: "#bb9af7",
};

const dailyUsage = [35, 28, 55, 42, 30, 50, 10];
const weeklyLimit = 100;

const cumulative: number[] = [];
for (const val of dailyUsage) {
	const prev = cumulative[cumulative.length - 1] ?? 0;
	cumulative.push(prev + val);
}

export default function UsageMeter() {
	const [day, setDay] = useState(0);

	useEffect(() => {
		const id = setInterval(() => setDay((d) => (d + 1) % days.length), 1400);
		return () => clearInterval(id);
	}, []);

	const cum = cumulative[day] ?? 0;
	const overLimit = cum > weeklyLimit;
	const pct = Math.min(cum, 200);

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
				Weekly usage · one developer's week
			</div>

			<div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
				{days.map((d, i) => {
					const on = i === day;
					const dayCum = cumulative[i] ?? 0;
					const exceeded = dayCum > weeklyLimit;
					return (
						<div
							key={d}
							style={{
								flex: 1,
								textAlign: "center",
								padding: "6px 0",
								borderRadius: 8,
								background: on ? "rgba(122,162,247,.12)" : "transparent",
								border: `1px solid ${on ? c.blue : "transparent"}`,
								transition: "background .3s ease, border-color .3s ease",
							}}
						>
							<div
								style={{
									fontSize: 12,
									fontWeight: 600,
									color: on ? c.blue : c.muted,
									transition: "color .3s ease",
								}}
							>
								{d}
							</div>
							<div
								style={{
									marginTop: 3,
									fontSize: 14,
									fontWeight: 700,
									color: exceeded ? c.red : on ? c.text : c.muted,
									transition: "color .3s ease",
								}}
							>
								{dailyUsage[i]}%
							</div>
						</div>
					);
				})}
			</div>

			<div
				style={{
					background: c.panel,
					borderRadius: 10,
					padding: 16,
					border: `1px solid ${c.line}`,
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginBottom: 8,
						fontSize: 12,
						color: c.muted,
					}}
				>
					<span>Cumulative usage</span>
					<span>{cum.toFixed(0)}% / 100% limit</span>
				</div>
				<div
					style={{
						height: 16,
						borderRadius: 8,
						background: c.bg,
						overflow: "hidden",
						position: "relative",
					}}
				>
					<div
						style={{
							height: "100%",
							width: `${Math.min(pct, 100)}%`,
							borderRadius: 8,
							background: `linear-gradient(90deg, ${c.blue}, ${overLimit ? c.red : c.green})`,
							transition: "width .6s cubic-bezier(.2,.8,.2,1)",
							opacity: overLimit ? 0.8 : 1,
						}}
					/>
					<div
						style={{
							position: "absolute",
							top: 0,
							left: "100%",
							height: "100%",
							width: 2,
							background: c.yellow,
						}}
					/>
				</div>

				{overLimit && (
					<div
						style={{
							marginTop: 10,
							display: "flex",
							alignItems: "center",
							gap: 6,
							fontSize: 12,
							color: c.red,
						}}
					>
						<span
							style={{
								display: "inline-block",
								width: 8,
								height: 8,
								borderRadius: "50%",
								background: c.red,
							}}
						/>
						Over limit! Capacity will replenish as older sessions roll out of
						the window.
					</div>
				)}

				<div
					style={{
						marginTop: 14,
						display: "flex",
						gap: 3,
						height: 24,
						alignItems: "flex-end",
					}}
				>
					{dailyUsage.slice(0, day + 1).map((val, i) => (
						<div
							key={days[i]}
							style={{
								flex: 1,
								height: `${val}%`,
								minHeight: 4,
								borderRadius: "4px 4px 0 0",
								background: `hsl(${220 - i * 25}, 70%, ${65 - i * 6}%)`,
								opacity: i === day ? 1 : 0.6,
								transition: "opacity .3s ease",
								position: "relative",
							}}
						>
							<div
								style={{
									position: "absolute",
									bottom: "100%",
									left: "50%",
									transform: "translateX(-50%)",
									fontSize: 9,
									color: c.muted,
									whiteSpace: "nowrap",
									marginBottom: 2,
								}}
							>
								{dailyUsage[i]}%
							</div>
						</div>
					))}
				</div>
			</div>

			<div
				style={{
					marginTop: 14,
					textAlign: "center",
					fontSize: 12,
					color: c.muted,
					fontFamily: "ui-monospace, Menlo, monospace",
				}}
			>
				Usage accumulates day by day · the limit is 100% of weekly capacity
			</div>
		</div>
	);
}
