## Why

The app is ready for production, but there is no automated verification or deployment path. A GitHub Actions pipeline gives every push and pull request consistent **lint, test, and build** checks, and automates **deployment** so releases are repeatable and traceable instead of manual local builds.

## What Changes

- Add **GitHub Actions workflows** under `.github/workflows/`:
  - **CI**: run on pull requests and pushes to the default branch—install dependencies with **pnpm**, run **eslint**, **vitest**, and **production build** (`tsc` + `vite build`).
  - **CD**: deploy the static **`dist`** output when CI succeeds on the chosen branch (e.g. `main`), using a documented strategy compatible with this **Vite + PWA** SPA (e.g. **GitHub Pages** or **upload-artifact** + host-specific action).
- Document **required secrets**, **Node/pnpm versions** aligned with `package.json` / `packageManager`, and any **`base`** / **environment** needs for the deploy target.
- Optionally add **branch protection** recommendations (not enforced in repo by this change alone).

## Capabilities

### New Capabilities

- `github-actions-pipeline`: Continuous integration (quality gates) and continuous deployment (static site) via GitHub Actions for this repository.

### Modified Capabilities

- _None_ (tooling and repo config only; no product feature specs change.)

## Impact

- New files: `.github/workflows/*.yml` (and possibly `README` or `docs/` notes for setup).
- **Deploy target** must be chosen in implementation (GitHub Pages vs Vercel/Netlify/S3, etc.); may require **`vite.config` `base`** or host env vars for correct asset URLs and service worker scope.
- **Secrets**: deploy steps typically need tokens (e.g. `GITHUB_TOKEN` for Pages, or provider API tokens).
