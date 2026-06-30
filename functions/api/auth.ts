import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
  type CookieOptions,
} from "@supabase/ssr";

export const onRequest: PagesFunction<{
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  // Initialize the SSR-compatible Supabase Client
  const responseHeaders = new Headers();
  const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        const parsed = parseCookieHeader(request.headers.get("Cookie") ?? "");
        // Extract the string value safely out of the nested structure
        return parsed.map((item: any) => ({
          name: item.name,
          value:
            typeof item.value === "object"
              ? (item.value.value ?? "")
              : (item.value ?? ""),
        }));
      },
      // 2. Explicitly type cookiesToSet array structure
      setAll(
        cookiesToSet: { name: string; value: string; options: CookieOptions }[],
      ) {
        cookiesToSet.forEach(({ name, value, options }) =>
          responseHeaders.append(
            "Set-Cookie",
            serializeCookieHeader(name, value, options),
          ),
        );
      },
    },
  });

  // Handle User Registration / Login via POST
  if (request.method === "POST") {
    const { email, password, action } = (await request.json()) as any;

    if (action === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error)
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
        });
      return new Response(JSON.stringify({ user: data.user }), {
        headers: responseHeaders,
      });
    }

    if (action === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error)
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
        });
      return new Response(JSON.stringify({ user: data.user }), {
        headers: responseHeaders,
      });
    }
  }

  // Handle Auth Session State Check via GET
  if (request.method === "GET") {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return new Response(JSON.stringify({ authenticated: !!user, user }), {
      headers: responseHeaders,
    });
  }

  return new Response("Method not allowed", { status: 405 });
};