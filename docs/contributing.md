# Contributing

Contributions are welcome. Follow these rules to keep things smooth.

## Rules

- PRs must target the **`testing`** branch, not `main`. PRs to `main` will be redirected.
- All four CI checks (type check, astro check, format, lint) must pass before merge.
- Use [conventional commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `refactor:`, etc.
- One concern per PR. Don't bundle unrelated changes.
- Keep PRs small and reviewable.

## How to Contribute

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/Astro-Portfolio-Blog.git
   cd Astro-Portfolio-Blog
   ```
3. **Install** dependencies:
   ```bash
   bun install
   ```
4. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
5. **Make** your changes
6. **Verify** locally:
   ```bash
   bun run lint
   bun run check
   bun run build
   ```
7. **Commit** your changes:
   ```bash
   git commit -m 'feat: add your feature'
   ```
8. **Push** to your fork:
   ```bash
   git push origin feature/your-feature
   ```
9. **Open** a Pull Request targeting the **`testing`** branch

## Code Style

- **Formatter & Linter**: [Biome](https://biomejs.dev/) handles both. Run `bun run format` before committing.
- **TypeScript**: Strict mode enabled. No `any` types.
- **Semicolons**: Yes, the codebase uses them.
- **Indentation**: Tabs (configured in `biome.json`).
