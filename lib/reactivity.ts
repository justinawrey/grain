/* Global effect context */

const context: EffectCallback[] = [];

/* Effects */

type EffectCallback = () => void;

function createEffect(fn: EffectCallback): void {
  context.push(fn);

  // If the effect throws, we still need to remove it from global context
  try {
    fn();
  } finally {
    context.pop();
  }
}

/* Signals */

type SignalGetter<T> = () => T;
type SignalSetter<T> = (newValue: T) => void;

function createSignal<T>(defaultValue: T): [SignalGetter<T>, SignalSetter<T>] {
  let value = defaultValue;
  const subscribedEffects: Set<EffectCallback> = new Set();

  const getter: SignalGetter<T> = () => {
    const currentEffect = context[context.length - 1];
    if (currentEffect) {
      subscribedEffects.add(currentEffect);
    }

    return value;
  };

  const setter: SignalSetter<T> = (newValue) => {
    value = newValue;

    for (const effect of subscribedEffects) {
      effect();
    }
  };

  return [getter, setter];
}

/* Reactive */

const proxySymbol = Symbol("isProxy");
type Reactive<T> = {
  value: T;
};

// deno-lint-ignore no-explicit-any
function isProxy(obj: any) {
  return obj[proxySymbol];
}

function reactive<T>(defaultValue: T): Reactive<T> {
  function checkValue(prop: string | symbol) {
    if (prop !== "value") throw new Error('Only "value" is supported');
  }

  const subscribedEffects: Set<EffectCallback> = new Set();
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

  createEffect(() => {
    reactiveObj.value = fn();
  });

  return reactiveObj;
}

function watch<T>(
  signal: SignalGetter<T>,
  cb: (prev: T, curr: T) => void,
): void {
  let prev = signal();
  let curr = signal();

  createEffect(() => {
    prev = curr;
    curr = signal();

    if (prev !== curr) {
      cb(prev, curr);
    }
  });
}

export { computed, createEffect, createSignal, isProxy, reactive };
