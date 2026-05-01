## ADDED Requirements

### Requirement: Continuous integration via GitHub Actions

The system SHALL provide a GitHub Actions workflow that runs on **pull requests** and on **pushes** to the repository’s default integration branch (e.g. `main`), and that workflow SHALL execute **`pnpm install`** (or equivalent frozen install), **`pnpm lint`**, **`pnpm test`**, and **`pnpm build`** using a pinned **Node.js** major version consistent with the project.

#### Scenario: Pull request fails when lint errors exist

- **WHEN** a pull request is opened or updated and **`pnpm lint`** exits with a non-zero status
- **THEN** the CI workflow SHALL be marked failed and SHALL NOT be treated as a successful quality gate

#### Scenario: Push passes when all checks succeed

- **WHEN** code is pushed and **`pnpm lint`**, **`pnpm test`**, and **`pnpm build`** all complete successfully
- **THEN** the CI workflow SHALL be marked successful

### Requirement: Continuous deployment of static build

The system SHALL provide a GitHub Actions workflow that publishes the production **`dist`** directory to a static hosting target when the latest commit on the deployment branch has passed the CI checks described above, using credentials appropriate to that host (e.g. **`GITHUB_TOKEN`** for GitHub Pages).

#### Scenario: Deploy runs only after a successful build

- **WHEN** a push lands on the configured deployment branch
- **THEN** the deployment workflow SHALL depend on a successful **`pnpm build`** (or reuse artifacts from a successful CI run) before publishing assets

#### Scenario: Deploy publishes client assets

- **WHEN** deployment completes successfully
- **THEN** the hosted site SHALL serve the same static assets produced by **`vite build`** (HTML, JS, CSS, and PWA-related outputs under **`dist`**)

### Requirement: Reproducible toolchain in workflows

The system SHALL install dependencies with **pnpm** using a version compatible with the **`packageManager`** field in **`package.json`**, and SHALL cache pnpm store or dependencies where supported to keep CI duration reasonable.

#### Scenario: Workflow uses pnpm from project metadata

- **WHEN** CI runs
- **THEN** the workflow SHALL use **pnpm** (not npm or yarn) for installing dependencies and invoking scripts unless explicitly documented otherwise
