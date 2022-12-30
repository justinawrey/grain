import { renderToString } from "./ssr.ts";
import { serve as _serve } from "https://deno.land/std@0.170.0/http/server.ts";

// deno-lint-ignore ban-types
function serve(routes: Record<string, Function>) {
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

  _serve(handler);
}

export { serve };
