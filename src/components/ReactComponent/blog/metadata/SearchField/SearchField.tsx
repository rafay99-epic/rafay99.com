import useSearch from "@hooks/useSearch";
import SearchInput from "@react/blog/metadata/SearchField/components/SearchInput";
import SearchResults, {
	ResultRow,
} from "@react/blog/metadata/SearchField/components/SearchResults";
import SearchStats from "@react/blog/metadata/SearchField/components/SearchStats";
import SearchTips from "@react/blog/metadata/SearchField/components/SearchTips";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import type { Post } from "types/articles";

interface SearchProps {
	posts: Post[];
}

const HEADLINE = ["Search", "the archive."];

function topTagExamples(posts: Post[]): string[] {
	const counts = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.data.tags ?? []) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}
	return [...counts]
		.sort((a, b) => b[1] - a[1])
		.slice(0, 2)
		.map(([tag]) => `tag:${tag}`);
}

function Search({ posts }: SearchProps) {
	const { query, setQuery, results, searchStats } = useSearch(posts);
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
	const examples = [
		...topTagExamples(posts),
		`${new Date().getFullYear()}`,
		"author:rafay",
	];

	const resultsRef = useRef(results);
	const selectedIndexRef = useRef(selectedResultIndex);
	const isFocusedRef = useRef(isSearchFocused);

	useEffect(() => {
		resultsRef.current = results;
		selectedIndexRef.current = selectedResultIndex;
		isFocusedRef.current = isSearchFocused;
	});

	const updateQuery = (q: string) => {
		setSelectedResultIndex(-1);
		setQuery(q);
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "/" && !isFocusedRef.current) {
				e.preventDefault();
				document.querySelector<HTMLInputElement>("#search-input")?.focus();
				return;
			}

			if (!isFocusedRef.current) return;

			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setSelectedResultIndex((prev) =>
						prev < resultsRef.current.length - 1 ? prev + 1 : prev,
					);
					break;
				case "ArrowUp":
					e.preventDefault();
					setSelectedResultIndex((prev) => (prev > -1 ? prev - 1 : -1));
					break;
				case "Enter": {
					const selected = resultsRef.current[selectedIndexRef.current];
					if (selected) {
						window.location.href = `/blog/${selected.id}/`;
					}
					break;
				}
				case "Escape":
					e.preventDefault();
					setQuery("");
					setSelectedResultIndex(-1);
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [setQuery]);

	useEffect(() => {
		if (selectedResultIndex >= 0) {
			const selectedElement = document.querySelector(
				`[data-result-index="${selectedResultIndex}"]`,
			);
			selectedElement?.scrollIntoView({ behavior: "smooth", block: "nearest" });
		}
	}, [selectedResultIndex]);

	return (
		<>
			<header className="ed-head search__head">
				<div className="ed-wrap">
					<h1 className="ed-mega is-md" aria-label={HEADLINE.join(" ")}>
						{HEADLINE.map((line, i) => (
							<span className="ed-line" aria-hidden="true" key={line}>
								<span style={{ "--i": i } as CSSProperties}>
									{i === 1 ? <em>{line}</em> : line}
								</span>
							</span>
						))}
					</h1>
					<p className="ed-lede ed-after search__lede">
						{posts.length} posts. Titles, tags, authors and dates.
					</p>
				</div>
			</header>

			<div className="ed-wrap search__body">
				<SearchInput
					query={query}
					setQuery={updateQuery}
					isSearchFocused={isSearchFocused}
					setIsSearchFocused={setIsSearchFocused}
					setSelectedResultIndex={setSelectedResultIndex}
				/>
				<SearchTips examples={examples} query={query} setQuery={updateQuery} />
				<SearchStats
					query={query}
					results={results}
					searchStats={searchStats}
				/>

				{query ? (
					<SearchResults
						results={results}
						selectedResultIndex={selectedResultIndex}
						setSelectedResultIndex={setSelectedResultIndex}
					/>
				) : (
					<section className="search__recent">
						<div className="ed-section__head">
							<h2 className="ed-h2">
								Recent <em>posts</em>
							</h2>
						</div>
						<ol className="ed-index">
							{posts.slice(0, 6).map((post, index) => (
								<ResultRow key={post.id} post={post} index={index} />
							))}
						</ol>
					</section>
				)}
			</div>
		</>
	);
}

export default Search;
