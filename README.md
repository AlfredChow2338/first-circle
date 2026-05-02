# Batch Transaction Processing System

### Product Scope

- CSV import
- Strict record validation
- Review/error visibility
- Computed summary metrics
- Adding uploaded transactions into the home-page table without backend integration

### Web Engineering Practices

- ✅ OfflService Worker & Offline-First Architecture (PWA)
- ✅ IndexedDB caching for persisted transactions during hydration
- ✅ Web Worker for Main Thread Offloading to prevent UI jank
- ✅ Search Input Throttling
- ✅ Build Optimization with Gzip and React Compiler (Auto Memoization)
- ✅ Code Splitting & Lazy Loading & Tree Shaking with Vite
- ✅ Critical CSS Extraction with Beasties improves FCP
- ✅ Vanilla Extract (Zero-Runtime CSS-in-JS & Optimal cache efficiency)
- ✅ TypeScript Strict Mode & Eslint rules & Prettier auto format
- ✅ Expontentital backoff retry for large dataset process else rollback imprvoes error prone
- ✅ Client-side pagination for better readability

### Security Protection

1. CSV formula injection on export (integrity / user harm)

Text columns (`Transaction Date`, `Account Number`, `Account Holder Name`) are passed through `sanitizeCsvTextFieldForExcel` before export: values whose first non-whitespace character is `=`, `+`, `-`, `@`, tab, CR, `|`, or a leading BOM before those triggers get a leading `'` so Excel/Sheets treat the cell as text.

2. Denial-of-service / resource abuse in case uploading to server / storage (availability)

The flow still reads the whole file as text and parses it (worker runs after parse). Uploads are rejected if **`file.size` exceeds 10 MB** (`assertCsvFileSizeAllowed`), and **`parseCsvText` throws** if there are more than **10,000 data rows** (after header). Errors surface as modal upload/validation messages.

3. Content-Security-Policy and related policies (headers vs meta)

Production builds inject **`<meta>`** tags via `vite/securityMetaTagsPlugin.ts`: Content-Security-Policy (default/script/style/img/font/connect/worker/manifest `self`, `upgrade-insecure-requests`, etc.), Referrer-Policy(`strict-origin-when-cross-origin` via `<meta name="referrer">`), and Permissions-Policy (restrict camera, mic, geolocation, payment, USB).

Dev server skips these so HMR is not blocked. CI/deploy workflows grep `dist/index.html` so a regression fails the build.

4. Regular audit to prevent potential supply chain attacks

Heavy use of npm packages (React, Radix, PapaParse, Workbox, Zod, etc.). Supply-chain risk is ongoing, not a one-time fix.

CI runs `pnpm audit --audit-level high` on every push/PR and on a weekly schedule (`.github/workflows/ci.yml`). `pnpm audit` is also available as `pnpm run audit`. Dependabot opens weekly grouped npm updates (`.github/dependabot.yml`). The lockfile stays `pnpm-lock.yaml` with `pnpm install --frozen-lockfile`\*\* in CI. `pnpm.overrides` may pin patched transitive versions when advisories lag upstream (document any override in commit messages).

Enable GitHub Dependabot alerts. Consider **OSV-Scanner** or **Snyk** for extra signal.

### Security Concerns

_Sensitive-ish data only on the client (confidentiality & compliance)_

Transactions and batch metadata live in IndexedDB (and memory) unencrypted. Anyone with access to the same browser profile (or malware on the device) can read or tamper with data. There is no audit trail, no server-side controls, and no data-classification story.

Improve: Server-side storage, encryption at rest (with keys not only in the client), authorization, retention policies, and no long-lived PII in client storage without explicit product/legal sign-off.

### Tech stack (React and TypeScript friendly)

- @tanstack/react-table
  - ✅ Headless architecture gives full UI control while keeping powerful table logic (sorting/filtering/pagination).
  - ✅ Excellent TypeScript support for strongly-typed columns and cells.
  - ✅ Performs well for complex data tables and scales with feature growth.

- react-hook-form
  - ✅ Minimal re-renders via uncontrolled inputs, so forms stay fast.
  - ✅ Great DX with simple APIs and clean validation/error handling.
  - ✅ Easy integration with schema validators (like zod) and custom inputs.

- zod
  - ✅ Runtime validation + static TypeScript inference from one schema source.
  - ✅ Clear, composable schemas that are easy to maintain and reuse.
  - ✅ Safer parsing with predictable error structures for UI messaging.

- papaparse
  - ✅ Mature CSV parser with robust handling of edge cases (quotes, delimiters, malformed rows).
  - ✅ Browser-friendly and fast for client-side parsing.
  - ✅ Supports step/chunk parsing patterns for larger files.

- zustnd
  - ✅ Lightweight state management with low boilerplate and readable store patterns.
  - ✅ Flexible: simple local state up to app-wide state, with middleware support (persist, etc.).
  - ✅ Works very well with React hooks and TypeScript.

- Radix dialog/tooltip
  - ✅ Accessibility-first primitives (keyboard navigation, focus management, ARIA behavior).
  - ✅ Unstyled components let you keep your own design system.
  - ✅ Reliable behavior for tricky UI interactions across browsers.

- Vitest
  - ✅ Very fast test runs with Vite-native integration.
  - ✅ Jest-like API makes adoption easy.
  - ✅ Good TypeScript and ESM support out of the box.

- Reat Testing Library (RTL)
  - ✅ Encourages user-centric testing (interactions and visible behavior over internals).
  - ✅ Produces more resilient tests during refactors.
  - ✅ Great ecosystem integration (jest-dom, user-event) for realistic UI testing.

- IDB (IndexedDB)
  - ✅ Much cleaner promise-based API over raw IndexedDB.
  - ✅ Great for larger client-side persistence than localStorage.
  - ✅ Supports structured object storage and transactional semantics for safer data operations.

- vanilla-extract/css
  - ✅ Type-safe - ClassNames are typed and autocompleted
  - ✅ Scoped - No CSS conflicts or naming collisions
  - ✅ Tree-shakeable - Unused styles are removed from production

- Package manager: Pnpm 10
  - ✅ Disk and install speed: pnpm keeps one global store of package contents and links them into each project with hard links.

  - ✅ Strict, predictable node_modules layout: packages can only import what they declare in their own package.json, not arbitrary nested deps.

  - ✅ First-class monorepo support: efficient linking across packages are built in.

### Import Rules

- Do not use relative imports deeper than `../../..`; use `src/...` instead.
- Import order is enforced as: libraries -> `src/...` -> relative (`./`, `../`).
- Keep a blank line between import groups.

### CI/CD (GitHub Actions)

- **CI** (`.github/workflows/ci.yml`): on every pull request and on every push, runs `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm test`, and `pnpm build` with `VITE_BASE` set to the GitHub Pages project path (`/<repository-name>/`).
- **Deploy** (`.github/workflows/deploy.yml`): on push to `main` or `master`, repeats the same checks, builds, and publishes `dist` to **GitHub Pages** via `upload-pages-artifact` and `deploy-pages`.
- **One-time repo setup:** Settings → **Pages** → **Build and deployment** → Source: **GitHub Actions** (not “Deploy from a branch”). The workflow uses the default `GITHUB_TOKEN`; no extra deploy secret is required for public Pages.
- **Live URL (project site):** `https://<owner>.github.io/<repository-name>/` (trailing path matches `VITE_BASE`).
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

### Practical approach for large-size CSV

- User selects file.
- Read it in chunks (File.stream() or chunked slicing).
- Parse incrementally (worker thread recommended).
- Persist records in IndexedDB in batches (e.g., 500–5000 rows per transaction).
- UI reads paginated slices from IndexedDB (not all rows at once).
