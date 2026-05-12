# Scripts

## Development

| Command | Description |
|:---|:---|
| `bun run dev` | Start dev server |
| `bun run build` | Production build |
| `bun run preview` | Preview production build locally |

## Code Quality

| Command | Description |
|:---|:---|
| `bun run check` | Astro diagnostics (template/component checks) |
| `bun run typecheck` | TypeScript type check (`tsc --noEmit`) |
| `bun run lint` | Biome check + TypeScript type check |
| `bun run lint:fix` | Auto-fix lint issues with Biome |

## Formatting

| Command | Description |
|:---|:---|
| `bun run format` | Format code with Biome |
| `bun run format:check` | Check formatting without writing |
| `bun run lint:check` | Run Biome lint rules only |

## CI

The `ci` script runs all checks sequentially then builds:

```bash
bun run ci
# biome check . && tsc --noEmit --skipLibCheck && astro check && astro build
```

In GitHub Actions, the four checks run in parallel with `fail-fast: true` — if any fails, the others are cancelled. Build only runs after all checks pass.
