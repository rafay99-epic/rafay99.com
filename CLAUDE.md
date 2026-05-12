# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Astro 5 portfolio and blog site (rafay99.com) with React 19 islands, Tailwind CSS styling, and Vercel deployment with ISR.

**Important workflow guidelines for assistants:**

- **Use Bun only**: Always use `bun` as the package manager (`bun run ...`, `bun x ...`). Do **not** introduce other package managers (npm, pnpm, yarn) or change the existing tooling.
- **Dev server lifecycle**: Assume the dev server is already running during normal work sessions. Do **not** start or restart `bun run dev` unless explicitly asked.
- **Validate your changes**: After non-trivial code changes, you may verify your work with:
  - `bun run lint` / `bun run lint:fix` (Biome + TypeScript type check)
  - `bun run check` (Astro diagnostics for components/templates)

## Commands

```bash
# Development
bun run dev              # Start dev server
bun run preview          # Preview production build locally

# Building
bun run build            # Astro build only

# Code quality
bun run lint             # TypeScript type check (tsc --noEmit) + formatting check
bun run lint:fix         # Auto-format with Prettier
bun run check            # Astro diagnostics (template/component checks)

```

## Architecture

**Rendering**: SSR mode (`output: "server"`) on Vercel with ISR caching.

**Islands Architecture**: Astro components handle static content; React components (under `ReactComponent/`) provide client-side interactivity. React integration only includes files matching `**/ReactComponent/**` and `**/*.{jsx,tsx}`.

**Content Collections**: Two Zod-validated collections in `src/content/`:

- `blog/` (MDX) - articles with draft/archived/featured flags, tags, SEO fields
- `projects/` (MDX) - portfolio items with tech stack, categories, links

**Feature Flags**: `src/config/featureFlag/featureFlag.json` toggles site sections (blog, projects, wiki, etc.) and API endpoints. Check these flags when adding new pages or sections.

**API Routes**: `src/pages/api/` contains server endpoints (article, author, project). These are Astro API routes returning JSON.

**Layouts**: `src/layouts/` has per-content-type layouts (BlogPost, Project). `BaseHead.astro` in `src/components/AstroComponent/base/` handles shared `<head>` metadata.

## Path Aliases

```
@assets     → src/assets
@components → src/components
@astro      → src/components/AstroComponent
@react      → src/components/ReactComponent
@content    → src/content
@layouts    → src/layouts
@pages      → src/pages
@styles     → src/styles
@types      → src/types
@config     → src/config
@hooks      → src/hooks
@server     → src/server
@util       → src/util
```

## Key Conventions

- **Markdown**: Shiki syntax highlighting with Tokyo Night theme. Mermaid blocks excluded from syntax highlighting (rendered client-side). Reading time calculated via remark plugin (`remark-reading-time.mjs`).
- **Tailwind theme**: Custom color system defined in `src/config/theme/colors.ts` (Tokyo Night inspired). Poppins font. Custom `mobile` breakpoint at max 767px.
- **Build optimization**: Terser minification removes all `console.*` and `debugger` in production. Manual chunk splitting for react-vendor, ui-components, and vendor-mermaid.
- **React Compiler**: Enabled via babel plugin (`babel-plugin-react-compiler`).
- **Formatting**: Biome with tailwind plugin (class sorting). The codebase uses semicolons.
- **Content drafts**: Both `draft` and `archived` boolean fields control content visibility. Filter these when querying collections.
