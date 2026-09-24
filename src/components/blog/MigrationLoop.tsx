import { type RefObject, useEffect, useRef, useState } from "react";

type Verdict = "pass" | "fail" | null;

interface LoopFrame {
	active: number;
	verdict: Verdict;
	back: boolean;
}

const CSS = `
.ts {
  --ts-bg:#1a1b26; --ts-panel:#24283b; --ts-line:#3b4261; --ts-text:#c0caf5;
  --ts-muted:#737aa2; --ts-blue:#7aa2f7; --ts-teal:#73daca; --ts-red:#f7768e;
  --ts-glow:rgba(115,218,202,.5);
  color:var(--ts-text); background:var(--ts-bg); border:1px solid var(--ts-line);
  border-radius:16px; padding:26px 22px; margin:2rem 0;
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
  position:relative; overflow:hidden;
}
.ts * { box-sizing:border-box; }
.ts::before {
  content:""; position:absolute; inset:0;
  background-image:linear-gradient(var(--ts-line) 1px,transparent 1px),
    linear-gradient(90deg,var(--ts-line) 1px,transparent 1px);
  background-size:26px 26px; opacity:.05; pointer-events:none;
}
.ts-cap {
  font-family:ui-monospace,"SF Mono",Menlo,monospace; font-size:11px;
  letter-spacing:.14em; text-transform:uppercase; color:var(--ts-muted); margin:0 0 16px;
}
.ts-rise { opacity:0; transform:translateY(14px); }
.ts-in .ts-rise { opacity:1; transform:none;
  transition:opacity .5s ease, transform .55s cubic-bezier(.2,.9,.25,1.1); }

.ts-loop { display:grid; grid-template-columns:1fr; gap:14px; }
.ts-loop-row { display:flex; align-items:stretch; gap:8px; flex-wrap:wrap; }
.ts-node { flex:1; min-width:120px; border:1px solid var(--ts-line); border-radius:11px;
  background:var(--ts-panel); padding:13px 14px; transition:all .4s ease; position:relative; }
.ts-node.on { border-color:var(--ts-blue); box-shadow:0 0 22px -8px var(--ts-blue); }
.ts-node.pass { border-color:var(--ts-teal); box-shadow:0 0 22px -6px var(--ts-glow); }
.ts-node.fail { border-color:var(--ts-red); box-shadow:0 0 22px -8px var(--ts-red); }
.ts-node-k { font-family:ui-monospace,Menlo,monospace; font-size:10px;
  letter-spacing:.16em; text-transform:uppercase; color:var(--ts-muted); }
.ts-node-t { font-size:14px; font-weight:700; margin-top:5px; }
.ts-node-n { font-size:11.5px; color:var(--ts-muted); margin-top:3px; min-height:15px; }
.ts-arrow { align-self:center; color:var(--ts-line); font-size:15px; transition:color .4s ease; }
.ts-arrow.hot { color:var(--ts-blue); }
.ts-gate { margin-top:2px; display:flex; align-items:center; justify-content:center; gap:12px;
  border:1px dashed var(--ts-line); border-radius:11px; padding:12px;
  background:rgba(122,162,247,.04); transition:all .4s ease; }
.ts-gate.pass { border-color:var(--ts-teal); border-style:solid; background:rgba(115,218,202,.06); }
.ts-gate.fail { border-color:var(--ts-red); border-style:solid; background:rgba(247,118,142,.06); }
.ts-gate-label { font-size:12.5px; font-weight:600; }
.ts-verdict { font-family:ui-monospace,Menlo,monospace; font-size:12px; }
.ts-verdict.pass { color:var(--ts-teal); }
.ts-verdict.fail { color:var(--ts-red); }
.ts-back { font-family:ui-monospace,Menlo,monospace; font-size:11.5px; color:var(--ts-red);
  text-align:center; margin-top:2px; min-height:16px; opacity:0; transition:opacity .3s ease; }
.ts-back.show { opacity:1; }
@media (prefers-reduced-motion: reduce) { .ts-in .ts-rise { transition:none; } }
`;

function useStyles(): void {
	useEffect(() => {
		if (typeof document === "undefined") return;
		if (document.getElementById("ts-migration-loop-styles")) return;
		const el = document.createElement("style");
		el.id = "ts-migration-loop-styles";
		el.textContent = CSS;
		document.head.appendChild(el);
	}, []);
}

function useInView<T extends HTMLElement>(
	threshold = 0.3,
): {
	ref: RefObject<T | null>;
	inView: boolean;
} {
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
				for (const e of entries) {
					if (e.isIntersecting) {
						setInView(true);
						obs.disconnect();
					}
				}
			},
			{ threshold },
		);
		obs.observe(node);
		return () => obs.disconnect();
	}, [threshold]);
	return { ref, inView };
}

const IDLE: LoopFrame = { active: 0, verdict: null, back: false };

const LOOP_FRAMES: readonly LoopFrame[] = [
	{ active: 0, verdict: null, back: false },
	{ active: 1, verdict: null, back: false },
	{ active: 2, verdict: "fail", back: false },
	{ active: 3, verdict: "fail", back: true },
	{ active: 1, verdict: null, back: false },
	{ active: 2, verdict: "pass", back: false },
	{ active: 6, verdict: "pass", back: false },
];

export default function MigrationLoop() {
	useStyles();
	const { ref, inView } = useInView<HTMLDivElement>();
	const [f, setF] = useState(0);

	useEffect(() => {
		if (!inView) return;
		const id = setInterval(
			() => setF((x) => (x + 1) % LOOP_FRAMES.length),
			1300,
		);
		return () => clearInterval(id);
	}, [inView]);

	const frame: LoopFrame = LOOP_FRAMES[f] ?? IDLE;

	const nodeClass = (i: number): string => {
		if (frame.active !== i) return "ts-node";
		if (i === 2) return `ts-node ${frame.verdict === "pass" ? "pass" : "fail"}`;
		if (i === 6) return "ts-node pass";
		return "ts-node on";
	};

	return (
		<div className={`ts ${inView ? "ts-in" : ""}`} ref={ref}>
			<p className="ts-cap">
				The loop · code is guilty until the suite says otherwise
			</p>
			<div className="ts-loop ts-rise">
				<div className="ts-loop-row">
					<div className={nodeClass(0)}>
						<div className="ts-node-k">01</div>
						<div className="ts-node-t">Generate</div>
						<div className="ts-node-n">agent writes the port</div>
					</div>
					<div className={`ts-arrow ${frame.active <= 1 ? "hot" : ""}`}>▸</div>
					<div className={nodeClass(1)}>
						<div className="ts-node-k">02</div>
						<div className="ts-node-t">Build</div>
						<div className="ts-node-n">does it compile?</div>
					</div>
					<div className={`ts-arrow ${frame.active === 2 ? "hot" : ""}`}>▸</div>
					<div className={nodeClass(2)}>
						<div className="ts-node-k">03</div>
						<div className="ts-node-t">Run the suite</div>
						<div className="ts-node-n">the ground truth</div>
					</div>
				</div>

				<div className={`ts-gate ${frame.verdict ?? ""}`}>
					<span className="ts-gate-label">Test gate</span>
					<span className={`ts-verdict ${frame.verdict ?? ""}`}>
						{frame.verdict === "pass"
							? "✓ 100% green — ship it"
							: frame.verdict === "fail"
								? "✗ red — send it back"
								: "· awaiting run"}
					</span>
				</div>

				<div className={`ts-back ${frame.back ? "show" : ""}`}>
					↑ failing test becomes the next work item → Fix → Build again
				</div>

				<div className="ts-loop-row">
					<div className={nodeClass(3)}>
						<div className="ts-node-k">04</div>
						<div className="ts-node-t">Fix</div>
						<div className="ts-node-n">re-prompt with the error</div>
					</div>
					<div className="ts-arrow">▸</div>
					<div className={nodeClass(6)}>
						<div className="ts-node-k">05</div>
						<div className="ts-node-t">Merge</div>
						<div className="ts-node-n">only a green suite gets here</div>
					</div>
				</div>
			</div>
		</div>
	);
}
