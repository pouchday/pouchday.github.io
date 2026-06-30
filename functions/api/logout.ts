import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";

export const onRequestPost: PagesFunction<{
  SUPABASE_URL: string;
  SUPABASE_SECRET_KEY: string;
}> = async (context) => {
  const { request, env } = context;
  const responseHeaders = new Headers();

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
        cookiesToSet.forEach(({ name, value, options }) =>
          responseHeaders.append("Set-Cookie", serializeCookieHeader(name, value, options))
        );
      },
    },
  });

  // Instruct Supabase to revoke the session and clear cookies
  await supabase.auth.signOut();

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: responseHeaders,
  });
};