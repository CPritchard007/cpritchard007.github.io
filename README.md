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

Do this once in GitHub:

- Go to your repo → **Settings** → **Pages**
- Under **Build and deployment**, set **Source** to **Deploy from a branch**
- Select **Branch**: `gh-pages` and **Folder**: `/ (root)`

### Customize

- **Name / links**: `src/App.vue`
- **Projects list**: `src/data/projects.js`
- **Pages**: `src/views/*`
- **Theme colors**: `src/plugins/vuetify.js`

# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
