## 1. CI workflow

- [x] 1.1 Add `.github/workflows/ci.yml` triggered on `pull_request` and `push` (cover `main` and PRs; adjust branch names if the repo default differs).
- [x] 1.2 Configure **pnpm** (`pnpm/action-setup` + `actions/setup-node` with `cache: 'pnpm'`) and a pinned **Node** version (e.g. `22`).
- [x] 1.3 Add job steps: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm test`, `pnpm build`.

## 2. Deploy workflow and hosting

- [x] 2.1 Add `.github/workflows/deploy.yml` that runs on `push` to `main` (or after successful `ci` via `workflow_run`—pick one pattern from `design.md` and implement consistently).
- [x] 2.2 Ensure deploy job runs **`pnpm build`** or downloads **`dist`** from CI artifacts; publish **`dist`** to **GitHub Pages** using `actions/upload-pages-artifact` and `actions/deploy-pages` (or current recommended equivalents) with required **`permissions`**.
- [x] 2.3 Set **Vite `base`** (or env-driven base) so the app and **PWA service worker** work under **`/<repository-name>/`** on GitHub Pages; verify in a preview deployment.

## 3. Documentation and verification

- [x] 3.1 Document in **`README.md`** (or `docs/`): enabling Pages (**Build and deployment → Source: GitHub Actions**), expected site URL, and any manual secrets for alternate hosts.
- [x] 3.2 Run workflows on a test PR/push; confirm CI green and deployed site loads core routes and offline/PWA behavior as expected.
