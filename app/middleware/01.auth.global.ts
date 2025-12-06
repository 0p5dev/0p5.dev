export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();

  // console.log("🔍 Global auth middleware executing", {
  //   server: import.meta.server,
  //   client: import.meta.client,
  //   to: to.name,
  //   from: from?.path,
  //   user: user.value,
  // });

  //   ? Leaving this here in case I need to capture server render
  if (import.meta.server) {
  }

  //   ? Leaving this here in case I need to capture client render
  //   if (import.meta.client) {}

  //   ? Leaving this here in case I need to capture initial client load
  //   const nuxtApp = useNuxtApp();
  //   if (
  //     import.meta.client &&
  //     nuxtApp.isHydrating &&
  //     nuxtApp.payload.serverRendered
  //   ) {
  //   }

  const protectedRoutes = ["dashboard", "deployment-name"];
  if (protectedRoutes.includes(to.name as string) && !user.value) {
    return navigateTo("/login");
  }

  const unauthenticatedOnlyRoutes = ["login", "index"];
  if (unauthenticatedOnlyRoutes.includes(to.name as string) && user.value) {
    return navigateTo("/dashboard");
  }
});
