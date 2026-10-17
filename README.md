# GEARBOx frontend

GEARBOx is a clinical trial matching decision-support tool for clinicians. This repository contains its frontend.

## Links

- Live app: [gearbox.pedscommons.org](https://gearbox.pedscommons.org/)
- About GEARBOx: [gearbox.pedscommons.org/about](https://gearbox.pedscommons.org/about)
- Data and software updates: [docs.pedscommons.org/GEARBOxDataAndSoftwareUpdates](https://docs.pedscommons.org/GEARBOxDataAndSoftwareUpdates/)
- Terms and conditions: [docs.pedscommons.org/GEARBOxTermsandConditions](https://docs.pedscommons.org/GEARBOxTermsandConditions/)

## Tech stack

TypeScript, React, Tailwind CSS, React Router, and Leaflet / React Leaflet; build tool: `react-scripts` ^5.0.1.

## Prerequisites

- Node.js **18** (the Docker image builds with Node 18)
- npm and Git

Some npm scripts use Unix-style environment variable assignments. On Windows, run them from Git Bash or WSL.

## Getting started

```bash
git clone https://github.com/chicagopcdc/gearbox-frontend.git
cd gearbox-frontend
npm ci
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

`npm run dev` is the local workflow to use: it starts the React dev server and watches Tailwind so CSS stays up to date. `npm start` alone does not rebuild Tailwind.

## Environment variables

Address autocomplete is served by `gearbox-middleware` at
`/gearbox-middleware/address-autocomplete`, which proxies Geoapify server side. The
browser never receives the Geoapify API key, so no key is needed here for local
development or in production. The key is configured on the middleware instead.

Optional frontend variables (set in the environment or `.env` files; do not commit secrets):

| Variable | Purpose |
| --- | --- |
| `REACT_APP_VERSION` | UI version string (set automatically by the `dev` and `build` scripts) |
| `REACT_APP_GA_TRACKING_ID` | Google Analytics 4 measurement ID |
| `REACT_APP_ACCESS_CODE` | Optional registration access-code pattern |
| `PUBLIC_URL` | Public URL / basename for the app |

### Production deployment endpoints (`DEPLOY_PRODUCTION_DATA_URL`, `REFRESH_PRODUCTION_DATA_URL`)

The admin "deploy staged trials to production" action POSTs to these two
endpoints in order: deploy first, then refresh. They are runtime settings: the
container env vars of the same names are written into `runtime-config.js` by
`dockerStart.sh` and read from `window.RUNTIME_CONFIG` in
`src/api/productionDeployment.ts`. If either is empty, the action fails with
"Production deployment endpoints are not configured."

- **Gen3 deployment:** set `deploy_production_data_url` and
  `refresh_production_data_url` in the `global` block of the manifest.
  `portal-deploy.yaml` in cloud-automation passes them to the pod. Use paths
  reachable from the portal's origin (e.g. relative paths through the gateway);
  a URL on another domain would need CORS.
- **Local development:** set them in `public/runtime-config.js`.

### Enhanced matching UI (`REACT_APP_ENHANCED_UI`)

The three-panel matching form with typeahead field search is toggled at
runtime, not build time. Set the container env var `REACT_APP_ENHANCED_UI=true`
and `dockerStart.sh` writes it into `runtime-config.js` as
`window.RUNTIME_CONFIG.ENHANCED_UI`, which `App.tsx` and `Layout.tsx` read. Any
value other than the string `true` (including unset) keeps the original form.
Changing it only needs a container restart, not a rebuild, so one image can
serve environments with different settings.

- **Gen3 deployment:** add `"react_app_enhanced_ui": "true"` to the `global`
  block of the manifest. `portal-deploy.yaml` in cloud-automation passes it to
  the pod as `REACT_APP_ENHANCED_UI`.
- **Local development (`npm start`):** `dockerStart.sh` is not used, so set
  `ENHANCED_UI: 'true'` in `public/runtime-config.js` instead (don't commit it).

## Available scripts

In the project directory, you can run:

### `npm run dev`

Recommended for local development. Runs the React dev server and Tailwind watcher concurrently.

### `npm start`

Starts the React dev server only (no Tailwind watcher). Open [http://localhost:3000](http://localhost:3000).

### `npm run start:dev`

HTTPS variant of the React dev server on port 3000. Requires TLS files at `.cert/cert.pem` and `.cert/key.pem`.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Runs the `prebuild` script to compile Tailwind, then builds a production bundle into the `build` folder.

### `npm run format`

Formats files under `src` with Prettier (`semi: false`, `singleQuote: true`).

### `npm run storybook`

Starts Storybook on port 9009.

### `npm run build-storybook`

Builds the Storybook site.

## Contribute

1. Fork [the repository](https://github.com/chicagopcdc/gearbox-frontend) on GitHub.
2. Clone your fork and enter the repository:
   ```bash
   git clone https://github.com/<your-username>/gearbox-frontend.git
   cd gearbox-frontend
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/chicagopcdc/gearbox-frontend.git
   ```
4. Fetch the upstream repository:
   ```bash
   git fetch upstream
   ```
5. Create a topic branch from `upstream/dev`:
   ```bash
   git checkout -b <topic> upstream/dev
   ```
6. Install dependencies:
   ```bash
   npm ci
   ```
7. Start local development:
   ```bash
   npm run dev
   ```
8. Run tests and format the source:
   ```bash
   npm test
   npm run format
   ```
9. Commit your changes and push the topic branch to your fork:
   ```bash
   git add <files>
   git commit -m "<describe your change>"
   git push -u origin <topic>
   ```
10. Open a pull request from your fork targeting `dev` in `chicagopcdc/gearbox-frontend`.

## Running the application with Docker

This repository includes a Dockerfile and a startup script that build the app and serve the production build with nginx (nginx listens on port 80 inside the container).

Build the Docker image:

```bash
docker build -t gearbox-frontend .
```

Run the container (example maps container port 80 to host port 8080):

```bash
docker run --rm -p 8080:80 gearbox-frontend
```

After the container starts, open the app in your browser at:

http://localhost:8080

You can also map to a different host port (for example `-p 80:80`) if preferred.

## License

See [LICENSE.md](LICENSE.md).
