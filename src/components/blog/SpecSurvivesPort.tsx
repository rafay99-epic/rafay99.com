import { type RefObject, useEffect, useRef, useState } from "react";

interface Port {
	name: string;
	sub: string;
}

const CSS = `
.ts {
  --ts-bg:#1a1b26; --ts-panel:#24283b; --ts-line:#3b4261; --ts-text:#c0caf5;
  --ts-muted:#737aa2; --ts-blue:#7aa2f7; --ts-teal:#73daca; --ts-glow:rgba(115,218,202,.5);
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
.ts-mono { font-family:ui-monospace,"SF Mono","JetBrains Mono",Menlo,monospace; }
.ts-cap {
  font-family:ui-monospace,"SF Mono",Menlo,monospace; font-size:11px;
  letter-spacing:.14em; text-transform:uppercase; color:var(--ts-muted); margin:0 0 16px;
}
.ts-rise { opacity:0; transform:translateY(14px); }
.ts-in .ts-rise { opacity:1; transform:none;
  transition:opacity .5s ease, transform .55s cubic-bezier(.2,.9,.25,1.1); }

.ts-spec-wrap { display:grid; gap:10px; }
.ts-spec-bar { border:1px solid var(--ts-teal); border-radius:11px;
  background:rgba(115,218,202,.06); padding:13px 16px;
  display:flex; align-items:center; justify-content:space-between;
  box-shadow:0 0 24px -10px var(--ts-glow); }
.ts-spec-bar b { font-size:14px; }
.ts-spec-bar span { font-family:ui-monospace,Menlo,monospace; font-size:12px; color:var(--ts-teal); }
.ts-invariant { text-align:center; font-size:11px; color:var(--ts-muted); font-style:italic; }
.ts-langs { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
.ts-lang { border:1px solid var(--ts-line); border-radius:11px; padding:16px 12px;
  background:var(--ts-panel); text-align:center; transition:all .45s ease; opacity:.4; }
.ts-lang.on { opacity:1; border-color:var(--ts-blue);
  box-shadow:0 0 22px -9px var(--ts-blue); transform:translateY(-2px); }
.ts-lang-name { font-size:15px; font-weight:700; }
.ts-lang-sub { font-size:11px; color:var(--ts-muted); margin-top:3px; }
.ts-morph { text-align:center; color:var(--ts-muted); font-size:13px; }
@media (max-width:560px) { .ts-langs { grid-template-columns:1fr; } }
@media (prefers-reduced-motion: reduce) { .ts-in .ts-rise { transition:none; } }
`;

function useStyles(): void {
	useEffect(() => {
		if (typeof document === "undefined") return;
		if (document.getElementById("ts-spec-survives-styles")) return;
		const el = document.createElement("style");
		el.id = "ts-spec-survives-styles";
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

const PORTS: readonly Port[] = [
	{ name: "Zig", sub: "where Bun started" },
	{ name: "Rust", sub: "where it landed" },
	{ name: "next?", sub: "whatever comes" },
];

export default function SpecSurvivesPort() {
	useStyles();
	const { ref, inView } = useInView<HTMLDivElement>();
	const [i, setI] = useState(0);

	useEffect(() => {
		if (!inView) return;
		const id = setInterval(() => setI((x) => (x + 1) % PORTS.length), 1600);
		return () => clearInterval(id);
	}, [inView]);

	return (
		<div className={`ts ${inView ? "ts-in" : ""}`} ref={ref}>
			<p className="ts-cap">The invariant · what actually survives a rewrite</p>
			<div className="ts-spec-wrap ts-rise">
				<div className="ts-spec-bar">
					<b>The test suite — the spec</b>
					<span>constant · never ports</span>
				</div>
				<div className="ts-invariant">
					↓ every implementation below must satisfy the same suite above ↓
				</div>
				<div className="ts-langs">
					{PORTS.map((p, idx) => (
						<div key={p.name} className={`ts-lang ${idx === i ? "on" : ""}`}>
							<div className="ts-lang-name">{p.name}</div>
							<div className="ts-lang-sub">{p.sub}</div>
						</div>
					))}
				</div>
				<div className="ts-morph ts-mono">
					implementation is disposable — the spec is the product
				</div>
			</div>
		</div>
	);
}
