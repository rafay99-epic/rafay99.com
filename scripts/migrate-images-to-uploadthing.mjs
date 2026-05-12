#!/usr/bin/env node

/**
 * Migrates images from public/BlogImages and public/ProjectImages to UploadThing.
 *
 * Usage:
 *   UPLOADTHING_TOKEN=your-token bun run scripts/migrate-images-to-uploadthing.mjs
 *
 * Steps:
 *   1. Uploads all images to UploadThing
 *   2. Writes a mapping file (scripts/image-migration-map.json)
 *   3. Run scripts/apply-image-migration.mjs to update frontmatter
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, extname, join, relative } from "node:path";
import { UTApi } from "uploadthing/server";

const ROOT = new URL("..", import.meta.url).pathname;
const DIRS_TO_MIGRATE = ["public/BlogImages", "public/ProjectImages"];
const MAP_FILE = join(ROOT, "scripts/image-migration-map.json");
const CONCURRENCY = 10;

async function collectFiles(dir) {
	const abs = join(ROOT, dir);
	const entries = [];

	async function walk(current) {
		const items = await readdir(current, { withFileTypes: true });
		for (const item of items) {
			const full = join(current, item.name);
			if (item.isDirectory()) {
				await walk(full);
			} else if (/\.(webp|png|jpg|jpeg|gif|svg|avif)$/i.test(item.name)) {
				entries.push(full);
			}
		}
	}

	await walk(abs);
	return entries;
}

function getMimeType(filepath) {
	const ext = extname(filepath).toLowerCase();
	const map = {
		".webp": "image/webp",
		".png": "image/png",
		".jpg": "image/jpeg",
		".jpeg": "image/jpeg",
		".gif": "image/gif",
		".svg": "image/svg+xml",
		".avif": "image/avif",
	};
	return map[ext] || "application/octet-stream";
}

async function main() {
	if (!process.env.UPLOADTHING_TOKEN) {
		console.error(
			"Error: UPLOADTHING_TOKEN env var is required.\n" +
				"Usage: UPLOADTHING_TOKEN=your-token bun run scripts/migrate-images-to-uploadthing.mjs",
		);
		process.exit(1);
	}

	const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });

	// Load existing mapping if resuming
	let mapping = {};
	try {
		const existing = await readFile(MAP_FILE, "utf-8");
		mapping = JSON.parse(existing);
		console.log(
			`Resuming: ${Object.keys(mapping).length} images already mapped`,
		);
	} catch {
		// Fresh start
	}

	// Collect all image files
	const allFiles = [];
	for (const dir of DIRS_TO_MIGRATE) {
		const files = await collectFiles(dir);
		allFiles.push(...files);
	}

	console.log(`Found ${allFiles.length} images to migrate`);

	// Filter out already-uploaded files
	const pending = allFiles.filter((f) => {
		const publicPath = `/${relative(join(ROOT, "public"), f)}`;
		return !mapping[publicPath];
	});

	console.log(
		`${pending.length} images pending upload (${allFiles.length - pending.length} already done)`,
	);

	// Upload in batches
	let uploaded = 0;
	let failed = 0;

	for (let i = 0; i < pending.length; i += CONCURRENCY) {
		const batch = pending.slice(i, i + CONCURRENCY);

		const uploads = await Promise.allSettled(
			batch.map(async (filepath) => {
				const buffer = await readFile(filepath);
				const name = basename(filepath);
				const file = new File([buffer], name, { type: getMimeType(filepath) });

				const result = await utapi.uploadFiles(file);

				if (result.error) {
					throw new Error(`${name}: ${result.error.message}`);
				}

				const publicPath = `/${relative(join(ROOT, "public"), filepath)}`;
				return { publicPath, url: result.data.url };
			}),
		);

		for (const result of uploads) {
			if (result.status === "fulfilled") {
				mapping[result.value.publicPath] = result.value.url;
				uploaded++;
			} else {
				console.error(`  FAILED: ${result.reason.message}`);
				failed++;
			}
		}

		// Save progress after each batch
		await writeFile(MAP_FILE, JSON.stringify(mapping, null, "\t"));
		console.log(
			`  Progress: ${uploaded}/${pending.length} uploaded, ${failed} failed`,
		);
	}

	console.log(`\nDone. ${uploaded} uploaded, ${failed} failed.`);
	console.log(`Mapping saved to: ${MAP_FILE}`);
	console.log(`\nNext step: bun run scripts/apply-image-migration.mjs`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
