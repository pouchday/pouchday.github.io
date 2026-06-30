import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";

export const onRequest: PagesFunction<{
  SUPABASE_URL: string;
  SUPABASE_SECRET_KEY: string;
}> = async (context) => {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // Only intercept actual page navigations (HTML pages), skip API routes/assets
  if (!url.pathname.endsWith(".html") && url.pathname !== "/" && !url.pathname.endsWith("/")) {
    return next();
  }

  // Get the response from the static asset asset pool
  const response = await next();

  // Establish Supabase Context
  const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    cookies: {
      getAll() {
        const parsed = parseCookieHeader(request.headers.get("Cookie") ?? "");
        return parsed.map((item: any) => ({
          name: item.name,
          value: typeof item.value === "object" ? (item.value.value ?? "") : (item.value ?? ""),
        }));
      },
      setAll(cookiesToSet) {
        // Middleware can pass down refreshed cookies if needed
      }
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  // Inject the auth state straight into a global variable inside the document <head>
  return new HTMLRewriter()
    .on("head", {
      element(element) {
        element.append(
          `<script>window.__INITIAL_AUTH__ = ${JSON.stringify({ authenticated: !!user, user })};</script>`,
          { html: true }
        );
      },
    })
    .transform(response);
};