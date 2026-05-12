# Architecture

## Tech Stack

| Layer | Technology |
|:---|:---|
| **Framework** | Astro 5 (SSR, ISR) |
| **UI** | React 19, Framer Motion, Lucide Icons |
| **Styling** | Tailwind CSS, Typography plugin |
| **Content** | MDX, Zod schemas |
| **Language** | TypeScript (strict) |
| **Runtime** | Bun |
| **Lint & Format** | Biome |
| **Hosting** | Vercel |

## Islands Architecture

Astro components handle static content and ship zero JavaScript. React components (under `ReactComponent/`) provide client-side interactivity and are hydrated as islands. The React integration only includes files matching `**/ReactComponent/**` and `**/*.{jsx,tsx}`.

## Content Collections

Two Zod-validated collections in `src/content/`:

- **blog/** (MDX) — articles with draft/archived/featured flags, tags, SEO fields
- **projects/** (MDX) — portfolio items with tech stack, categories, links

Both `draft` and `archived` boolean fields control visibility. Filter these when querying collections.

## Feature Flags

`src/config/featureFlag/featureFlag.json` toggles site sections (blog, projects, wiki, etc.) and API endpoints. Check these flags when adding new pages or sections.

## Styling

- Custom Tokyo Night-inspired color system defined in `src/config/theme/colors.ts`
- Poppins font, custom `mobile` breakpoint at max 767px
- Shiki syntax highlighting with Tokyo Night theme
- Mermaid diagrams rendered client-side

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
