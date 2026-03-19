# ddw-theme-creator

Create WinDynamicDesktop `.ddw` theme archives directly in the browser.

The app supports three flows:

- Create a `.ddw` file from a set of images
- Create a `.ddw` file from a single image by generating brightness variants
- Convert a `.heic` file into a `.ddw` file

## Stack

- Next.js 16
- React 19
- MobX 6
- Browser-side ZIP generation with `jszip`

The project still uses the Next.js Pages Router. Theme generation remains client-side so it can be deployed on Vercel without any custom backend.

## Requirements

- Node.js `>= 20.9.0`
- npm

## Local development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the production server locally:

```bash
npm run start
```

## Deploying to Vercel

This repository is ready for a standard Vercel deployment.

Recommended settings:

- Framework preset: `Next.js`
- Install command: `npm install`
- Build command: `npm run build`
- Output setting: default Next.js output
- Node.js version: `20.x` or newer

## Known limitations

- Dragging images between categories still depends on browser drag-and-drop behavior and should be smoke-tested in a real browser after deployment.
- HEIC conversion depends on client-side browser support and uploaded file quality; test with representative files before production rollout.

## Links

- [Live site](https://ddw-theme-creator.vercel.app/)
- [WinDynamicDesktop](https://github.com/t1m0thyj/WinDynamicDesktop)
