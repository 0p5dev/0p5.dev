// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "nuxt-charts",
    "@nuxtjs/supabase",
    "@vueuse/nuxt",
  ],
  css: ["~/assets/css/main.css"],
  ssr: true,
  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },
  app: {
    pageTransition: { name: "pl", mode: "out-in" },
    layoutTransition: { name: "pl", mode: "out-in" },
  },
  runtimeConfig: {
    controllerBaseUrl: "http://34.58.48.78/api/v1",
    supabaseDbPassword: "",
    public: {
      supabaseUrl: "",
      supabaseApiKey: "",
      githubApiToken: "",
    },
  },
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_API_KEY,
    cookiePrefix: "0p5dev",
    redirect: false,
  },
});
