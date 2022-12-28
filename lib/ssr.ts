import { parseHTML } from "https://esm.sh/linkedom@0.14.17";
import { setDocument } from "./document.ts";

// deno-lint-ignore no-explicit-any
function renderToString(root: any): string {
  const { document } = parseHTML(`<!doctype html>
<html lang="en">
  <head>
    <title>Grain App</title>
  </head>
  <body>
  </body>
</html>`);
  setDocument(document);
  const result = root();
  document.body.appendChild(result);
  return document.toString();
}

export { renderToString };
