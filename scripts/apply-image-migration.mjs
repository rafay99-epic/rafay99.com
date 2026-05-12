#!/usr/bin/env node

/**
 * Applies the UploadThing image migration mapping to all content files.
 *
 * Usage:
 *   bun run scripts/apply-image-migration.mjs
 *
 * Reads scripts/image-migration-map.json and updates:
 *   - heroImage in blog frontmatter
 *   - ProjectImage in project frontmatter
 *   - Inline markdown image references ![alt](/BlogImages/...)
 *   - authorAvatar references
 *
 * Pass --dry-run to preview changes without writing.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const MAP_FILE = join(ROOT, "scripts/image-migration-map.json");
const CONTENT_DIRS = [
	join(ROOT, "src/content/blog"),
	join(ROOT, "src/content/projects"),
];
const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
	let mapping;
	try {
		mapping = JSON.parse(await readFile(MAP_FILE, "utf-8"));
	} catch {
		console.error(
			"Error: image-migration-map.json not found. Run migrate-images-to-uploadthing.mjs first.",
		);
		process.exit(1);
	}

	console.log(`Loaded ${Object.keys(mapping).length} image mappings`);
	if (DRY_RUN) console.log("DRY RUN — no files will be modified\n");

	// Sort by longest path first so /BlogImages/leadfinder/foo.webp matches before /BlogImages/leadfinder.webp
	const sortedPaths = Object.keys(mapping).sort((a, b) => b.length - a.length);

	let filesModified = 0;
	let replacementsMade = 0;

	for (const dir of CONTENT_DIRS) {
		const files = await readdir(dir, { recursive: true });

		for (const file of files) {
			if (!/\.(md|mdx)$/i.test(file)) continue;

			const filepath = join(dir, file);
			const original = await readFile(filepath, "utf-8");
			let content = original;

			for (const oldPath of sortedPaths) {
				// Match the path in frontmatter (with or without quotes) and markdown
				if (content.includes(oldPath)) {
					content = content.replaceAll(oldPath, mapping[oldPath]);
					replacementsMade++;
				}
			}

			if (content !== original) {
				filesModified++;
				const relPath = filepath.replace(ROOT, "");
				if (DRY_RUN) {
					console.log(`  Would update: ${relPath}`);
				} else {
					await writeFile(filepath, content);
					console.log(`  Updated: ${relPath}`);
				}
			}
		}
	}

	console.log(
		`\n${DRY_RUN ? "Would modify" : "Modified"} ${filesModified} files with ${replacementsMade} replacements.`,
	);

	if (!DRY_RUN && filesModified > 0) {
		console.log("\nNext steps:");
		console.log("  1. Run: bun run check");
		console.log("  2. Run: bun run build");
		console.log(
			"  3. If everything works, delete public/BlogImages/ and public/ProjectImages/",
		);
		console.log("  4. Update remotePatterns in astro.config.mjs if needed");
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
