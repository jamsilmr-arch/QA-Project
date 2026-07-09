# AGENTS

## Project overview
This is a small static browser application named `QA System Pro`. It uses plain ES modules, direct DOM manipulation, and a shared global namespace object: `window.QA_CORE`.

The app includes three main UI tabs:
- `issue`: bug report builder (`issue.js`)
- `calendar`: event calendar with localStorage / Firebase sync fallback (`calendar.js`, `calendar-view.js`, `schedule.js`)
- `bookmark`: bookmark manager (`bookmark.js`)

There is no build system or package manager config in the repository. The app runs by opening `index.html` in a browser or via a simple static web server.

## Key files
- `index.html` — main entry point, loads modules and Firebase compat scripts
- `main.js` — bootstrap and initialization, global router setup, settings modal
- `app.js` — core system init, tab switching, event wiring, data loading
- `calendar.js` — calendar state and rendering
- `calendar-view.js` — calendar tab markup template and panel init
- `schedule.js` — calendar event persistence and Firebase integration
- `bookmark.js` — bookmark panel, storage, folder handling, rendering
- `issue.js` — issue panel template and initialization
- `loader.js` — global UI toast helper and QA_CORE app initialization
- `constants.js` — holiday constants and app constants object

## Conventions
- Global app object: `window.QA_CORE` is the shared namespace.
- DOM IDs and CSS classes drive most behavior; avoid changing them without updating script references.
- Templates are defined as string constants and injected into DOM panels.
- Local storage keys are used for persistence: `QA_SYSTEM_CALENDAR`, `QA_SYSTEM_BOOKMARKS`, `QA_SYSTEM_BOOKBAR_FOLDERS_PURE`, `QA_SETTING_DB_URL`.
- Firebase configuration is present as placeholders in `app.js`; do not assume valid credentials are committed.
- No automated tests or task runners are present.

## Collaboration / Live Share notes
- Keep changes small and browser-focused. This repo is intended for manual browser testing.
- When modifying UI structure or IDs, update the corresponding scripts that query those elements.
- Prefer using existing utility functions on `window.QA_CORE` rather than adding new globals if possible.
- Avoid introducing a build step unless the user explicitly asks for one.

## Useful guidance for AI coding agents
- Start by reviewing `index.html`, `main.js`, and `app.js` to understand app initialization and routing.
- For UI changes, inspect the panel templates in `issue.js`, `calendar-view.js`, and `bookmark.js`.
- For calendar persistence logic, inspect `schedule.js` and `app.js`.
- For state and render coupling, inspect `calendar.js` and `bookmark.js`.

## Testing
1. Open `index.html` in a browser.
2. Use the three tab buttons at the top to switch between app sections.
3. Verify localStorage behavior and optional Firebase sync if configured.
