## Portfolio (Vue + Material + SCSS)

This is a Vue 3 + Vite portfolio using **Vuetify (Material Design)** and **SCSS**, configured to deploy to **GitHub Pages**.

### Local development

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

### Deploy to GitHub Pages

- **GitHub Actions** is set up in `.github/workflows/deploy.yml`
- It deploys on every push to the **`main`** branch by publishing the build output to the **`gh-pages`** branch
- The workflow defaults to `VITE_BASE=/` (works for `cpritchard007.github.io`)
- If you deploy as a project site (`https://<user>.github.io/<repo>/`), set repo variable `VITE_BASE` to `/<repo>/`

Do this once in GitHub:

- Go to your repo → **Settings** → **Pages**
- Under **Build and deployment**, set **Source** to **Deploy from a branch**
- Select **Branch**: `gh-pages` and **Folder**: `/ (root)`

### Company logos (build assets)

Company logo images are imported in Vue files, so Vite bundles them into `dist/assets/*` automatically.

`scripts/prepare-pages.mjs` still adds `.nojekyll` for GitHub Pages compatibility.

### Customize

- **Name / links**: `src/App.vue`
- **Featured projects list**: `src/data/projects.js`
- **GitHub repo feed username**: set `VITE_GITHUB_USERNAME` (defaults to `cpritchard007`)
- **GitHub repo topic filter**: set `VITE_GITHUB_PROJECT_TOPIC` (defaults to `project`)
- **Pages**: `src/views/*`
- **Theme colors**: `src/plugins/vuetify.js`

# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
