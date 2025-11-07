import * as jose from "jose";

export default defineNuxtRouteMiddleware((to, from) => {
  const { user, loggedIn } = useAuth();
  const token = useCookie("auth.token");

  //   console.log("🔍 Global auth middleware executing", {
  //   server: import.meta.server,
  //   client: import.meta.client,
  // to: to.name,
  //   from: from?.path,
  //   });

  if (import.meta.server) {
    if (token.value) {
      const claims: any = jose.decodeJwt(token.value);
      user.value = claims.username;
      loggedIn.value = true;
    } else {
      user.value = null;
      loggedIn.value = false;
    }
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

  const unprotectedRoutes = ["login", "index"];
  if (unprotectedRoutes.includes(to.name as string) && loggedIn.value) {
    return navigateTo("/dashboard");
  }

  const protectedRoutes = ["dashboard", "deployment-name"];
  if (protectedRoutes.includes(to.name as string) && !loggedIn.value) {
    return navigateTo("/login");
  }
});
