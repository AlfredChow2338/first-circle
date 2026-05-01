## 1. Dependencies

- [x] 1.1 Add dev dependencies: `babel-plugin-react-compiler` and `@rolldown/plugin-babel` (versions compatible with React 19 and `@vitejs/plugin-react` v6).

## 2. Vite configuration

- [x] 2.1 Update `vite.config.ts`: import `babel` from `@rolldown/plugin-babel` and `reactCompilerPreset` from `@vitejs/plugin-react`.
- [x] 2.2 Register `babel({ presets: [reactCompilerPreset()] })` **before** `react()`, keeping `vanillaExtractPlugin`, `VitePWA`, and `resolve.alias` intact.

## 3. Verification

- [x] 3.1 Run `pnpm build` and `pnpm test`; fix any compiler-related issues.
- [x] 3.2 Smoke `pnpm dev` and confirm the app loads.
- [x] 3.3 Run `pnpm lint` on touched files; resolve new issues if any.
