import { defineConfig } from 'astro/config';

export default defineConfig({
  prefetch: {
    prefetchAll: true
  },
  build: {
    assets: "assets"
  }
});