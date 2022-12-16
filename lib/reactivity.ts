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

function reactive<T>(defaultValue: T): [SignalGetter<T>, SignalSetter<T>] {
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

export { createEffect, reactive, watch };
