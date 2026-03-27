import { defineConfig } from "vite";

/** Base path for GitHub Pages project sites, e.g. `/repo-name/`. Local dev: `/`. */
const base = process.env.VITE_BASE_PATH ?? "/";

export default defineConfig({
  base,
});
