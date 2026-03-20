import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pouchday.github.io',
  prefetch: {
    prefetchAll: true
  },
  build: {
    assets: "assets"
  }
});
