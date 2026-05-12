import { memo, useCallback, useEffect, useRef, useState } from "react";

interface DiffEntry {
	type: "added" | "removed" | "unchanged";
	leftNum: number | undefined;
	rightNum: number | undefined;
	leftHtml: string | undefined;
	rightHtml: string | undefined;
}

interface CodeCompareUIProps {
	entries: DiffEntry[];
	title1: string;
	title2: string;
	raw1: string;
	raw2: string;
	lang1: string;
	lang2: string;
}

const COLLAPSE_THRESHOLD = 5;
const CONTEXT_LINES = 2;

const c = {
	bg: "#1a1b26",
	bgPanel: "#24283b",
	border: "#414868",
	borderHover: "#565f89",
	text: "#a9b1d6",
	textBright: "#c0caf5",
	textMuted: "#565f89",
	accent: "#7aa2f7",
	accentSoft: "rgba(122,162,247,0.12)",
	addedBg: "rgba(158,206,106,0.14)",
	addedGutter: "rgba(158,206,106,0.22)",
	addedIndicator: "#9ece6a",
	removedBg: "rgba(247,118,142,0.14)",
	removedGutter: "rgba(247,118,142,0.22)",
	removedIndicator: "#f7768e",
	lineNum: "#565f89",
	hoverBg: "rgba(122,162,247,0.06)",
	collapseBg: "rgba(122,162,247,0.04)",
	collapseBorder: "rgba(122,162,247,0.15)",
} as const;

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			style={{
				background: copied ? "rgba(158,206,106,0.15)" : c.accentSoft,
				color: copied ? "#9ece6a" : c.textMuted,
				border: `1px solid ${copied ? "rgba(158,206,106,0.3)" : c.border}`,
				borderRadius: 6,
				padding: "4px 10px",
				fontSize: 12,
				fontWeight: 500,
				cursor: "pointer",
				transition: "all 0.2s ease",
			}}
		>
			{copied ? "Copied" : "Copy"}
		</button>
	);
}

interface SplitRow {
	leftNum: number | undefined;
	rightNum: number | undefined;
	leftHtml: string | undefined;
	rightHtml: string | undefined;
	leftType: "removed" | "unchanged" | "empty";
	rightType: "added" | "unchanged" | "empty";
}

type DisplayRow =
	| { kind: "row"; row: SplitRow; idx: number }
	| { kind: "collapse"; count: number; startIdx: number; rows: SplitRow[] };

type DisplayEntry =
	| { kind: "entry"; entry: DiffEntry; idx: number }
	| { kind: "collapse"; count: number; startIdx: number; entries: DiffEntry[] };

function getEntry(entries: DiffEntry[], idx: number): DiffEntry | undefined {
	return entries[idx];
}

function getRow(rows: SplitRow[], idx: number): SplitRow {
	const row = rows[idx];
	return (
		row ?? {
			leftNum: undefined,
			rightNum: undefined,
			leftHtml: undefined,
			rightHtml: undefined,
			leftType: "empty" as const,
			rightType: "empty" as const,
		}
	);
}

function getEntryAt(entries: DiffEntry[], idx: number): DiffEntry {
	const entry = entries[idx];
	return (
		entry ?? {
			type: "unchanged" as const,
			leftNum: undefined,
			rightNum: undefined,
			leftHtml: undefined,
			rightHtml: undefined,
		}
	);
}

function buildSplitRows(entries: DiffEntry[]): SplitRow[] {
	const rows: SplitRow[] = [];

	let i = 0;
	while (i < entries.length) {
		const entry = getEntry(entries, i);
		if (!entry) break;

		if (entry.type === "unchanged") {
			rows.push({
				leftNum: entry.leftNum ?? undefined,
				rightNum: entry.rightNum ?? undefined,
				leftHtml: entry.leftHtml ?? undefined,
				rightHtml: entry.rightHtml ?? undefined,
				leftType: "unchanged",
				rightType: "unchanged",
			});
			i++;
		} else if (entry.type === "removed") {
			const removedBlock: DiffEntry[] = [];
			while (i < entries.length && getEntry(entries, i)?.type === "removed") {
				const e = getEntry(entries, i);
				if (e) removedBlock.push(e);
				i++;
			}
			const addedBlock: DiffEntry[] = [];
			while (i < entries.length && getEntry(entries, i)?.type === "added") {
				const e = getEntry(entries, i);
				if (e) addedBlock.push(e);
				i++;
			}
			const max = Math.max(removedBlock.length, addedBlock.length);
			for (let j = 0; j < max; j++) {
				const rem = removedBlock[j];
				const add = addedBlock[j];
				rows.push({
					leftNum: rem?.leftNum ?? undefined,
					rightNum: add?.rightNum ?? undefined,
					leftHtml: rem?.leftHtml ?? undefined,
					rightHtml: add?.rightHtml ?? undefined,
					leftType: rem ? "removed" : "empty",
					rightType: add ? "added" : "empty",
				});
			}
		} else {
			const addedBlock: DiffEntry[] = [];
			while (i < entries.length && getEntry(entries, i)?.type === "added") {
				const e = getEntry(entries, i);
				if (e) addedBlock.push(e);
				i++;
			}
			for (const add of addedBlock) {
				rows.push({
					leftNum: undefined,
					rightNum: add.rightNum ?? undefined,
					leftHtml: undefined,
					rightHtml: add.rightHtml ?? undefined,
					leftType: "empty",
					rightType: "added",
				});
			}
		}
	}
	return rows;
}

function collapseSplitRows(rows: SplitRow[]): DisplayRow[] {
	const result: DisplayRow[] = [];
	let i = 0;
	while (i < rows.length) {
		const row = rows[i];
		if (!row) break;
		if (row.leftType === "unchanged" && row.rightType === "unchanged") {
			const runStart = i;
			while (i < rows.length) {
				const r = rows[i];
				if (!r || r.leftType !== "unchanged" || r.rightType !== "unchanged")
					break;
				i++;
			}
			const runLen = i - runStart;
			if (runLen > COLLAPSE_THRESHOLD + CONTEXT_LINES * 2) {
				for (let k = 0; k < CONTEXT_LINES; k++) {
					result.push({
						kind: "row",
						row: getRow(rows, runStart + k),
						idx: runStart + k,
					});
				}
				const collapseStart = runStart + CONTEXT_LINES;
				const collapseEnd = i - CONTEXT_LINES;
				result.push({
					kind: "collapse",
					count: collapseEnd - collapseStart,
					startIdx: collapseStart,
					rows: rows.slice(collapseStart, collapseEnd),
				});
				for (let k = i - CONTEXT_LINES; k < i; k++) {
					result.push({ kind: "row", row: getRow(rows, k), idx: k });
				}
			} else {
				for (let k = runStart; k < i; k++) {
					result.push({ kind: "row", row: getRow(rows, k), idx: k });
				}
			}
		} else {
			result.push({ kind: "row", row, idx: i });
			i++;
		}
	}
	return result;
}

function collapseEntries(entries: DiffEntry[]): DisplayEntry[] {
	const result: DisplayEntry[] = [];
	let i = 0;
	while (i < entries.length) {
		const entry = entries[i];
		if (!entry) break;
		if (entry.type === "unchanged") {
			const runStart = i;
			while (i < entries.length && entries[i]?.type === "unchanged") {
				i++;
			}
			const runLen = i - runStart;
			if (runLen > COLLAPSE_THRESHOLD + CONTEXT_LINES * 2) {
				for (let k = 0; k < CONTEXT_LINES; k++) {
					result.push({
						kind: "entry",
						entry: getEntryAt(entries, runStart + k),
						idx: runStart + k,
					});
				}
				const collapseStart = runStart + CONTEXT_LINES;
				const collapseEnd = i - CONTEXT_LINES;
				result.push({
					kind: "collapse",
					count: collapseEnd - collapseStart,
					startIdx: collapseStart,
					entries: entries.slice(collapseStart, collapseEnd),
				});
				for (let k = i - CONTEXT_LINES; k < i; k++) {
					result.push({ kind: "entry", entry: getEntryAt(entries, k), idx: k });
				}
			} else {
				for (let k = runStart; k < i; k++) {
					result.push({ kind: "entry", entry: getEntryAt(entries, k), idx: k });
				}
			}
		} else {
			result.push({ kind: "entry", entry, idx: i });
			i++;
		}
	}
	return result;
}

function lineBackground(type: "removed" | "added" | "unchanged" | "empty") {
	if (type === "removed") return c.removedBg;
	if (type === "added") return c.addedBg;
	return "transparent";
}

function gutterBackground(type: "removed" | "added" | "unchanged" | "empty") {
	if (type === "removed") return c.removedGutter;
	if (type === "added") return c.addedGutter;
	return "transparent";
}

function CollapseBar({
	count,
	onExpand,
	colSpan,
}: {
	count: number;
	onExpand: () => void;
	colSpan: number;
}) {
	return (
		<tr>
			<td
				colSpan={colSpan}
				style={{
					background: c.collapseBg,
					borderTop: `1px solid ${c.collapseBorder}`,
					borderBottom: `1px solid ${c.collapseBorder}`,
					padding: "4px 16px",
					textAlign: "center",
				}}
			>
				<button
					type="button"
					onClick={onExpand}
					style={{
						background: "none",
						border: "none",
						color: c.accent,
						fontSize: 12,
						fontWeight: 500,
						cursor: "pointer",
						fontFamily: "inherit",
						padding: "2px 8px",
					}}
				>
					&#x25BC; Show {count} hidden lines &#x25BC;
				</button>
			</td>
		</tr>
	);
}

function SplitView({
	entries,
	title1,
	title2,
	raw1,
	raw2,
	lang1,
	lang2,
	isFullScreen = false,
}: {
	entries: DiffEntry[];
	title1: string;
	title2: string;
	raw1: string;
	raw2: string;
	lang1: string;
	lang2: string;
	isFullScreen?: boolean;
}) {
	const rows = buildSplitRows(entries);
	const collapsed = collapseSplitRows(rows);
	const [expanded, setExpanded] = useState<Set<number>>(new Set());

	const leftRef = useRef<HTMLDivElement>(null);
	const rightRef = useRef<HTMLDivElement>(null);
	const syncing = useRef(false);

	const handleScroll = useCallback((source: "left" | "right") => {
		if (syncing.current) return;
		syncing.current = true;
		const from = source === "left" ? leftRef.current : rightRef.current;
		const to = source === "left" ? rightRef.current : leftRef.current;
		if (from && to) {
			to.scrollTop = from.scrollTop;
			to.scrollLeft = from.scrollLeft;
		}
		requestAnimationFrame(() => {
			syncing.current = false;
		});
	}, []);

	const toggleExpand = useCallback((startIdx: number) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(startIdx)) next.delete(startIdx);
			else next.add(startIdx);
			return next;
		});
	}, []);

	const renderRow = (row: SplitRow, idx: number, side: "left" | "right") => {
		const type = side === "left" ? row.leftType : row.rightType;
		const num = side === "left" ? row.leftNum : row.rightNum;
		const html = side === "left" ? row.leftHtml : row.rightHtml;
		const indicator =
			type === "removed" ? (
				<span style={{ color: c.removedIndicator }}>−</span>
			) : type === "added" ? (
				<span style={{ color: c.addedIndicator }}>+</span>
			) : (
				""
			);

		return (
			<tr
				key={`${side}-${num ?? "e"}-${idx}`}
				className="cc-diff-row"
				style={{ background: lineBackground(type) }}
			>
				<td
					style={{
						...gutterStyle,
						background: gutterBackground(type),
					}}
				>
					{num ?? ""}
				</td>
				<td style={indicatorStyle}>{indicator}</td>
				<td
					style={codeStyle}
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki build-time output
					dangerouslySetInnerHTML={{
						__html: html ?? "&nbsp;",
					}}
				/>
			</tr>
		);
	};

	const renderSide = (side: "left" | "right") =>
		collapsed.flatMap((item) => {
			if (item.kind === "row") {
				return [renderRow(item.row, item.idx, side)];
			}
			if (expanded.has(item.startIdx)) {
				return item.rows.map((row, j) =>
					renderRow(row, item.startIdx + j, side),
				);
			}
			return [
				<CollapseBar
					key={`collapse-${side}-${item.startIdx}`}
					count={item.count}
					onExpand={() => toggleExpand(item.startIdx)}
					colSpan={3}
				/>,
			];
		});

	return (
		<div className="cc-split-wrap">
			<div className="cc-split-grid">
				<div style={{ minWidth: 0, borderRight: `1px solid ${c.border}` }}>
					<div style={panelHeaderStyle}>
						<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
							<span style={{ fontSize: 12, fontWeight: 500, color: c.text }}>
								{title1}
							</span>
							<LangBadge lang={lang1} />
						</div>
						<CopyButton text={raw1} />
					</div>
					<div
						ref={leftRef}
						onScroll={() => handleScroll("left")}
						style={scrollPanelStyle(isFullScreen)}
					>
						<table style={tableStyle}>
							<tbody>{renderSide("left")}</tbody>
						</table>
					</div>
				</div>

				<div style={{ minWidth: 0 }}>
					<div style={panelHeaderStyle}>
						<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
							<span style={{ fontSize: 12, fontWeight: 500, color: c.text }}>
								{title2}
							</span>
							<LangBadge lang={lang2} />
						</div>
						<CopyButton text={raw2} />
					</div>
					<div
						ref={rightRef}
						onScroll={() => handleScroll("right")}
						style={scrollPanelStyle(isFullScreen)}
					>
						<table style={tableStyle}>
							<tbody>{renderSide("right")}</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

function UnifiedView({
	entries,
	raw1,
	raw2,
	isFullScreen = false,
}: {
	entries: DiffEntry[];
	raw1: string;
	raw2: string;
	isFullScreen?: boolean;
}) {
	const combined = `${raw1}\n${raw2}`;
	const collapsed = collapseEntries(entries);
	const [expanded, setExpanded] = useState<Set<number>>(new Set());

	const toggleExpand = useCallback((startIdx: number) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(startIdx)) next.delete(startIdx);
			else next.add(startIdx);
			return next;
		});
	}, []);

	return (
		<div>
			<div
				style={{
					display: "flex",
					justifyContent: "flex-end",
					padding: "8px 12px",
					borderBottom: `1px solid ${c.border}`,
					background: c.bgPanel,
				}}
			>
				<CopyButton text={combined} />
			</div>
			<div style={scrollPanelStyle(isFullScreen)}>
				<table style={tableStyle}>
					<tbody>
						{collapsed.flatMap((item) => {
							if (item.kind === "collapse" && !expanded.has(item.startIdx)) {
								return [
									<CollapseBar
										key={`collapse-u-${item.startIdx}`}
										count={item.count}
										onExpand={() => toggleExpand(item.startIdx)}
										colSpan={4}
									/>,
								];
							}
							const entriesToRender =
								item.kind === "collapse" ? item.entries : [item.entry];
							const baseIdx =
								item.kind === "collapse" ? item.startIdx : item.idx;

							return entriesToRender.map((entry, j) => {
								const idx = baseIdx + j;
								const bg =
									entry.type === "removed"
										? c.removedBg
										: entry.type === "added"
											? c.addedBg
											: "transparent";
								const gBg =
									entry.type === "removed"
										? c.removedGutter
										: entry.type === "added"
											? c.addedGutter
											: "transparent";
								const indicator =
									entry.type === "removed" ? (
										<span style={{ color: c.removedIndicator }}>−</span>
									) : entry.type === "added" ? (
										<span style={{ color: c.addedIndicator }}>+</span>
									) : (
										""
									);
								const html =
									entry.type === "removed"
										? entry.leftHtml
										: entry.type === "added"
											? entry.rightHtml
											: entry.leftHtml;

								return (
									<tr
										key={`u-${entry.leftNum ?? "e"}-${entry.rightNum ?? "e"}-${idx}`}
										className="cc-diff-row"
										style={{ background: bg }}
									>
										<td
											style={{
												...gutterStyle,
												background: gBg,
												minWidth: 40,
											}}
										>
											{entry.leftNum ?? ""}
										</td>
										<td
											style={{
												...gutterStyle,
												background: gBg,
												minWidth: 40,
											}}
										>
											{entry.rightNum ?? ""}
										</td>
										<td style={indicatorStyle}>{indicator}</td>
										<td
											style={codeStyle}
											// biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki build-time output
											dangerouslySetInnerHTML={{
												__html: html ?? "&nbsp;",
											}}
										/>
									</tr>
								);
							});
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function LangBadge({ lang }: { lang: string }) {
	return (
		<span
			style={{
				fontSize: 10,
				padding: "2px 6px",
				borderRadius: 4,
				background: c.accentSoft,
				color: c.accent,
				fontWeight: 600,
				textTransform: "uppercase",
				letterSpacing: "0.05em",
			}}
		>
			{lang}
		</span>
	);
}

function DiffStats({ entries }: { entries: DiffEntry[] }) {
	const added = entries.filter((e) => e.type === "added").length;
	const removed = entries.filter((e) => e.type === "removed").length;
	if (added === 0 && removed === 0) return null;

	return (
		<div
			style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}
		>
			{added > 0 && (
				<span style={{ color: c.addedIndicator, fontWeight: 600 }}>
					+{added}
				</span>
			)}
			{removed > 0 && (
				<span style={{ color: c.removedIndicator, fontWeight: 600 }}>
					−{removed}
				</span>
			)}
		</div>
	);
}

function FullScreenButton({
	isFullScreen,
	onToggle,
}: {
	isFullScreen: boolean;
	onToggle: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onToggle}
			style={{
				background: c.accentSoft,
				color: c.textMuted,
				border: `1px solid ${c.border}`,
				borderRadius: 6,
				padding: "4px 10px",
				fontSize: 12,
				fontWeight: 500,
				cursor: "pointer",
				transition: "all 0.2s ease",
				display: "flex",
				alignItems: "center",
				gap: 4,
			}}
		>
			{isFullScreen ? (
				<>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M8 3v3a2 2 0 0 1-2 2H3" />
						<path d="M21 8h-3a2 2 0 0 1-2-2V3" />
						<path d="M3 16h3a2 2 0 0 1 2 2v3" />
						<path d="M16 21v-3a2 2 0 0 1 2-2h3" />
					</svg>
					Exit
				</>
			) : (
				<>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M15 3h6v6" />
						<path d="M9 21H3v-6" />
						<path d="M21 3l-7 7" />
						<path d="M3 21l7-7" />
					</svg>
					Full Screen
				</>
			)}
		</button>
	);
}

const panelHeaderStyle: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	padding: "8px 12px",
	borderBottom: `1px solid ${c.border}`,
	background: c.bgPanel,
};

const tableStyle: React.CSSProperties = {
	width: "100%",
	borderCollapse: "collapse",
	fontFamily:
		"ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
	fontSize: 13,
	lineHeight: "1.6",
};

const gutterStyle: React.CSSProperties = {
	width: 1,
	minWidth: 32,
	padding: "0 8px",
	textAlign: "right",
	color: c.lineNum,
	fontSize: 12,
	userSelect: "none",
	verticalAlign: "top",
	whiteSpace: "nowrap",
};

const indicatorStyle: React.CSSProperties = {
	width: 1,
	minWidth: 16,
	padding: "0 2px",
	textAlign: "center",
	fontSize: 13,
	fontWeight: 700,
	userSelect: "none",
	verticalAlign: "top",
};

const codeStyle: React.CSSProperties = {
	padding: "0 12px 0 4px",
	whiteSpace: "pre",
	verticalAlign: "top",
};

function scrollPanelStyle(isFullScreen: boolean): React.CSSProperties {
	return {
		overflow: "auto",
		maxHeight: isFullScreen ? "none" : 520,
	};
}

const CodeCompareUI = memo(function CodeCompareUI({
	entries,
	title1,
	title2,
	raw1,
	raw2,
	lang1,
	lang2,
}: CodeCompareUIProps) {
	const [view, setView] = useState<"split" | "unified">("split");
	const [isFullScreen, setIsFullScreen] = useState(false);

	useEffect(() => {
		if (!isFullScreen) return;
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsFullScreen(false);
		};
		document.addEventListener("keydown", handleEsc);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", handleEsc);
			document.body.style.overflow = "";
		};
	}, [isFullScreen]);

	const content = (
		<>
			{/* Toolbar */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "10px 16px",
					borderBottom: `1px solid ${c.border}`,
					background: c.bgPanel,
					flexWrap: "wrap",
					gap: 8,
					flexShrink: 0,
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
					<span style={{ fontSize: 13, fontWeight: 600, color: c.textBright }}>
						{title1}
					</span>
					<span style={{ fontSize: 12, color: c.textMuted }}>vs</span>
					<span style={{ fontSize: 13, fontWeight: 600, color: c.textBright }}>
						{title2}
					</span>
					<DiffStats entries={entries} />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<div
						style={{
							display: "flex",
							borderRadius: 8,
							border: `1px solid ${c.border}`,
							overflow: "hidden",
						}}
					>
						{(["split", "unified"] as const).map((mode) => (
							<button
								key={mode}
								type="button"
								onClick={() => setView(mode)}
								style={{
									padding: "4px 14px",
									fontSize: 12,
									fontWeight: 500,
									border: "none",
									cursor: "pointer",
									background: view === mode ? c.accent : "transparent",
									color: view === mode ? c.bg : c.textMuted,
									transition: "all 0.2s ease",
									textTransform: "capitalize",
								}}
							>
								{mode}
							</button>
						))}
					</div>
					<FullScreenButton
						isFullScreen={isFullScreen}
						onToggle={() => setIsFullScreen((p) => !p)}
					/>
				</div>
			</div>

			{/* Content */}
			<div
				style={{
					flex: isFullScreen ? 1 : undefined,
					minHeight: 0,
					overflow: "auto",
				}}
			>
				{view === "split" ? (
					<SplitView
						entries={entries}
						title1={title1}
						title2={title2}
						raw1={raw1}
						raw2={raw2}
						lang1={lang1}
						lang2={lang2}
						isFullScreen={isFullScreen}
					/>
				) : (
					<UnifiedView
						entries={entries}
						raw1={raw1}
						raw2={raw2}
						isFullScreen={isFullScreen}
					/>
				)}
			</div>

			<style>{`
				.cc-split-wrap {
					overflow: hidden;
				}
				.cc-split-grid {
					display: grid;
					grid-template-columns: 1fr 1fr;
				}
				.cc-diff-row {
					transition: background 0.15s ease;
				}
				.cc-diff-row:hover {
					background: ${c.hoverBg} !important;
				}
				tr.cc-diff-row:hover td {
					background: transparent !important;
				}
				@media (max-width: 767px) {
					.cc-split-grid {
						grid-template-columns: 1fr !important;
					}
				}
			`}</style>
		</>
	);

	if (isFullScreen) {
		return (
			<div
				style={{
					position: "fixed",
					inset: 0,
					zIndex: 99999,
					background: c.bg,
					display: "flex",
					flexDirection: "column",
				}}
			>
				{content}
			</div>
		);
	}

	return (
		<div
			style={{
				borderRadius: 12,
				border: `1px solid ${c.border}`,
				overflow: "hidden",
				background: c.bg,
				marginBlock: "1.5rem",
			}}
		>
			{content}
		</div>
	);
});

export default CodeCompareUI;
