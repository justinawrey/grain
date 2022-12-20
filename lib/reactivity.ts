import { proxySymbol } from "./is-proxy.ts";

const context: (() => void)[] = [];

function effect(fn: () => void): void {
  context.push(fn);

  // If the effect throws, we still need to remove it from global context
  try {
    fn();
  } finally {
    context.pop();
  }
}

type Reactive<T> = {
  value: T;
};

function reactive<T>(defaultValue: T): Reactive<T> {
  function checkValue(prop: string | symbol) {
    if (prop !== "value") throw new Error('Only "value" is supported');
  }

  const subscribedEffects: Set<() => void> = new Set();
  const reactiveObj = { value: defaultValue };

  return new Proxy(reactiveObj, {
    get(target, prop, receiver) {
      if (prop === proxySymbol) return true;
      checkValue(prop);

      const currentEffect = context[context.length - 1];
      if (currentEffect) {
        subscribedEffects.add(currentEffect);
      }

      return Reflect.get(target, prop, receiver);
    },

    set(target, prop, newValue, receiver) {
      checkValue(prop);

      const setResult = Reflect.set(target, prop, newValue, receiver);
      for (const effect of subscribedEffects) {
        effect();
      }

      return setResult;
    },
  });
}

function computed<T>(fn: () => T): Reactive<T> {
  const reactiveObj = reactive(fn());

  effect(() => {
    reactiveObj.value = fn();
  });

  return reactiveObj;
}

export { computed, effect, type Reactive, reactive };
