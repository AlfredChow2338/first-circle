## Context

- **Vite** `^8.x`, **`@vitejs/plugin-react`** `^6.x` (Oxc-based JSX + Fast Refresh; Babel is not embedded for arbitrary plugins).
- **React 19** is already a dependency; compiler should use the **`react/compiler-runtime`** path (default for `target` **19** via `reactCompilerPreset`).
- Current `vite.config.ts` uses `react()`, `vanillaExtractPlugin()`, `VitePWA()`, and `src` alias.

## Goals / Non-Goals

**Goals:**

- Enable React Compiler for **client** TS/TSX in **dev** and **production** builds.
- Preserve plugin order and behavior of **Vanilla Extract** and **PWA** injectManifest.
- Keep configuration minimal: prefer **`reactCompilerPreset()`** from `@vitejs/plugin-react` over hand-rolled Babel config.

**Non-Goals:**

- Removing existing `useMemo` / `useCallback` / `memo` in one sweep (compiler is additive; clean up only if profiling warrants it).
- Compiling **non-client** bundles unless required by the preset defaults.
- Mandatory **eslint-plugin-react-compiler** in this change (optional follow-up).

## Decisions

1. **Use `@rolldown/plugin-babel` + `reactCompilerPreset()`**  
   - **Rationale:** Matches `@vitejs/plugin-react` v6 changelog: Babel-based compiler runs in a dedicated plugin; **`reactCompilerPreset`** bundles `babel-plugin-react-compiler` with filters and `optimizeDeps` hints for `react/compiler-runtime`.  
   - **Alternative:** Legacy `react({ babel: { plugins: ['babel-plugin-react-compiler'] } })` — **rejected** for v6 (Babel integration removed from the React plugin).

2. **Plugin order: `babel` → `react` → others**  
   - **Rationale:** Compiler must see source-like JSX before downstream transforms; upstream examples place Babel before `react()`.

3. **Default preset options**  
   - Start with **`reactCompilerPreset()`** with no options (React 19 target). If adoption surfaces many opt-outs, consider **`compilationMode: 'annotation'`** in a follow-up.

4. **Verification**  
   - Run `pnpm build`, `pnpm test`, smoke `pnpm dev` after config change.

## Risks / Trade-offs

- **Build time** may increase slightly (Babel pass on matched files).  
- **Rules of React** violations may become **build/runtime** issues; mitigation: tests + optional ESLint compiler plugin later.

## Migration Plan

- Land dependency + config; no runtime data migration.

## Open Questions

- Whether to add **`eslint-plugin-react-compiler`** in the same change or a separate PR.
