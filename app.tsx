import { createSignal, mount } from "./lib/mod.ts";

interface TextProps {
  name: string;
}

function Text({ name }: TextProps) {
  return <p>Hello, {name}</p>;
}

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <div>
      <button onClick={() => setCount(1)}>
        Count is: {count}
      </button>
      <Text name="Justin" />
    </div>
  );
}

mount(App);
