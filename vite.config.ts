import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import pagesApiPlugin from "./plugins/pagesApiPlugin";
import compression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    pagesApiPlugin(),
    mode === 'development' && componentTagger(),
    mode === 'production' && compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React & Router
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI Framework (Radix components)
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast',
          ],
          
          // TipTap Editor (heavy)
          'editor': [
            '@tiptap/core',
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/extension-character-count',
            '@tiptap/extension-color',
            '@tiptap/extension-highlight',
            '@tiptap/extension-image',
            '@tiptap/extension-link',
            '@tiptap/extension-placeholder',
            '@tiptap/extension-table',
            '@tiptap/extension-table-cell',
            '@tiptap/extension-table-header',
            '@tiptap/extension-table-row',
            '@tiptap/extension-text-align',
            '@tiptap/extension-text-style',
            '@tiptap/extension-typography',
            '@tiptap/extension-underline',
            '@tiptap/suggestion',
          ],
          
          // Data & State
          'data-vendor': [
            '@tanstack/react-query',
            '@tanstack/react-query-devtools',
            '@tanstack/react-table',
          ],
          
          // Supabase
          'supabase': ['@supabase/supabase-js'],
          
          // Utils & Helpers
          'utils': [
            'date-fns',
            'nanoid',
            'fast-json-patch',
            'dompurify',
            'zod',
          ],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react',
    ],
  },
}));
