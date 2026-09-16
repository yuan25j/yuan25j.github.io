import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://yuan25j.github.io",
  publicDir: "./assets",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
