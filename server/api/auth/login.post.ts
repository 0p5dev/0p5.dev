import * as jose from "jose";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { token } = await $fetch<any>(
    `http://localhost:8080/api/v1/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  setCookie(event, "auth.token", token, {
    httpOnly: true,
    secure: false, // TODO: set to true in production
    maxAge: 3600, // 1 hour
    path: "/",
    domain: "",
  });

  const claims: any = jose.decodeJwt(token);
  return {
    loggedIn: true,
    user: claims.username,
  };
});
