// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';

export default defineConfig({
    root: 'src',
    plugins: [injectHTML()],
    build: {
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'src', 'index.html'),
                ship: resolve(__dirname, 'src', 'ship', 'index.html'),
                restrictions: resolve(__dirname, 'src', 'restrictions', 'index.html'),
                travel: resolve(__dirname, 'src', 'travel', 'index.html'),
                contact: resolve(__dirname, 'src', 'contact', 'index.html'),
                donate: resolve(__dirname, 'src', 'donate', 'index.html'),
                travelOffer: resolve(__dirname, 'src', 'travel', 'offer', 'index.html'),
                travelSeeking: resolve(__dirname, 'src', 'travel', 'seeking', 'index.html'),
                shipSuccess: resolve(__dirname, 'src', 'ship', 'success', 'index.html'),
                travelOfferSuccess: resolve(__dirname, 'src', 'travel', 'offer', 'success', 'index.html'),
                travelSeekingSuccess: resolve(__dirname, 'src', 'travel', 'seeking', 'success', 'index.html'),
            },
        },
    },
});
