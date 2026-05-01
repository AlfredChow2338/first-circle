## ADDED Requirements

### Requirement: Limit deep relative imports
The lint configuration SHALL fail when an import uses relative traversal deeper than `../../..` and SHALL require using `src/...` absolute imports for those cross-module references.

#### Scenario: Reject excessive relative path depth
- **WHEN** a file imports another module using a path deeper than `../../..`
- **THEN** lint reports a rule violation instructing to use a `src/...` import path

### Requirement: Allow local relative imports within threshold
The lint configuration SHALL allow relative imports up to and including `../../..` so nearby module references remain practical.

#### Scenario: Permit bounded relative imports
- **WHEN** a file imports another module using `./`, `../`, `../../`, or `../../../`
- **THEN** lint does not raise path-depth violations for that import
