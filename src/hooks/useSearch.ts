import Fuse, { type IFuseOptions } from "fuse.js";
import { useEffect, useRef, useState } from "react";
import type { Post } from "types/articles";
import type { SearchCache, SearchState } from "types/search";

const CACHE_DURATION = 5 * 60 * 1000;
const MAX_CACHE_SIZE = 50;
const MAX_HISTORY_ITEMS = 10;
const SEARCH_HISTORY_KEY = "search_history:v1";
const DEBOUNCE_MS = 250;
const HISTORY_COMMIT_MS = 1000;
const MAX_RENDERED_RESULTS = 30;

const FUSE_CONFIG: IFuseOptions<Post> = {
	keys: [
		{ name: "data.title", weight: 2.0 },
		{ name: "data.description", weight: 1.5 },
		{ name: "data.tags", weight: 1.8 },
		{ name: "data.authorName", weight: 1.2 },
		{
			name: "data.pubDate",
			weight: 1.0,
			getFn: (obj: Post) => {
				const date = new Date(obj.data.pubDate);
				const iso = date.toISOString().slice(0, 10);
				const long = date.toLocaleString("en-US", {
					month: "long",
					year: "numeric",
				});
				return `${iso} ${long}`;
			},
		},
	],
	threshold: 0.4,
	includeScore: true,
	useExtendedSearch: true,
	ignoreLocation: true,
	fieldNormWeight: 1.5,
	shouldSort: true,
};

const INTENT_PATTERNS: Record<string, RegExp> = {
	date: /^(date:|on:)?\s*(\d{4}(-\d{2})?(-\d{2})?|yesterday|today|last\s+week|last\s+month|this\s+month)/i,
	tag: /^(tag:|tags:|#)\s*\w+/i,
	author: /^(author:|by:)\s*\w+/i,
};

const PREFIX_PATTERN = /^(date:|tag:|tags:|#|author:|by:|on:)\s*/;

type SearchIntentType = "date" | "tag" | "author" | "general";

const detectSearchIntent = (query: string): SearchIntentType => {
	for (const [type, pattern] of Object.entries(INTENT_PATTERNS)) {
		if (pattern.test(query)) return type as SearchIntentType;
	}
	return "general";
};

const stripIntentPrefix = (query: string): string =>
	query.replace(PREFIX_PATTERN, "");

const processSearchTerms = (query: string): string =>
	query
		.split(" ")
		.filter((term) => term.length > 0)
		.map((term) => {
			if (term.startsWith('"') && term.endsWith('"') && term.length > 2)
				return `=${term.slice(1, -1)}`;
			if (term.startsWith("-") && term.length > 1) return `!${term.slice(1)}`;
			if (term.startsWith("+") && term.length > 1) return `'${term.slice(1)}`;
			return term;
		})
		.join(" ");

const calculateRelevance = (
	fuseScore: number,
	pubDate: Date,
	intentType: SearchIntentType,
): number => {
	const baseScore = 1 - fuseScore;

	const ageInDays = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60 * 24);
	const freshnessBoost = Math.max(0, 0.15 * (1 - ageInDays / (5 * 365)));

	const intentBonus = intentType !== "general" ? 0.1 : 0;

	return baseScore + freshnessBoost + intentBonus;
};

const searchCache = new Map<string, SearchCache>();

const getFromCache = (query: string): SearchCache | null => {
	const cached = searchCache.get(query);
	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		return cached;
	}
	if (cached) searchCache.delete(query);
	return null;
};

const addToCache = (
	query: string,
	searchResults: Post[],
	stats: SearchState["searchStats"],
): void => {
	searchCache.delete(query);
	if (searchCache.size >= MAX_CACHE_SIZE) {
		const oldestKey = searchCache.keys().next().value;
		if (oldestKey !== undefined) searchCache.delete(oldestKey);
	}
	searchCache.set(query, {
		results: searchResults,
		stats,
		timestamp: Date.now(),
	});
};

const loadSearchHistory = (): string[] => {
	try {
		const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed
			.filter((item): item is string => typeof item === "string")
			.slice(0, MAX_HISTORY_ITEMS);
	} catch {
		return [];
	}
};

const saveSearchHistory = (history: string[]): void => {
	try {
		localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
	} catch {}
};

const useSearch = (posts: Post[]): SearchState => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<Post[]>([]);
	const [searchStats, setSearchStats] = useState<SearchState["searchStats"]>({
		totalResults: 0,
		searchTime: 0,
		relevanceScore: 0,
		matchedFields: [],
	});
	const [searchHistory, setSearchHistory] =
		useState<string[]>(loadSearchHistory);
	const historyTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);

	const clearHistory = () => {
		setSearchHistory([]);
	};

	useEffect(() => {
		saveSearchHistory(searchHistory);
	}, [searchHistory]);

	useEffect(() => {
		const filteredPosts = posts.filter(
			(post) => !post.data.draft && !post.data.archived,
		);

		const fuse = new Fuse(filteredPosts, FUSE_CONFIG);

		const performSearch = (searchQuery: string) => {
			if (!searchQuery.trim()) {
				setResults([]);
				setSearchStats({
					totalResults: 0,
					searchTime: 0,
					relevanceScore: 0,
					matchedFields: [],
				});
				return;
			}

			const cached = getFromCache(searchQuery);
			if (cached) {
				setResults(cached.results);
				setSearchStats(cached.stats);
				return;
			}

			const startTime = performance.now();
			const intentType = detectSearchIntent(searchQuery);

			let processedQuery = searchQuery;
			if (intentType !== "general") {
				processedQuery = stripIntentPrefix(searchQuery);
			}
			processedQuery = processSearchTerms(processedQuery);

			const fuseResults = fuse.search(processedQuery);

			const scoredResults = fuseResults
				.filter((r) => r.score != null)
				.map((r) => ({
					post: r.item,
					relevance: calculateRelevance(
						r.score ?? 0,
						r.item.data.pubDate,
						intentType,
					),
				}))
				.sort((a, b) => b.relevance - a.relevance);

			const avgRelevance = scoredResults.length
				? scoredResults.reduce((sum, r) => sum + r.relevance, 0) /
					scoredResults.length
				: 0;

			const rankedPosts = scoredResults
				.slice(0, MAX_RENDERED_RESULTS)
				.map((r) => r.post);

			const searchTime = Math.round(performance.now() - startTime);
			const stats: SearchState["searchStats"] = {
				totalResults: scoredResults.length,
				searchTime,
				relevanceScore: avgRelevance,
				matchedFields: [],
			};

			setResults(rankedPosts);
			setSearchStats(stats);
			addToCache(searchQuery, rankedPosts, stats);
		};
		const id = setTimeout(() => performSearch(query), DEBOUNCE_MS);
		return () => clearTimeout(id);
	}, [query, posts]);

	useEffect(() => {
		clearTimeout(historyTimerRef.current);
		if (query.trim()) {
			historyTimerRef.current = setTimeout(() => {
				setSearchHistory((prev) =>
					[query, ...prev.filter((q) => q !== query)].slice(
						0,
						MAX_HISTORY_ITEMS,
					),
				);
			}, HISTORY_COMMIT_MS);
		}
		return () => clearTimeout(historyTimerRef.current);
	}, [query]);

	return {
		query,
		setQuery,
		results,
		searchStats,
		searchHistory,
		clearHistory,
	};
};

export default useSearch;
