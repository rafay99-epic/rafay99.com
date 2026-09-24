import { useEffect, useRef, useState } from "react";

const STYLE_ID = "hx-anatomy-styles";
const CSS = `
.hx-anat-wrap {
  --hx-bg: #1a1b26;
  --hx-panel: #24283b;
  --hx-line: #3b4261;
  --hx-text: #c0caf5;
  --hx-muted: #737aa2;
  --hx-signal: #7aa2f7;
  --hx-glow: rgba(122,162,247,.55);
  --hx-star: rgba(122,162,247,.14);

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
.hx-anat-wrap * { box-sizing: border-box; }
.hx-anat-wrap::before {
  content: "";
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--hx-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--hx-line) 1px, transparent 1px);
  background-size: 26px 26px;
  opacity: .05;
  pointer-events: none;
}
.hx-anat-wrap .hx-mono { font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace; }
.hx-anat-wrap .hx-cap {
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
  color: var(--hx-muted); margin: 0 0 14px;
}
.hx-anat-wrap .hx-rise { opacity: 0; transform: translateY(14px); }
.hx-anat-wrap.hx-in .hx-rise {
  opacity: 1; transform: none;
  transition: opacity .5s ease, transform .55s cubic-bezier(.2,.9,.25,1.1);
}
.hx-anat { position: relative; display: grid; gap: 12px; }
.hx-zone {
  border: 1px solid var(--hx-line);
  border-radius: 12px;
  background: var(--hx-panel);
  padding: 14px 16px;
  position: relative;
}
.hx-zone-label {
  font-family: ui-monospace, Menlo, monospace;
  font-size: 10px; letter-spacing: .18em; text-transform: uppercase;
  color: var(--hx-muted); margin-bottom: 10px;
}
.hx-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.hx-chip {
  font-family: ui-monospace, Menlo, monospace;
  font-size: 12px; color: var(--hx-text);
  border: 1px solid var(--hx-line); border-radius: 8px;
  padding: 6px 11px; background: rgba(192,202,245,.03);
}
.hx-star-zone { border-color: var(--hx-signal); }
.hx-star-zone::after {
  content: ""; position: absolute; inset: -1px; border-radius: 12px;
  box-shadow: 0 0 0 1px var(--hx-glow), 0 0 26px -6px var(--hx-glow);
  animation: hx-anat-breathe 3.2s ease-in-out infinite;
  pointer-events: none;
}
.hx-row {
  display: flex; align-items: baseline; gap: 10px;
  padding: 8px 10px; border-radius: 8px;
  background: linear-gradient(90deg, var(--hx-star), transparent 70%);
  background-size: 200% 100%;
  margin-top: 8px;
}
.hx-row:first-of-type { margin-top: 0; }
.hx-row-name { font-size: 13.5px; font-weight: 600; color: var(--hx-text); white-space: nowrap; }
.hx-row-q { font-size: 12px; color: var(--hx-muted); font-style: italic; }
.hx-in .hx-row { animation: hx-anat-sweep 1.3s ease both; }
.hx-spine { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px;
  transform: translateX(-50%); background: var(--hx-line); z-index: 0; }
.hx-pulse {
  position: absolute; left: 50%; top: 0; width: 8px; height: 8px;
  margin-left: -4px; border-radius: 50%;
  background: var(--hx-signal); box-shadow: 0 0 12px 3px var(--hx-glow);
  animation: hx-anat-fall 2.6s cubic-bezier(.6,0,.4,1) infinite; z-index: 1;
}
@keyframes hx-anat-fall { 0% { top: 2%; opacity: 0; } 12% { opacity: 1; }
  88% { opacity: 1; } 100% { top: 98%; opacity: 0; } }
@keyframes hx-anat-breathe { 0%,100% { opacity: .5; } 50% { opacity: 1; } }
@keyframes hx-anat-sweep { 0% { background-position: -180% 0; } 100% { background-position: 120% 0; } }
@media (prefers-reduced-motion: reduce) {
  .hx-pulse, .hx-star-zone::after { animation: none !important; }
  .hx-in .hx-rise, .hx-in .hx-row { animation: none !important; transition: none !important; }
  .hx-anat-wrap .hx-rise { opacity: 1; transform: none; }
  .hx-pulse { display: none; }
}
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

const HARNESS_LAYERS = [
	["Permission & Approval", "Can the agent run this command?"],
	["Context Engineering", "What should the model see right now?"],
	["Tool Orchestration", "Which tools can it call — and which shouldn't it?"],
	["Lifecycle Hooks", "Lint on save? Test before commit?"],
	["System Instructions", "Read CLAUDE.md on every turn."],
];

export default function HarnessAnatomy() {
	useStyles();
	const { ref, inView } = useInView<HTMLDivElement>();
	return (
		<div ref={ref} className={`hx-anat-wrap ${inView ? "hx-in" : ""}`}>
			<p className="hx-cap">Anatomy of a harness</p>
			<div className="hx-anat">
				<div className="hx-spine" aria-hidden />
				{!("matchMedia" in globalThis) ? null : (
					<div className="hx-pulse" aria-hidden />
				)}

				<div className="hx-zone hx-rise" style={{ transitionDelay: "0ms" }}>
					<div className="hx-zone-label">You · the user layer</div>
					<div className="hx-chips">
						<span className="hx-chip">Terminal / CLI</span>
						<span className="hx-chip">Desktop / Web</span>
						<span className="hx-chip">Editor / IDE</span>
					</div>
				</div>

				<div
					className="hx-zone hx-star-zone hx-rise"
					style={{ transitionDelay: "90ms" }}
				>
					<div className="hx-zone-label" style={{ color: "var(--hx-signal)" }}>
						The harness — where the actual work happens
					</div>
					{HARNESS_LAYERS.map(([name, q], i) => (
						<div
							className="hx-row"
							key={name}
							style={
								inView ? { animationDelay: `${250 + i * 130}ms` } : undefined
							}
						>
							<span className="hx-row-name hx-mono">{name}</span>
							<span className="hx-row-q">{q}</span>
						</div>
					))}
				</div>

				<div className="hx-zone hx-rise" style={{ transitionDelay: "180ms" }}>
					<div className="hx-zone-label">The model layer</div>
					<div className="hx-chips">
						<span className="hx-chip">
							LLM — Claude · GPT · DeepSeek · GLM · Kimi…
						</span>
					</div>
				</div>

				<div className="hx-zone hx-rise" style={{ transitionDelay: "270ms" }}>
					<div className="hx-zone-label">The outside world</div>
					<div className="hx-chips">
						<span className="hx-chip">File system</span>
						<span className="hx-chip">Network</span>
						<span className="hx-chip">MCP servers</span>
					</div>
				</div>
			</div>
		</div>
	);
}
