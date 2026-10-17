import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ingatsehat.my.id",
  trailingSlash: "never",
  build: {
    format: "file",
  },
});
