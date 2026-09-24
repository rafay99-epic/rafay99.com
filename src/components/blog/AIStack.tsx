import { useEffect, useRef, useState } from "react";

const STYLE_ID = "hx-stack-styles";
const CSS = `
.hx-stack-wrap {
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
.hx-stack-wrap * { box-sizing: border-box; }
.hx-stack-wrap::before {
  content: "";
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--hx-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--hx-line) 1px, transparent 1px);
  background-size: 26px 26px;
  opacity: .05;
  pointer-events: none;
}
.hx-stack-wrap .hx-cap {
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
  color: var(--hx-muted); margin: 0 0 14px;
}
.hx-stack { display: grid; gap: 0; }
.hx-layer {
  position: relative;
  border: 1px solid var(--hx-line); border-radius: 10px;
  background: var(--hx-panel); padding: 14px 16px;
}
.hx-layer h4 {
  margin: 0; font-size: 14px; font-weight: 700; letter-spacing: .01em;
  display: flex; align-items: center; gap: 8px;
}
.hx-layer p { margin: 4px 0 0; font-size: 12.5px; color: var(--hx-muted); }
.hx-arrow { text-align: center; color: var(--hx-line); font-size: 15px;
  line-height: 1; padding: 5px 0; }
.hx-layer.hx-hero { border-color: var(--hx-signal); background: linear-gradient(180deg, var(--hx-star), var(--hx-panel)); }
.hx-layer.hx-hero::after {
  content: ""; position: absolute; inset: -1px; border-radius: 10px;
  box-shadow: 0 0 24px -8px var(--hx-glow); animation: hx-stack-breathe 3s ease-in-out infinite;
  pointer-events: none;
}
.hx-tag { font-family: ui-monospace, Menlo, monospace; font-size: 10px;
  letter-spacing: .1em; text-transform: uppercase; color: var(--hx-signal);
  border: 1px solid var(--hx-signal); border-radius: 5px; padding: 1px 6px; }
.hx-in .hx-drop { animation: hx-stack-drop .6s cubic-bezier(.2,.85,.25,1.15) both; }
@keyframes hx-stack-breathe { 0%,100% { opacity: .5; } 50% { opacity: 1; } }
@keyframes hx-stack-drop { from { opacity: 0; transform: translateY(-16px) scale(.985); }
  to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .hx-layer.hx-hero::after { animation: none !important; }
  .hx-in .hx-drop { animation: none !important; }
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

const STACK = [
	{
		name: "Framework",
		tag: "LangChain · LlamaIndex",
		desc: "Building blocks — tools, memory, prompt chains. Libraries you assemble an agent from.",
		hero: false,
	},
	{
		name: "Orchestrator",
		tag: "the brain",
		desc: "The reasoning loop — when to call the model, how to parse it, what to do next.",
		hero: false,
	},
	{
		name: "Harness",
		tag: "the hands + the OS",
		desc: "Tools, memory, context, permissions, hooks. The layer that actually makes the model useful.",
		hero: true,
	},
	{
		name: "Model",
		tag: "the engine",
		desc: "Claude · GPT · DeepSeek · GLM. Raw intelligence. Table stakes.",
		hero: false,
	},
];

export default function AIStack() {
	useStyles();
	const { ref, inView } = useInView<HTMLDivElement>();
	return (
		<div ref={ref} className={`hx-stack-wrap ${inView ? "hx-in" : ""}`}>
			<p className="hx-cap">Where the harness sits in the stack</p>
			<div className="hx-stack">
				{STACK.map((l, i) => (
					<div key={l.name}>
						<div
							className={`hx-layer hx-drop ${l.hero ? "hx-hero" : ""}`}
							style={inView ? { animationDelay: `${i * 120}ms` } : undefined}
						>
							<h4>
								{l.name} <span className="hx-tag">{l.tag}</span>
							</h4>
							<p>{l.desc}</p>
						</div>
						{i < STACK.length - 1 && <div className="hx-arrow">▼</div>}
					</div>
				))}
			</div>
		</div>
	);
}
