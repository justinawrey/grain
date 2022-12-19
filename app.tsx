import { computed, mount, reactive } from "./lib/mod.ts";

interface TextProps {
  name: string;
}

function Text({ name }: TextProps) {
  return <p>Hello, {name}</p>;
}

function App() {
  const count = reactive(0);
  const doubledCount = computed(() => count.value * 2);

  return (
    <div>
      <button onClick={() => count.value++}>
        Count is: {count}
      </button>
      <p>Doubled count is: {doubledCount}</p>
      <Text name="Justin" />
    </div>
  );
}

mount(App);
