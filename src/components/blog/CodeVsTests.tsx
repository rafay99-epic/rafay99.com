import { type RefObject, useEffect, useRef, useState } from "react";

const CSS = `
.ts {
  --ts-bg:#1a1b26; --ts-panel:#24283b; --ts-line:#3b4261; --ts-text:#c0caf5;
  --ts-muted:#737aa2; --ts-teal:#73daca; --ts-amber:#e0af68;
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

.ts-scale { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.ts-col { border:1px solid var(--ts-line); border-radius:12px; padding:16px;
  background:var(--ts-panel); display:flex; flex-direction:column; }
.ts-col-h { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:12px; }
.ts-col-h b { font-size:14.5px; }
.ts-tag { font-family:ui-monospace,Menlo,monospace; font-size:10.5px; padding:2px 7px; border-radius:6px; }
.ts-tag.cheap { color:var(--ts-amber); border:1px solid var(--ts-amber); }
.ts-tag.moat { color:var(--ts-teal); border:1px solid var(--ts-teal); }
.ts-bars { display:flex; align-items:flex-end; gap:5px; height:92px; }
.ts-bar { flex:1; border-radius:4px 4px 0 0; transition:height .5s cubic-bezier(.4,0,.2,1); }
.ts-bar.code { background:linear-gradient(180deg,var(--ts-amber),rgba(224,175,104,.25)); }
.ts-bar.test { background:linear-gradient(180deg,var(--ts-teal),rgba(115,218,202,.2)); }
.ts-col-f { margin-top:12px; font-size:12px; color:var(--ts-muted); line-height:1.5; }
.ts-price { font-family:ui-monospace,Menlo,monospace; font-weight:700; }
.ts-price.down { color:var(--ts-amber); }
.ts-price.up { color:var(--ts-teal); }
@media (max-width:560px) { .ts-scale { grid-template-columns:1fr; } }
@media (prefers-reduced-motion: reduce) { .ts-in .ts-rise { transition:none; } .ts-bar { transition:none; } }
`;

function useStyles(): void {
	useEffect(() => {
		if (typeof document === "undefined") return;
		if (document.getElementById("ts-code-vs-tests-styles")) return;
		const el = document.createElement("style");
		el.id = "ts-code-vs-tests-styles";
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

const TEST_BARS: readonly number[] = [34, 44, 52, 61, 70, 80, 90];
const CODE_BAR_IDS = [
	"code-bar-1",
	"code-bar-2",
	"code-bar-3",
	"code-bar-4",
	"code-bar-5",
	"code-bar-6",
	"code-bar-7",
] as const;

export default function CodeVsTests() {
	useStyles();
	const { ref, inView } = useInView<HTMLDivElement>();
	const [t, setT] = useState(0);

	useEffect(() => {
		if (!inView) return;
		const id = setInterval(() => setT((x) => (x + 1) % 60), 90);
		return () => clearInterval(id);
	}, [inView]);

	const codeBars = CODE_BAR_IDS.map((id, i) => ({
		id,
		height: 30 + ((i * 13 + t * 6) % 60),
	}));

	return (
		<div className={`ts ${inView ? "ts-in" : ""}`} ref={ref}>
			<p className="ts-cap">The value inversion · price per line, over time</p>
			<div className="ts-scale ts-rise">
				<div className="ts-col">
					<div className="ts-col-h">
						<b>Code</b>
						<span className="ts-tag cheap">FIREHOSE</span>
					</div>
					<div className="ts-bars">
						{codeBars.map(({ id, height }) => (
							<div
								key={id}
								className="ts-bar code"
								style={{ height: `${height}%` }}
							/>
						))}
					</div>
					<div className="ts-col-f">
						Infinite supply, regenerated on demand. Marginal price{" "}
						<span className="ts-price down">↓ ~$0</span>. A model rewrites it
						over a weekend.
					</div>
				</div>

				<div className="ts-col">
					<div className="ts-col-h">
						<b>The test suite</b>
						<span className="ts-tag moat">MOAT</span>
					</div>
					<div className="ts-bars">
						{TEST_BARS.map((height) => (
							<div
								key={height}
								className="ts-bar test"
								style={{ height: `${height}%` }}
							/>
						))}
					</div>
					<div className="ts-col-f">
						Encodes what "correct" means — every bug you ever hit, frozen. Value{" "}
						<span className="ts-price up">↑ compounds</span>. Nobody can
						regenerate your scars.
					</div>
				</div>
			</div>
		</div>
	);
}
