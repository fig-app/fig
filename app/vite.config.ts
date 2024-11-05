import { paraglide } from "@inlang/paraglide-sveltekit/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit(),
    paraglide({
      project: "./project.inlang",
      outdir: "./src/lib/paraglide",
    }),
  ],
  server: {
    port: 1042,
    strictPort: true,
    fs: {
      strict: false,
    },
  },
});
