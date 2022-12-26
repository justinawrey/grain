import App from "./app.tsx";
import { renderToString } from "./lib/ssr.ts";

const html = renderToString(App);
console.log(html);
