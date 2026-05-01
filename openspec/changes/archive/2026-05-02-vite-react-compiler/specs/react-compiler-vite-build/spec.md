## ADDED Requirements

### Requirement: Integrate React Compiler in Vite client builds

The system SHALL configure the Vite build so that client React and TSX sources are processed with the React Compiler using the supported **`@vitejs/plugin-react` v6** integration path (Babel-based compiler pass with **`reactCompilerPreset`**, not the removed in-plugin `babel` option on `react()` alone).

#### Scenario: Dev and production use compiler-enabled pipeline

- **WHEN** the developer runs the app in development or builds for production
- **THEN** the Vite configuration SHALL apply the React Compiler to eligible client modules without removing existing React, Vanilla Extract, or PWA plugins

#### Scenario: Plugin order preserves compiler effectiveness

- **WHEN** Vite loads the configured plugins
- **THEN** the Babel-based React Compiler pass SHALL be registered so it runs before the default React plugin transform chain as required by upstream guidance

### Requirement: Preserve existing Vite capabilities

The system SHALL retain **`src` path alias**, **Vanilla Extract** integration, and **PWA injectManifest** behavior unchanged except as required for compatibility with the compiler plugin.

#### Scenario: Build and tests still succeed

- **WHEN** the project runs typecheck/build and the automated test suite after the change
- **THEN** those commands SHALL complete successfully with no new failures attributable to misconfigured Vite plugins
