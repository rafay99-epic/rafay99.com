import type { SearchTipsProps } from "types/search";

// Clickable example queries shown while the input is empty.
function SearchTips({ examples, query, setQuery }: SearchTipsProps) {
	if (query) return null;

	return (
		<p className="ed-mono search__tips">
			<span>try</span>
			{examples.map((example) => (
				<button
					key={example}
					type="button"
					className="ed-link"
					onClick={() => setQuery(example)}
				>
					{example}
				</button>
			))}
		</p>
	);
}

export default SearchTips;
