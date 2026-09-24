import type { Post } from "./articles";

export type { Post };

export type SearchStatsData = {
	totalResults: number;
	searchTime: number;
	relevanceScore: number;
	matchedFields: string[];
};

export type SearchInputProps = {
	query: string;
	setQuery: (query: string) => void;
	isSearchFocused: boolean;
	setIsSearchFocused: (focused: boolean) => void;
	setSelectedResultIndex: (index: number) => void;
};

export type SearchTipsProps = {
	examples: string[];
	query: string;
	setQuery: (query: string) => void;
};

export type SearchStatsProps = {
	query: string;
	results: Post[];
	searchStats: SearchStatsData;
};

export type SearchResultsProps = {
	results: Post[];
	selectedResultIndex: number;
	setSelectedResultIndex: (index: number) => void;
};

export type SearchState = {
	query: string;
	setQuery: (query: string) => void;
	results: Post[];
	searchStats: SearchStatsData;
	searchHistory: string[];
	clearHistory: () => void;
};

export type SearchCache = {
	results: Post[];
	stats: SearchStatsData;
	timestamp: number;
};
