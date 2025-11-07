// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/image", "nuxt-charts"],
  css: ["~/assets/css/main.css"],
  ssr: true,
  app: {
    pageTransition: { name: "pl", mode: "out-in" },
    layoutTransition: { name: "pl", mode: "out-in" },
  },
});
