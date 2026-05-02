# Batch Transaction Processing System

Demo URL: https://alfredchow2338.github.io/first-circle/

### AI Practices

- Editor: Cursor; Agent: Cursor, Claude; Model: Cursor Composer 2, Opus 4.7, Sonnet 4.6; MCP: Pencil; Skills: UIUX Pro Max, Vercel (React), OpenSpec, Web design guidelines.
- Skills are shared via symlink in `.cursor/skills/`, `.claude/skills/`, `.agents/skills/` **SKILL.md**
- _OpenSpec_ Spec-driven change lifecycle: explore → proposal → design → specs → tasks → implement → archive in `openspec/`
- Subagent: A separate agent run delegated by the parent e.g. tech design, explore-only, engineer (Task tool / subagent types)

### Web Engineering Practices

1. ✅ OfflService Worker & Offline-First Architecture (PWA)
2. ✅ IndexedDB caching for persisted transactions during hydration
3. ✅ Web Worker for Main Thread Offloading to prevent UI jank
4. ✅ Search Input Throttling
5. ✅ Build Optimization with Gzip and React Compiler (Auto Memoization)
6. ✅ Code Splitting & Lazy Loading & Tree Shaking with Vite
7. ✅ Critical CSS Extraction with Beasties improves FCP
8. ✅ Vanilla Extract (Zero-Runtime CSS-in-JS & Optimal cache efficiency)
9. ✅ TypeScript Strict Mode & Eslint rules & Prettier auto format
10. ✅ Expontentital backoff retry for large dataset process else rollback imprvoes error prone
11. ✅ Client-side pagination for better readability
12. 📈 Virtual listing eg. `react-window` in case no pagination

### Security Protection

1. ✅ CSV formula sanitization to prevent potential injection
2. ✅ Hard limit of 10 MB and 10,000 data rows to prevent denial-of-service / resource abuse (in case uploading to server / storage)
3. ✅ CSP, Permissions and Referrer-Policies (strict-origin-when-cross-origin)
4. ✅ Regular audit and dependabot to prevent potential supply chain attacks
5. 📈 Future: Server-side storage, encryption at rest (with keys not only in the client), authorization, retention policies, and no long-lived PII in client storage without explicit product/legal sign-off.

### Tech stack (React and TypeScript friendly)

- @tanstack/react-table
  - Headless architecture gives full UI control while keeping powerful table logic (sorting/filtering/pagination).
  - Excellent TypeScript support for strongly-typed columns and cells.
  - Performs well for complex data tables and scales with feature growth.

- react-hook-form
  - Minimal re-renders via uncontrolled inputs, so forms stay fast.
  - Great DX with simple APIs and clean validation/error handling.
  - Easy integration with schema validators (like zod) and custom inputs.

- zod
  - Runtime validation + static TypeScript inference from one schema source.
  - Clear, composable schemas that are easy to maintain and reuse.
  - Safer parsing with predictable error structures for UI messaging.

- papaparse
  - Mature CSV parser with robust handling of edge cases (quotes, delimiters, malformed rows).
  - Browser-friendly and fast for client-side parsing.
  - Supports step/chunk parsing patterns for larger files.

- zustnd
  - Lightweight state management with low boilerplate and readable store patterns.
  - Flexible: simple local state up to app-wide state, with middleware support (persist, etc.).
  - Works very well with React hooks and TypeScript.

- Radix dialog/tooltip
  - Accessibility-first primitives (keyboard navigation, focus management, ARIA behavior).
  - Unstyled components let you keep your own design system.
  - Reliable behavior for tricky UI interactions across browsers.

- Vitest
  - Very fast test runs with Vite-native integration.
  - Jest-like API makes adoption easy.
  - Good TypeScript and ESM support out of the box.

- Reat Testing Library (RTL)
  - Encourages user-centric testing (interactions and visible behavior over internals).
  - Produces more resilient tests during refactors.
  - Great ecosystem integration (jest-dom, user-event) for realistic UI testing.

- IDB (IndexedDB)
  - Much cleaner promise-based API over raw IndexedDB.
  - Great for larger client-side persistence than localStorage.
  - Supports structured object storage and transactional semantics for safer data operations.

- vanilla-extract/css
  - Type-safe - ClassNames are typed and autocompleted
  - Scoped - No CSS conflicts or naming collisions
  - Tree-shakeable - Unused styles are removed from production

- Package manager: Pnpm 10
  - Disk and install speed: pnpm keeps one global store of package contents and links them into each project with hard links.

  - Strict, predictable node_modules layout: packages can only import what they declare in their own package.json, not arbitrary nested deps.

  - First-class monorepo support: efficient linking across packages are built in.

### CI/CD (GitHub Actions)

- **CI** (`.github/workflows/ci.yml`): on every pull request and on every push, runs `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm test`, and `pnpm build` with `VITE_BASE` set to the GitHub Pages project path (`/<repository-name>/`).
- **Deploy** (`.github/workflows/deploy.yml`): on push to `main` or `master`, repeats the same checks, builds, and publishes `dist` to **GitHub Pages** via `upload-pages-artifact` and `deploy-pages`.
- **One-time repo setup:** Settings → **Pages** → **Build and deployment** → Source: **GitHub Actions** (not “Deploy from a branch”). The workflow uses the default `GITHUB_TOKEN`; no extra deploy secret is required for public Pages.
- **Live URL (project site):** `https://alfredchow2338.github.io/first-circle/` (trailing path matches `VITE_BASE`).
- **Local dev:** omit `VITE_BASE` so `base` stays `/`. For a local preview of the Pages build:  
  `VITE_BASE=/first-circle-interview/ pnpm build && pnpm preview` (adjust the segment to your repo name).
- **Other hosts (Vercel, Netlify, S3):** add that provider’s deploy step and secrets separately; keep `VITE_BASE` aligned with the public path (often `/` for a root domain).

### Lint and Format Workflow

- Format code: `pnpm format`
- Check formatting: `pnpm format:check`
- Lint code: `pnpm lint`
- Autofix lint issues: `pnpm lint:fix`
- Recommended local sequence: `pnpm format && pnpm lint`

### Data Persistence Consideration

- Local storage cannot handle large-size dataset due to 10MB size limit.
- Another alternative will be IndexDB
  - ✅ Async, much larger quota (browser/device dependent, often hundreds of MB+)
  - ✅ Can store structured objects directly (without `JSON.stringify`)
  - ✅ Libraries such as `idb` or `Dexie` provide good DX
