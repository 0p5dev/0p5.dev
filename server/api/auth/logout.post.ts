export default defineEventHandler(async (event) => {
  deleteCookie(event, "auth.token");

  return {
    loggedIn: false,
    user: null,
  };
});
