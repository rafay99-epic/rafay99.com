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
	yellow: "#e0af68",
	orange: "#ff9e64",
	teal: "#73daca",
	purple: "#bb9af7",
};

const sessions = [
	{ label: "Mon", hours: 2.5, type: "past" },
	{ label: "Tue", hours: 1.8, type: "past" },
	{ label: "Wed", hours: 4.0, type: "past" },
	{ label: "Thu", hours: 0.5, type: "past" },
	{ label: "Fri", hours: 3.2, type: "past" },
	{ label: "Sat", hours: 0, type: "past" },
	{ label: "Sun", hours: 0, type: "past" },
	{ label: "Mon", hours: 0, type: "future" },
	{ label: "Tue", hours: 0, type: "future" },
	{ label: "Wed", hours: 0, type: "future" },
	{ label: "Thu", hours: 0, type: "future" },
	{ label: "Fri", hours: 0, type: "future" },
	{ label: "Sat", hours: 0, type: "future" },
	{ label: "Sun", hours: 0, type: "future" },
];

export default function SessionCalendar() {
	const [day, setDay] = useState(0);

	const windowLength = 5;
	const windowStart = Math.min(day, 4);

	const visibleSessions = sessions.slice(windowStart, windowStart + 7);
	const consumed = visibleSessions.reduce((sum, s) => sum + s.hours, 0);
	const available = Math.max(0, windowLength - consumed);
	const pct = Math.min((consumed / windowLength) * 100, 100);

	useEffect(() => {
		const id = setInterval(() => setDay((d) => (d + 1) % 10), 1600);
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
				Rolling window · sessions age out over time
			</div>

			<div style={{ position: "relative", marginBottom: 20 }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						padding: "0 4px",
						marginBottom: 6,
					}}
				>
					<div
						style={{
							fontSize: 10,
							fontFamily: "ui-monospace, Menlo, monospace",
							color: c.blue,
							padding: "2px 8px",
							borderRadius: 4,
							border: `1px solid ${c.blue}`,
							background: "rgba(122,162,247,.08)",
						}}
					>
						Rolling window →
					</div>
				</div>

				<div
					style={{
						display: "flex",
						gap: 3,
						position: "relative",
						overflowX: "auto",
						padding: 14,
						margin: -14,
					}}
				>
					{sessions.map((s, i) => {
						const inWindow = i >= windowStart && i < windowStart + 7;
						const isActive = i === day;
						const consumedHours = s.hours;

						return (
							<div
								key={`${s.label}-${s.type}`}
								style={{
									flex: 1,
									textAlign: "center",
									opacity: inWindow ? 1 : 0.3,
									transition: "opacity .4s ease",
								}}
							>
								<div
									style={{
										fontSize: 10,
										color: isActive ? c.blue : c.muted,
										fontWeight: isActive ? 700 : 400,
										fontFamily: "ui-monospace, Menlo, monospace",
										marginBottom: 4,
										transition: "color .3s ease",
									}}
								>
									{s.label}
								</div>

								<div
									style={{
										height: 40,
										borderRadius: 6,
										background: c.panel,
										border: `1px solid ${isActive ? c.blue : c.line}`,
										overflow: "hidden",
										position: "relative",
										transition: "border-color .3s ease, box-shadow .3s ease",
										boxShadow: isActive ? `0 0 16px -4px ${c.blue}` : "none",
									}}
								>
									<div
										style={{
											position: "absolute",
											bottom: 0,
											left: 0,
											right: 0,
											height: `${(consumedHours / 4) * 100}%`,
											background:
												consumedHours > 3
													? c.red
													: consumedHours > 2
														? c.orange
														: c.blue,
											borderRadius: "0 0 4px 4px",
											transition: "height .5s ease",
											opacity: 0.7,
										}}
									/>
								</div>

								<div
									style={{
										marginTop: 3,
										fontSize: 9,
										color:
											consumedHours > 3
												? c.red
												: consumedHours > 0
													? c.text
													: c.muted,
										fontFamily: "ui-monospace, Menlo, monospace",
									}}
								>
									{consumedHours > 0 ? `${consumedHours}h` : "—"}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div
				style={{
					background: c.panel,
					borderRadius: 10,
					padding: 14,
					border: `1px solid ${c.line}`,
					display: "flex",
					gap: 16,
					alignItems: "center",
				}}
			>
				<div
					style={{
						width: 64,
						height: 64,
						borderRadius: "50%",
						border: `3px solid ${c.line}`,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexShrink: 0,
						position: "relative",
					}}
				>
					<div
						style={{
							position: "absolute",
							inset: -3,
							borderRadius: "50%",
							border: `3px solid transparent`,
							borderTopColor: available > 0 ? c.green : c.red,
							borderRightColor: available > 0 ? c.green : c.red,
							transform: `rotate(${pct * 1.8}deg)`,
							transition: "transform .6s ease",
						}}
					/>
					<div
						style={{
							fontSize: 16,
							fontWeight: 900,
							color: available > 0 ? c.green : c.red,
							fontFamily: "ui-monospace, Menlo, monospace",
						}}
					>
						{available.toFixed(1)}
					</div>
				</div>

				<div style={{ flex: 1 }}>
					<div
						style={{
							fontSize: 13,
							fontWeight: 600,
							marginBottom: 4,
							color: c.text,
						}}
					>
						{available > 0
							? `${available.toFixed(1)}h remaining in window`
							: "Window exhausted"}
					</div>
					<div style={{ fontSize: 11.5, color: c.muted }}>
						{consumed.toFixed(1)}h consumed · {windowLength}h total window ·
						capacity replenishes as older sessions age out
					</div>
					<div
						style={{
							marginTop: 8,
							height: 4,
							borderRadius: 2,
							background: c.bg,
							overflow: "hidden",
						}}
					>
						<div
							style={{
								height: "100%",
								width: `${pct}%`,
								borderRadius: 2,
								background: available > 0 ? c.green : c.red,
								transition: "width .5s ease",
							}}
						/>
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
				Sessions are a rolling window, not a monthly bucket · old usage falls
				out, new capacity opens up
			</div>
		</div>
	);
}
