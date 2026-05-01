## Why

The app already runs **React 19** (`react` / `react-dom` ^19.2.x). Enabling the **React Compiler** in the Vite pipeline automates much of the manual memoization work, aligns with current React guidance, and keeps the project on the supported toolchain for **Vite 8** and **`@vitejs/plugin-react` v6**—where the older `react({ babel: { plugins: [...] } })` pattern is no longer the right integration path.

## What Changes

- Add **`babel-plugin-react-compiler`** and **`@rolldown/plugin-babel`** as dev dependencies (compiler runs via Babel; v6 React plugin uses Oxc for JSX/refresh, so Babel is wired separately per upstream docs).
- Update **`vite.config.ts`**: import **`reactCompilerPreset`** from `@vitejs/plugin-react`, register **`babel({ presets: [reactCompilerPreset()] })` before `react()`**, and keep **`vanillaExtractPlugin`**, **`VitePWA`**, and **`resolve.alias`** behavior intact.
- Verify **`pnpm dev`**, **`pnpm build`**, and **`pnpm test`** still pass; fix any compiler-related breakages (rare rules-of-React violations) if they surface.
- Optionally document **incremental adoption** (e.g. `compilationMode: 'annotation'`) in design if strict mode causes noise—default target is React 19.

## Capabilities

### New Capabilities

- `react-compiler-vite-build`: Build-time integration of React Compiler with Vite for client React/TSX.

### Modified Capabilities

- _None_ (tooling-only; no product feature spec change unless follow-up work is needed).

## Impact

- `vite.config.ts`, `package.json` / lockfile.
- Potential follow-up: ESLint **`eslint-plugin-react-compiler`** in CI (recommended upstream before or alongside full compilation); out of scope unless added as a follow-up task.
