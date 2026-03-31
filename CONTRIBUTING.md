# Contributing

## Add A Tool

1. Fork the repository and create a branch.
2. Register the tool in `lib/tools.ts`.
3. Create `app/tools/{slug}/page.tsx`.
4. Wrap the page content with `ToolLayout`.
5. Run `npm run build` before opening a PR.

## Guidelines

- Keep tools browser-first when possible.
- Prefer self-contained pages with minimal shared dependencies.
- Reuse `components/ToolLayout.tsx` and shared helpers when it improves consistency.

## Pull Requests

- Keep changes focused.
- Include validation notes in the PR description.
- If you add dependencies, explain why they are needed.
