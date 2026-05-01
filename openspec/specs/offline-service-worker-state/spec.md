## ADDED Requirements

### Requirement: Offline app shell availability
The system SHALL precache the application shell required to render the home page and batch transfer workflow so the app can start without network connectivity after at least one successful online load.

#### Scenario: Launch app offline after initial online visit
- **WHEN** the user has previously loaded the app online and later opens it without network
- **THEN** the app shell is served from service worker cache and the UI loads successfully

### Requirement: Offline navigation fallback
The system SHALL serve the SPA entry document from cache for same-origin navigation requests when network is unavailable.

#### Scenario: Reload while offline
- **WHEN** a user reloads the app on a route with no network connection
- **THEN** the cached SPA entry is returned and routing resumes client-side

### Requirement: Offline readiness visibility
The system SHALL expose whether offline support is active once the service worker is installed and controlling the page.

#### Scenario: Service worker becomes active
- **WHEN** service worker installation and activation complete
- **THEN** the UI shows offline support as ready
