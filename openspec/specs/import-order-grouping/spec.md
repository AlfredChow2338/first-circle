## ADDED Requirements

### Requirement: Enforce import group precedence
The lint configuration SHALL enforce import groups in this exact order: third-party libraries, `src/...` internal absolute imports, then relative imports.

#### Scenario: Detect incorrect group order
- **WHEN** a file places a `src/...` or relative import before a third-party library import
- **THEN** lint reports an import-order violation

### Requirement: Enforce grouped separation
The lint configuration SHALL require blank-line separation between the three import groups to keep ordering explicit and readable.

#### Scenario: Require group spacing
- **WHEN** a file has imports from different groups without separating blank lines
- **THEN** lint reports spacing/order violations and offers autofix where supported
