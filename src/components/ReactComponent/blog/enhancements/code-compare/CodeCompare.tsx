import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties } from "react";
import { memo, useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

type SyntaxStyle = {
	[key: string]: CSSProperties | SyntaxStyle;
};

const FILE_EXTENSION_TO_LANGUAGE: { [key: string]: string } = {
	js: "javascript",
	jsx: "jsx",
	ts: "typescript",
	tsx: "tsx",
	html: "html",
	css: "css",
	scss: "scss",
	less: "less",
	dart: "dart",
	kt: "kotlin",
	swift: "swift",
	java: "java",
	py: "python",
	rb: "ruby",
	php: "php",
	go: "go",
	rs: "rust",
	sh: "bash",
	bash: "bash",
	zsh: "bash",
	fish: "bash",
	json: "json",
	yaml: "yaml",
	yml: "yaml",
	xml: "xml",
	csv: "csv",
	toml: "toml",
	ini: "ini",
	env: "plaintext",
	md: "markdown",
	mdx: "markdown",
	sql: "sql",
	graphql: "graphql",
	dockerfile: "dockerfile",
};

interface CodeInput {
	content: string;
	filePath?: string;
	language?: string;
}

interface CodeCompareProps {
	code1: string | CodeInput;
	code2: string | CodeInput;
	file1Title?: string;
	file2Title?: string;
	showDiff?: boolean;
}

const getLanguageFromFilePath = (filePath: string): string => {
	const extension = filePath.split(".").pop()?.toLowerCase() || "";
	return FILE_EXTENSION_TO_LANGUAGE[extension] || "plaintext";
};

const fetchFileContent = async (filePath: string): Promise<string> => {
	try {
		const response = await fetch(filePath);
		if (!response.ok) {
			throw new Error(`Failed to fetch file: ${filePath}`);
		}
		return await response.text();
	} catch (error) {
		console.error("Error fetching file:", error);
		return `// Error loading file: ${filePath}\n// ${error}`;
	}
};

const processCodeInput = async (
	input: string | CodeInput,
): Promise<{ content: string; language: string }> => {
	if (typeof input === "string") {
		return {
			content: input,
			language: "plaintext",
		};
	}

	let content = input.content;

	if (input.filePath && !content) {
		content = await fetchFileContent(input.filePath);
	}

	const language =
		input.language ||
		(input.filePath ? getLanguageFromFilePath(input.filePath) : "plaintext");

	return {
		content,
		language,
	};
};

const tokyoNightTheme: SyntaxStyle = {
	'code[class*="language-"]': {
		color: "#a9b1d6",
		background: "transparent",
		textShadow: "none",
		fontFamily:
			'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
		fontSize: "14px",
		lineHeight: "1.5",
		direction: "ltr" as const,
		textAlign: "left" as const,
		whiteSpace: "pre",
		wordSpacing: "normal",
		wordBreak: "normal",
		MozTabSize: "2",
		OTabSize: "2",
		tabSize: "2",
		WebkitHyphens: "none",
		MozHyphens: "none",
		msHyphens: "none",
		hyphens: "none",
	},
	'pre[class*="language-"]': {
		color: "#a9b1d6",
		background: "transparent",
		textShadow: "none",
		fontFamily:
			'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
		fontSize: "14px",
		lineHeight: "1.5",
		direction: "ltr" as const,
		textAlign: "left" as const,
		whiteSpace: "pre",
		wordSpacing: "normal",
		wordBreak: "normal",
		MozTabSize: "2",
		OTabSize: "2",
		tabSize: "2",
		WebkitHyphens: "none",
		MozHyphens: "none",
		msHyphens: "none",
		hyphens: "none",
		padding: "1em",
		margin: "0",
		overflow: "auto",
		borderRadius: "0.5em",
	},
	'pre[class*="language-"]::-moz-selection': {
		background: "#3d59a1",
	},
	'pre[class*="language-"] ::-moz-selection': {
		background: "#3d59a1",
	},
	'code[class*="language-"]::-moz-selection': {
		background: "#3d59a1",
	},
	'code[class*="language-"] ::-moz-selection': {
		background: "#3d59a1",
	},
	'pre[class*="language-"]::selection': {
		background: "#3d59a1",
	},
	'pre[class*="language-"] ::selection': {
		background: "#3d59a1",
	},
	'code[class*="language-"]::selection': {
		background: "#3d59a1",
	},
	'code[class*="language-"] ::selection': {
		background: "#3d59a1",
	},
	':not(pre) > code[class*="language-"]': {
		background: "#1a1b26",
		padding: "0.1em 0.3em",
		borderRadius: "0.3em",
		whiteSpace: "normal",
	},
	comment: {
		color: "#565f89",
		fontStyle: "italic",
	},
	prolog: {
		color: "#565f89",
	},
	doctype: {
		color: "#565f89",
	},
	cdata: {
		color: "#565f89",
	},
	punctuation: {
		color: "#89ddff",
	},
	".namespace": {
		opacity: 0.7,
	},
	property: {
		color: "#7aa2f7",
	},
	tag: {
		color: "#7aa2f7",
	},
	boolean: {
		color: "#7aa2f7",
	},
	number: {
		color: "#ff9e64",
	},
	constant: {
		color: "#7aa2f7",
	},
	symbol: {
		color: "#7aa2f7",
	},
	selector: {
		color: "#9ece6a",
	},
	"attr-name": {
		color: "#9ece6a",
	},
	string: {
		color: "#9ece6a",
	},
	char: {
		color: "#9ece6a",
	},
	builtin: {
		color: "#7aa2f7",
	},
	inserted: {
		color: "#9ece6a",
	},
	operator: {
		color: "#89ddff",
	},
	entity: {
		color: "#7aa2f7",
		cursor: "help",
	},
	url: {
		color: "#9ece6a",
	},
	".language-css .token.string": {
		color: "#9ece6a",
	},
	".style .token.string": {
		color: "#9ece6a",
	},
	variable: {
		color: "#bb9af7",
	},
	atrule: {
		color: "#7aa2f7",
	},
	"attr-value": {
		color: "#9ece6a",
	},
	function: {
		color: "#7aa2f7",
	},
	"class-name": {
		color: "#7aa2f7",
	},
	keyword: {
		color: "#bb9af7",
	},
	regex: {
		color: "#89ddff",
	},
	important: {
		color: "#f7768e",
		fontWeight: "bold",
	},
	bold: {
		fontWeight: "bold",
	},
	italic: {
		fontStyle: "italic",
	},
	deleted: {
		color: "#f7768e",
	},
	"pre.diff-highlight.diff-highlight > code .token.deleted:not(.prefix)": {
		backgroundColor: "#f7768e33",
	},
	"pre > code.diff-highlight.diff-highlight .token.deleted:not(.prefix)": {
		backgroundColor: "#f7768e33",
	},
	"pre.diff-highlight.diff-highlight > code .token.inserted:not(.prefix)": {
		backgroundColor: "#9ece6a33",
	},
	"pre > code.diff-highlight.diff-highlight .token.inserted:not(.prefix)": {
		backgroundColor: "#9ece6a33",
	},
};

const CodeCompare = memo(function CodeCompare({
	code1,
	code2,
	file1Title = "Original",
	file2Title = "Modified",
}: CodeCompareProps) {
	const [view, setView] = useState<"split" | "unified">("split");
	const [copied, setCopied] = useState<string | null>(null);
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [processedCode1, setProcessedCode1] = useState<{
		content: string;
		language: string;
	}>({ content: "Loading...", language: "plaintext" });
	const [processedCode2, setProcessedCode2] = useState<{
		content: string;
		language: string;
	}>({ content: "Loading...", language: "plaintext" });
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadContent = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const [processed1, processed2] = await Promise.all([
					processCodeInput(code1),
					processCodeInput(code2),
				]);
				setProcessedCode1(processed1);
				setProcessedCode2(processed2);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load code");
				console.error("Error loading code:", err);
			} finally {
				setIsLoading(false);
			}
		};

		loadContent();
	}, [code1, code2]);

	const handleCopy = async (code: string, type: string) => {
		await navigator.clipboard.writeText(code);
		setCopied(type);
		setTimeout(() => setCopied(null), 2000);
	};

	const toggleFullScreen = () => {
		setIsFullScreen(!isFullScreen);
	};

	const customStyle = {
		borderRadius: "0.5rem",
		margin: 0,
		background: "transparent",
	};

	return (
		<motion.div
			layout
			className={`${
				isFullScreen
					? "fixed inset-0 z-50 overflow-auto bg-[var(--accent-dark)]"
					: "border-[var(--accent)]/20 bg-[var(--accent-dark)]/50 overflow-hidden rounded-xl border shadow-lg backdrop-blur-sm"
			}`}
		>
			<div className="border-[var(--accent)]/20 flex items-center justify-between border-b p-4">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<span className="font-medium text-[var(--text-light)]">
							{file1Title}
							{typeof code1 !== "string" && code1.filePath && (
								<span className="text-[var(--accent)]/70 ml-2 text-xs">
									({processedCode1.language})
								</span>
							)}
						</span>
						<span className="text-[var(--accent)]/50">vs</span>
						<span className="font-medium text-[var(--text-light)]">
							{file2Title}
							{typeof code2 !== "string" && code2.filePath && (
								<span className="text-[var(--accent)]/70 ml-2 text-xs">
									({processedCode2.language})
								</span>
							)}
						</span>
					</div>
					<div className="bg-[var(--accent)]/20 h-4 w-px" />
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setView("split")}
							className={`rounded-md px-3 py-1 text-sm transition-colors ${
								view === "split"
									? "bg-[var(--accent)] text-[var(--text-light)]"
									: "text-[var(--text-light)]/70 hover:text-[var(--text-light)]"
							}`}
						>
							Split
						</button>
						<button
							type="button"
							onClick={() => setView("unified")}
							className={`rounded-md px-3 py-1 text-sm transition-colors ${
								view === "unified"
									? "bg-[var(--accent)] text-[var(--text-light)]"
									: "text-[var(--text-light)]/70 hover:text-[var(--text-light)]"
							}`}
						>
							Unified
						</button>
					</div>
				</div>
				<button
					type="button"
					onClick={toggleFullScreen}
					className="bg-[var(--accent)]/10 text-[var(--text-light)]/70 hover:bg-[var(--accent)]/20 rounded-md px-3 py-1 text-sm transition-colors hover:text-[var(--text-light)]"
				>
					{isFullScreen ? "Exit Full Screen" : "Full Screen"}
				</button>
				{error && <div className="text-sm text-red-500">Error: {error}</div>}
			</div>

			<div
				className={`p-4 ${view === "split" ? "grid grid-cols-2 gap-4" : "space-y-4"}`}
			>
				<AnimatePresence mode="wait">
					{isLoading ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="col-span-2 flex items-center justify-center p-8"
						>
							<div className="text-[var(--text-light)]/70">Loading code...</div>
						</motion.div>
					) : (
						<>
							{(view === "split" || view === "unified") && (
								<motion.div
									key="code1"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
									className="group relative"
								>
									<button
										type="button"
										onClick={() => handleCopy(processedCode1.content, "code1")}
										className="bg-[var(--accent-dark)]/80 absolute right-2 top-2 z-10 rounded-md px-3 py-1 text-sm text-[var(--text-light)] opacity-0 transition-opacity hover:bg-[var(--accent)] group-hover:opacity-100"
									>
										{copied === "code1" ? "Copied!" : "Copy"}
									</button>
									<SyntaxHighlighter
										language={processedCode1.language}
										style={tokyoNightTheme}
										customStyle={customStyle}
										showLineNumbers
										wrapLines
										wrapLongLines
									>
										{processedCode1.content}
									</SyntaxHighlighter>
								</motion.div>
							)}
							{view === "split" && (
								<motion.div
									key="code2"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
									className="group relative"
								>
									<button
										type="button"
										onClick={() => handleCopy(processedCode2.content, "code2")}
										className="bg-[var(--accent-dark)]/80 absolute right-2 top-2 z-10 rounded-md px-3 py-1 text-sm text-[var(--text-light)] opacity-0 transition-opacity hover:bg-[var(--accent)] group-hover:opacity-100"
									>
										{copied === "code2" ? "Copied!" : "Copy"}
									</button>
									<SyntaxHighlighter
										language={processedCode2.language}
										style={tokyoNightTheme}
										customStyle={customStyle}
										showLineNumbers
										wrapLines
										wrapLongLines
									>
										{processedCode2.content}
									</SyntaxHighlighter>
								</motion.div>
							)}
						</>
					)}
				</AnimatePresence>
			</div>
		</motion.div>
	);
});

export default CodeCompare;
