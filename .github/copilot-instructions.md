# Copilot instructions for `ddw-theme-creator`

## Build and run commands

- Install dependencies: `npm ci`
- Start the development server: `npm run dev`
- Create a production build: `npm run build`
- Run the production server after building: `npm run start`

There are no repository-defined test or lint scripts in `package.json`.
The project now targets Next.js 16 and uses `next dev --webpack` / `next build --webpack` because `next.config.js` still applies a webpack-only `resolve.fallback.fs = false` client stub.

## High-level architecture

This repository is a small Next.js 16 Pages Router app that generates WinDynamicDesktop `.ddw` theme archives entirely in the browser.

- `src/pages/_app.js` is the global entry point. It applies `src/styles/global.css`, wraps every page in `src/components/layout.js`, and sets shared `<Head>` metadata.
- `src/components/layout.js` observes the MobX `AppStore` and is responsible for the global loading overlay plus the footer. Loading state is shared across pages through `src/stores/app.js`.
- `src/pages/index.js` is the home screen. It does not render the creation flows directly; instead it navigates to `/create` with a query-string `option` that selects the workflow.
- `src/pages/create.js` is the router for the three creation flows. It reads `router.query.option` and swaps both the page header and the body component based on that value.
- The three flow components in `src/components/` produce the final `.ddw` blob in different ways:
  - `from-image-set.js` lets users upload and reorder sunrise/day/sunset/night image groups directly.
  - `from-single-image.js` derives eight JPEGs from one uploaded image by drawing it to a canvas with decreasing brightness.
  - `heic-to-ddw.js` converts a `.heic` file to multiple JPEGs with `heic2any`, then lets the user sort extracted frames into the time-of-day groups.
- Every flow assembles the final archive with `JSZip`: numbered `themeName_<n>.jpg` files plus a `themeName.json` manifest containing `imageFilename`, `imageCredits`, and the image index lists expected by WinDynamicDesktop.
- After archive generation, the flow stores the resulting blob and theme name in the singleton `ThemeStore` (`src/stores/theme.js`) and navigates to `src/pages/result.js`, which downloads the blob with `file-saver`.
- `next.config.js` stubs `fs` on the client for webpack builds, and the MobX stores now use `makeAutoObservable` without any custom Babel decorator configuration.

## Key conventions

- Global state is kept in singleton MobX store instances under `src/stores/`. Components mutate observable fields directly (`AppStore.loading = true`, `ThemeStore.themeData = result`) rather than dispatching actions or using reducers.
- Workflow selection is centralized through the numeric `option` query parameter. If you add or rename a creation mode, update both the home-page links in `src/pages/index.js` and the conditional rendering/header logic in `src/pages/create.js`.
- Theme creation stays client-side. The result page assumes the generated blob is already in `ThemeStore`, so changes to generation flows should preserve the `ThemeStore.themeData` / `ThemeStore.themeName` handoff before navigating.
- Theme names are validated consistently with `^[a-zA-Z0-9_]*$`, and generated assets follow the `themeName_<index>.jpg` plus `themeName.json` naming pattern. Keep that contract intact when changing archive generation.
- Drag-and-drop image items now use preview-item objects with `id`, `preview`, and `file` fields. The sortable flows write ZIP contents directly from `thumbnail.file` rather than matching items back to a separate source array.
- The HEIC conversion flow allows empty sunrise and sunset groups. In that case it duplicates the first day image for sunrise and the first night image for sunset when building the manifest and archive.
- The single-image flow is opinionated: it always generates eight derived JPEGs and writes fixed sunrise/day/sunset/night index lists. If that behavior changes, update both the brightness-generation loop and the hard-coded manifest lists together.
