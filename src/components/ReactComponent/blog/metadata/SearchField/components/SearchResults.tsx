import { accentAt, formatDate } from "@astro/editorial/format";
import type { CSSProperties } from "react";
import type { SearchResultsProps } from "types/search";

type ResultPost = SearchResultsProps["results"][number];

function SearchResults({
	results,
	selectedResultIndex,
	setSelectedResultIndex,
}: SearchResultsProps) {
	if (results.length === 0) return null;

	return (
		<ol className="ed-index">
			{results.map((post, index) => (
				<ResultRow
					key={post.id}
					post={post}
					index={index}
					isSelected={selectedResultIndex === index}
					onHover={() => setSelectedResultIndex(index)}
				/>
			))}
		</ol>
	);
}

export function ResultRow({
	post,
	index,
	isSelected = false,
	onHover,
}: {
	post: ResultPost;
	index: number;
	isSelected?: boolean;
	onHover?: () => void;
}) {
	const date = new Date(post.data.pubDate);
	return (
		<li
			className={`ed-row search__row${isSelected ? " is-selected" : ""}`}
			data-result-index={index}
			style={{ "--c": accentAt(index), "--i": index } as CSSProperties}
			onMouseEnter={onHover}
		>
			<time className="ed-row__meta" dateTime={date.toISOString()}>
				{formatDate(date)}
			</time>
			<div>
				<a className="ed-row__hit" href={`/blog/${post.id}/`}>
					<h3 className="ed-row__title">{post.data.title}</h3>
				</a>
				<p className="ed-row__desc">{post.data.description}</p>
			</div>
			<p className="ed-row__meta is-end">
				{post.data.tags
					?.slice(0, 2)
					.map((tag) => `#${tag}`)
					.join(" ")}
			</p>
		</li>
	);
}

export default SearchResults;
