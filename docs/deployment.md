# Deployment

## Hosting

Deployed on [Vercel](https://vercel.com/) with automatic deployments from the `main` branch.

| Environment | URL | Branch |
|:---|:---|:---|
| **Production** | [rafay99.com](https://www.rafay99.com) | `main` |
| **Previews** | Auto-generated | Every PR |

## How it Works

- Push to `main` triggers a production deployment.
- Opening or updating a PR creates a preview deployment with a unique URL.
- The site uses SSR mode (`output: "server"`) with ISR caching for near-instant page loads.

## CI Pipeline

GitHub Actions runs on every push to `main` and every PR. The pipeline:

1. **Checks** (run in parallel, fail-fast):
   - Type Check (`tsc --noEmit`)
   - Astro Check (`astro check`)
   - Format Check (`biome format .`)
   - Lint Check (`biome lint .`)
2. **Build** (only if all checks pass):
   - `astro build`

CI only triggers when source files change (`.ts`, `.tsx`, `.astro`, `.mdx`, configs). Documentation-only changes skip CI.
