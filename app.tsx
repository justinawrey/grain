import { computed, effect, type Reactive, reactive } from "./lib/reactivity.ts";
import { serve } from "./lib/serve.ts";

function Text({ name }: { name: Reactive<string> }) {
  return (
    <p aria-label={name}>
      Hello, {name}
    </p>
  );
}

function Home() {
  const count = reactive(0);
  const doubledCount = computed(() => count.value * 2);
  effect(() => {
    console.log("doubled count:", doubledCount.value);
  });

  const name = reactive("Justin");
  function setName(e: InputEvent) {
    name.value = (e.target as HTMLInputElement).value;
  }

  return (
    <div>
      <button onClick={() => count.value++}>
        Count is: {count}
      </button>
      <p>Doubled count is: {doubledCount}</p>

      <Text name={name} />
      <input type="text" onInput={setName} />
    </div>
  );
}

function About() {
  return <div>About</div>;
}

await serve({
  "/": Home,
  "/about": About,
});
