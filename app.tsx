import { createSignal, mount } from "./lib/mod.ts";

function App() {
  const [count, setCount] = createSignal(0);

  return <div hi="hi"></div>;
}

mount(App);
