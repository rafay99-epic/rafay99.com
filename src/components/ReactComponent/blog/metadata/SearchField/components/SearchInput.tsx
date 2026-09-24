import { useEffect, useRef } from "react";
import type { SearchInputProps } from "types/search";

function SearchInput({
	query,
	setQuery,
	isSearchFocused,
	setIsSearchFocused,
	setSelectedResultIndex,
}: SearchInputProps) {
	const blurTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);

	const handleBlur = () => {
		clearTimeout(blurTimerRef.current);
		blurTimerRef.current = setTimeout(() => setIsSearchFocused(false), 150);
	};

	const handleFocus = () => {
		clearTimeout(blurTimerRef.current);
		setIsSearchFocused(true);
	};

	useEffect(() => {
		return () => clearTimeout(blurTimerRef.current);
	}, []);

	return (
		<div className="search__field">
			<input
				id="search-input"
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onFocus={handleFocus}
				onBlur={handleBlur}
				placeholder="Type to search"
				aria-label="Search articles"
				autoComplete="off"
				autoCapitalize="off"
				enterKeyHint="search"
				spellCheck={false}
				className="search__input"
			/>
			<div className="ed-mono search__keys">
				{query ? (
					<button
						type="button"
						className="ed-link"
						onClick={() => {
							setQuery("");
							setSelectedResultIndex(-1);
						}}
					>
						clear
					</button>
				) : (
					<span className="search__hint">
						<kbd>/</kbd> to focus
					</span>
				)}
				{isSearchFocused && (
					<span className="search__nav-keys">
						<kbd>↑↓</kbd> move <kbd>↵</kbd> open <kbd>esc</kbd> clear
					</span>
				)}
			</div>
		</div>
	);
}

export default SearchInput;
