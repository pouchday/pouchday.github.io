import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://pouchday.github.io',

  prefetch: {
    prefetchAll: true
  },

  build: {
    assets: "assets"
  },

  integrations: [react()]
});