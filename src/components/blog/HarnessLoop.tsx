import { useEffect, useRef, useState } from "react";

const STYLE_ID = "hx-loop-styles";
const CSS = `
.hx-loop-wrap {
  --hx-bg: #1a1b26;
  --hx-panel: #24283b;
  --hx-line: #3b4261;
  --hx-text: #c0caf5;
  --hx-muted: #737aa2;
  --hx-signal: #7aa2f7;
  --hx-signal-2: #7dcfff;
  --hx-glow: rgba(122,162,247,.55);

  color: var(--hx-text);
  background: var(--hx-bg);
  border: 1px solid var(--hx-line);
  border-radius: 16px;
  padding: 26px 22px;
  margin: 2rem 0;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  position: relative;
  overflow: hidden;
}
.hx-loop-wrap * { box-sizing: border-box; }
.hx-loop-wrap::before {
  content: "";
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--hx-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--hx-line) 1px, transparent 1px);
  background-size: 26px 26px;
  opacity: .05;
  pointer-events: none;
}
.hx-loop-wrap .hx-cap {
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
  color: var(--hx-muted); margin: 0 0 14px;
}
.hx-loop-caption {
  margin-top: 14px; min-height: 40px; display: flex; align-items: center;
  gap: 10px; justify-content: center; text-align: center;
}
.hx-loop-step {
  font-family: ui-monospace, Menlo, monospace; font-size: 12px;
  color: var(--hx-signal); border: 1px solid var(--hx-line);
  border-radius: 999px; padding: 3px 10px;
}
.hx-loop-text { font-size: 13.5px; color: var(--hx-text); }
.hx-node-label { font-family: ui-monospace, Menlo, monospace; font-size: 11px; fill: var(--hx-muted); }
.hx-node-label.hx-on { fill: var(--hx-signal); }
`;

function useStyles() {
	useEffect(() => {
		if (typeof document === "undefined") return;
		if (document.getElementById(STYLE_ID)) return;
		const el = document.createElement("style");
		el.id = STYLE_ID;
		el.textContent = CSS;
		document.head.appendChild(el);
	}, []);
}

function useInView<T extends HTMLElement>(threshold = 0.35) {
	const ref = useRef<T | null>(null);
	const [inView, setInView] = useState(false);
	useEffect(() => {
		const node = ref.current;
		if (!node || typeof IntersectionObserver === "undefined") {
			setInView(true);
			return;
		}
		const obs = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						setInView(true);
						obs.disconnect();
					}
				});
			},
			{ threshold },
		);
		obs.observe(node);
		return () => obs.disconnect();
	}, [threshold]);
	return { ref, inView };
}

const NODE_KEYS = ["user", "harness", "model", "tools"] as const;
type NodeKey = (typeof NODE_KEYS)[number];
type LoopStep = { text: string; from: NodeKey; to: NodeKey };

const LOOP_STEPS = [
	{ text: "You send a request.", from: "user", to: "harness" },
	{
		text: "The harness curates context — system prompt, history, docs.",
		from: "harness",
		to: "harness",
	},
	{
		text: "It hands the curated context to the model.",
		from: "harness",
		to: "model",
	},
	{
		text: "The model answers. It never touches the outside world itself.",
		from: "model",
		to: "harness",
	},
	{
		text: "The harness verifies the output — format, safety.",
		from: "harness",
		to: "harness",
	},
	{
		text: "It executes the tools the model asked for.",
		from: "harness",
		to: "tools",
	},
	{
		text: "Tool results come back into the harness.",
		from: "tools",
		to: "harness",
	},
	{
		text: "Results are fed back to the model for the next move.",
		from: "harness",
		to: "model",
	},
	{
		text: "The finished result is delivered to you.",
		from: "harness",
		to: "user",
	},
] as const satisfies readonly LoopStep[];

const NODE_POS: Record<NodeKey, { x: number; y: number; label: string }> = {
	user: { x: 70, y: 130, label: "YOU" },
	harness: { x: 250, y: 130, label: "HARNESS" },
	model: { x: 430, y: 70, label: "MODEL" },
	tools: { x: 430, y: 190, label: "TOOLS" },
};

export default function HarnessLoop() {
	useStyles();
	const { ref, inView } = useInView<HTMLDivElement>();
	const [step, setStep] = useState(0);

	useEffect(() => {
		if (!inView) return;
		const reduce =
			typeof window !== "undefined" &&
			window.matchMedia &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (reduce) return;
		const id = setInterval(
			() => setStep((s) => (s + 1) % LOOP_STEPS.length),
			1500,
		);
		return () => clearInterval(id);
	}, [inView]);

	const s = LOOP_STEPS[step] ?? LOOP_STEPS[0];
	if (!s) return null;
	const active = new Set([s.from, s.to]);
	const target = NODE_POS[s.to];

	return (
		<div ref={ref} className={`hx-loop-wrap ${inView ? "hx-in" : ""}`}>
			<p className="hx-cap">The loop that runs on every single prompt</p>
			<svg
				viewBox="0 0 500 260"
				width="100%"
				role="img"
				aria-label="Harness runtime loop"
			>
				{(["user", "model", "tools"] as const satisfies readonly NodeKey[]).map(
					(k) => (
						<line
							key={k}
							x1={NODE_POS.harness.x}
							y1={NODE_POS.harness.y}
							x2={NODE_POS[k].x}
							y2={NODE_POS[k].y}
							stroke={active.has(k) ? "var(--hx-signal)" : "var(--hx-line)"}
							strokeWidth={active.has(k) ? 2 : 1.4}
						/>
					),
				)}

				{NODE_KEYS.map((k) => {
					const p = NODE_POS[k];
					const on = active.has(k);
					const isHub = k === "harness";
					return (
						<g key={k}>
							<circle
								cx={p.x}
								cy={p.y}
								r={isHub ? 42 : 30}
								fill="var(--hx-panel)"
								stroke={on || isHub ? "var(--hx-signal)" : "var(--hx-line)"}
								strokeWidth={isHub ? 2 : 1.5}
								style={
									isHub
										? { filter: "drop-shadow(0 0 10px var(--hx-glow))" }
										: on
											? { filter: "drop-shadow(0 0 6px var(--hx-glow))" }
											: undefined
								}
							/>
							<text
								x={p.x}
								y={p.y + 4}
								textAnchor="middle"
								className={`hx-node-label ${on || isHub ? "hx-on" : ""}`}
							>
								{p.label}
							</text>
						</g>
					);
				})}

				<g
					style={{
						transform: `translate(${target.x}px, ${target.y}px)`,
						transition: "transform .7s cubic-bezier(.5,0,.4,1)",
					}}
				>
					<circle
						r={6}
						fill="var(--hx-signal-2)"
						style={{ filter: "drop-shadow(0 0 8px var(--hx-glow))" }}
					/>
				</g>
			</svg>

			<div className="hx-loop-caption">
				<span className="hx-loop-step">
					{step + 1} / {LOOP_STEPS.length}
				</span>
				<span className="hx-loop-text">{s.text}</span>
			</div>
		</div>
	);
}
