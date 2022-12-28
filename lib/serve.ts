import { renderToString } from "./ssr.ts";

// deno-lint-ignore ban-types
async function serve(routes: Record<string, Function>) {
  const ac = new AbortController();

  function handler(req: Request) {
    const { pathname } = new URL(req.url);
    const root = routes[pathname];

    if (root) {
      return new Response(renderToString(root), {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not Found", { status: 404 });
  }

  await Deno.serve({ signal: ac.signal }, handler);
  ac.abort();
}

export { serve };
