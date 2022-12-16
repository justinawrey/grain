import { mount, reactive, watch } from "./lib/mod.ts";

interface TextProps {
  name: string;
}

function Text({ name }: TextProps) {
  return <p>Hello, {name}</p>;
}

function App() {
  const [count, setCount] = reactive(0);

  watch(
    count,
    (prev, curr) => console.log("Count changed from", prev, "to", curr),
  );

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
