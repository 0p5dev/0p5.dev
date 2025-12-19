export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const url = getRequestURL(event);
  const pathName = url.pathname.replace("/api", "");
  let token = getCookie(event, "0p5dev.0");
  token = token?.replace("base64-", "") || undefined;
  let accessToken = null;
  const decodedToken = token
    ? Buffer.from(token, "base64").toString("utf-8")
    : null;
  if (decodedToken) {
    const quotes = [];
    for (let i = 0; i < decodedToken.length; i++) {
      if (decodedToken[i] === '"') {
        quotes.push(i);
        if (quotes.length === 4) break;
      }
    }
    if (quotes.length >= 4) {
      accessToken = decodedToken.substring(quotes[2] + 1, quotes[3]);
    }
  }
  // console.log("Access token:", accessToken);
  let body = null;
  if (isMethod(event, "POST") || isMethod(event, "PUT")) {
    body = await readBody(event);
  }

  // console.log(
  //   `Proxying request to backend: ${pathName} with token ${
  //     token ? "present" : "absent"
  //   }`
  // );

  let options: any = {
    method: event.req.method,
    headers: {
      ...event.req.headers,
      Authorization: token ? `Bearer ${accessToken}` : "",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const targetUrl = runtimeConfig.controllerBaseUrl + pathName;
  return await $fetch(targetUrl, options);
});
