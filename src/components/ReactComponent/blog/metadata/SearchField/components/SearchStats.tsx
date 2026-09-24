import type { SearchStatsProps } from "types/search";

function SearchStats({ query, results, searchStats }: SearchStatsProps) {
	if (!query) return null;

	return (
		<p className="ed-mono search__stats" aria-live="polite">
			{results.length > 0 ? (
				<>
					{searchStats.totalResults}{" "}
					{searchStats.totalResults === 1 ? "result" : "results"} ·{" "}
					{searchStats.searchTime}ms
					{searchStats.totalResults > results.length &&
						` · showing top ${results.length}`}
				</>
			) : (
				<>Nothing for “{query}”. Try a tag, a year, or fewer words.</>
			)}
		</p>
	);
}

export default SearchStats;
