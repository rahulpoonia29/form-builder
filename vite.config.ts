import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-hook-form'],
          'ui-components': [
            '@radix-ui/react-select',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-label',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-dialog',
            '@radix-ui/react-toggle',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
          ],
          dnd: ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          'form-components': ['./src/components/form-components/index.ts'],
        },
      },
    },
    target: 'esnext',
  },
});
