
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
    controllerBaseUrl: "https://controller.0p5.dev/api/v1",
    public: {
      eventSourceBaseUrl: "https://controller.0p5.dev/api/v1",
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
  fonts: {
    providers: {
      bunny: false,
    }
  }
});
