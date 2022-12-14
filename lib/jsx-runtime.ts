// deno-lint-ignore-file no-explicit-any
import { effect } from "./reactivity.ts";
import { isProxy } from "./is-proxy.ts";
import { document } from "./document.ts";

function createDomElement(element: string, props: any) {
  const el = document.createElement(element);

  for (const [name, value] of Object.entries(props)) {
    // This may not be specific enough of a check.
    // For example the attribute "onset" would proc.
    if (name.startsWith("on")) {
      const eventName = name.slice(2).toLowerCase();
      el.addEventListener(eventName, value as any);
      continue;
    }

    if (name === "children") {
      for (const child of value as any) {
        // Text node
        if (typeof child === "string") {
          el.appendChild(document.createTextNode(child));
        }

        if (typeof child === "object") {
          // Reactive value
          if (isProxy(child)) {
            const node = document.createTextNode("");
            el.appendChild(node);

            effect(() => {
              node.textContent = child.value;
            });
          } else {
            // Html element
            el.appendChild(child);
          }
        }
      }

      continue;
    }

    if (isProxy(value)) {
      effect(() => {
        // @ts-ignore - ssssh
        el.setAttribute(name, value.value);
      });
      continue;
    }

    el.setAttribute(name, value as any);
  }

  return el;
}

function jsx(element: any, props: any) {
  const result = typeof element === "string"
    ? createDomElement(element, props)
    : element(props);

  return result;
}

export { jsx, jsx as jsxs };
