const proxySymbol = Symbol("isProxy");

// deno-lint-ignore no-explicit-any
function isProxy(obj: any) {
  return obj[proxySymbol];
}

export { isProxy, proxySymbol };
