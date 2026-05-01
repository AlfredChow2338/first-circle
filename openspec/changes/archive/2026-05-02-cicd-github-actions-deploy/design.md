## Context

- Stack: **Vite 8**, **React 19**, **pnpm** (`packageManager` in `package.json`), **Vitest**, **ESLint**. Scripts: `lint`, `test`, `build` (`tsc --noEmit && vite build`).
- **PWA** with `injectManifest` service worker; static output in **`dist/`**.
- No `.github/workflows` today; deploy target not fixed in repo.

## Goals / Non-Goals

**Goals:**

- **CI** on **pull_request** and **push** to the default branch: install deps with **pnpm**, run **`pnpm lint`**, **`pnpm test`**, **`pnpm build`**; fail the workflow on any non-zero exit.
- **CD**: after successful CI on the deployment branch, publish **`dist`** to a **static host** with a documented default of **GitHub Pages** (fits OSS, no extra vendor account).
- Pin **Node** (e.g. **22.x** or **20.x** LTS) and use **pnpm** via **Corepack** or **pnpm/action-setup** for reproducible installs.
- Document **permissions**, **secrets**, and **Vite `base`** implications for subpath hosting.

**Non-Goals:**

- Migrating hosting to a specific paid provider in this design (optional follow-up).
- Replacing local dev workflow or adding Nx/turborepo.
- Enforcing GitHub branch protection rules in YAML (document only).

## Decisions

1. **Split CI and deploy workflows**  
   - **`.github/workflows/ci.yml`**: triggers on `pull_request` and `push` (all branches or limited to `main` + PRs—implementation can use `push` to `main` + `pull_request` for CI coverage).  
   - **`.github/workflows/deploy.yml`**: triggers on **`push` to `main`** (or `workflow_run` after CI on `main`) so deploy only runs when the branch is green.  
   - **Rationale**: Clear separation; PRs get CI only; `main` gets CI then deploy.

2. **pnpm setup**  
   - Use **`pnpm/action-setup@v4`** with version matching `package.json` **`packageManager`** (e.g. `10.33.2`), plus **`actions/setup-node@v4`** with **`cache: 'pnpm'`**.  
   - **Alternative:** Corepack-only—acceptable but explicit pnpm action is easier to read.

3. **Default deploy: GitHub Pages**  
   - Use official pattern: **`actions/upload-pages-artifact`** + **`actions/deploy-pages`** (or maintained equivalent), with **`permissions`** `contents: read`, `pages: write`, `id-token: write`.  
   - **Rationale**: No third-party secret for basic `GITHUB_TOKEN` Pages deploy.  
   - **Trade-off:** Project Pages URL is **`https://<user>.github.io/<repo>/`**; **`vite.config.ts` `base`** MUST be **`/<repository-name>/`** (or use env-driven `base` in CI) so assets and **service worker** scope work.

4. **Node version**  
   - Pin **Node 22** in workflow `node-version-file: package.json` only if `engines` added; otherwise pin **`node-version: '22'`** explicitly in YAML.  
   - **Migration:** Add optional `"engines": { "node": ">=20" }` later for alignment.

5. **Secrets**  
   - **GitHub Pages**: default **`GITHUB_TOKEN`** with Pages permissions—no extra secret for public repo standard deploy.  
   - **Other hosts** (Vercel/Netlify/S3): document placeholder secrets in tasks (out of scope for default path).

## Risks / Trade-offs

- **Wrong `base` → blank app on GH Pages** → Mitigation: set `base` in Vite for repo subpath or use a **custom domain** at root `/`.  
- **PWA / SW on subpath** → Mitigation: align **`base`** and **`VitePWA`** `scope` if needed (verify in implementation).  
- **Workflow duplication** → Mitigation: reuse a **composite action** or **reusable workflow** only if duplication hurts maintenance (start simple).

## Migration Plan

1. Land workflows + any minimal **`base`** / **docs** updates.  
2. Enable **GitHub Pages** in repo settings (Source: **GitHub Actions**).  
3. Push to **`main`**; confirm site loads and SW registers.  
4. **Rollback:** disable Pages or revert workflow; previous deployments remain until overwritten.

## Open Questions

- Exact **default branch** name (`main` vs `master`)—match repo default in YAML.  
- Whether to add **`concurrency`** groups to cancel redundant deploys (recommended for `deploy.yml`).
