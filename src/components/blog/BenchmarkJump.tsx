import { useEffect, useRef, useState } from "react";

const STYLE_ID = "hx-bench-styles";
const CSS = `
.hx-bench-wrap {
  --hx-bg: #1a1b26;
  --hx-panel: #24283b;
  --hx-line: #3b4261;
  --hx-text: #c0caf5;
  --hx-muted: #737aa2;
  --hx-signal: #7aa2f7;
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
.hx-bench-wrap * { box-sizing: border-box; }
.hx-bench-wrap::before {
  content: "";
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--hx-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--hx-line) 1px, transparent 1px);
  background-size: 26px 26px;
  opacity: .05;
  pointer-events: none;
}
.hx-bench-wrap .hx-cap {
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
  color: var(--hx-muted); margin: 0 0 14px;
}
.hx-bench-wrap .hx-rise { opacity: 0; transform: translateY(14px); }
.hx-bench-wrap.hx-in .hx-rise {
  opacity: 1; transform: none;
  transition: opacity .5s ease, transform .55s cubic-bezier(.2,.9,.25,1.1);
}
.hx-bench { display: grid; gap: 18px; }
.hx-bench-head { font-size: 15px; font-weight: 700; }
.hx-bench-head span { color: var(--hx-signal); }
.hx-bar-track { height: 40px; border-radius: 9px; background: var(--hx-panel);
  border: 1px solid var(--hx-line); position: relative; overflow: hidden; }
.hx-bar-fill { position: absolute; inset: 0 auto 0 0; width: 0%;
  background: linear-gradient(90deg, rgba(122,162,247,.25), var(--hx-signal));
  transition: width 1.3s cubic-bezier(.2,.8,.2,1); }
.hx-bar-labels { display: flex; justify-content: space-between; font-size: 11px;
  color: var(--hx-muted); font-family: ui-monospace, Menlo, monospace; margin-top: 5px; }
.hx-bench-num { font-family: ui-monospace, Menlo, monospace; font-variant-numeric: tabular-nums;
  font-size: 15px; font-weight: 700; color: var(--hx-signal); }
.hx-bench-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.hx-bench-chip { font-family: ui-monospace, Menlo, monospace; font-size: 13px;
  color: var(--hx-text); border: 1px dashed var(--hx-signal); border-radius: 8px;
  padding: 8px 12px; }
.hx-bench-sub { font-size: 12.5px; color: var(--hx-muted); }
@media (prefers-reduced-motion: reduce) {
  .hx-bench-wrap.hx-in .hx-rise { transition: none !important; }
  .hx-bench-wrap .hx-rise { opacity: 1; transform: none; }
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

export default function BenchmarkJump() {
	useStyles();
	const { ref, inView } = useInView<HTMLDivElement>();
	const [pct, setPct] = useState(52.8);

	useEffect(() => {
		if (!inView) return;
		const reduce =
			typeof window !== "undefined" &&
			window.matchMedia &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const start = performance.now();
		const from = 52.8;
		const to = 66.5;
		let raf = 0;
		if (reduce) {
			raf = requestAnimationFrame(() => setPct(to));
			return () => cancelAnimationFrame(raf);
		}
		const tick = (now: number) => {
			const t = Math.min((now - start) / 1300, 1);
			const eased = 1 - (1 - t) ** 3;
			setPct(+(from + (to - from) * eased).toFixed(1));
			if (t < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [inView]);

	return (
		<div ref={ref} className={`hx-bench-wrap ${inView ? "hx-in" : ""}`}>
			<p className="hx-cap">Same model. Different harness.</p>
			<div className="hx-bench">
				<div className="hx-bench-head hx-rise">
					They changed <span>nothing</span> about the model — only the harness.
				</div>

				<div className="hx-rise" style={{ transitionDelay: "80ms" }}>
					<div className="hx-bar-track">
						<div
							className="hx-bar-fill"
							style={{
								width: inView ? `${((pct - 45) / (75 - 45)) * 100}%` : "0%",
							}}
						/>
					</div>
					<div className="hx-bar-labels">
						<span>52.8% before</span>
						<span className="hx-bench-num">{pct.toFixed(1)}%</span>
						<span>66.5% after</span>
					</div>
				</div>

				<div
					className="hx-bench-row hx-rise"
					style={{ transitionDelay: "160ms" }}
				>
					<span className="hx-bench-chip">−80% tools → better output</span>
					<span className="hx-bench-sub">
						Vercel <em>removed</em> most of their agent's tools and the results
						improved.
					</span>
				</div>
			</div>
		</div>
	);
}
