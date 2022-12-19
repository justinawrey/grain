// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const context = [];
function createEffect(fn) {
    context.push(fn);
    try {
        fn();
    } finally{
        context.pop();
    }
}
const proxySymbol = Symbol("isProxy");
function isProxy(obj) {
    return obj[proxySymbol];
}
function reactive(defaultValue) {
    function checkValue(prop) {
        if (prop !== "value") throw new Error('Only "value" is supported');
    }
    const subscribedEffects = new Set();
    const reactiveObj = {
        value: defaultValue
    };
    return new Proxy(reactiveObj, {
        get (target, prop, receiver) {
            if (prop === proxySymbol) return true;
            checkValue(prop);
            const currentEffect = context[context.length - 1];
            if (currentEffect) {
                subscribedEffects.add(currentEffect);
            }
            return Reflect.get(target, prop, receiver);
        },
        set (target, prop, newValue, receiver) {
            checkValue(prop);
            const setResult = Reflect.set(target, prop, newValue, receiver);
            for (const effect of subscribedEffects){
                effect();
            }
            return setResult;
        }
    });
}
function createDomElement(element, props) {
    const el = document.createElement(element);
    for (const [name, value] of Object.entries(props)){
        if (name.startsWith("on")) {
            const eventName = name.slice(2).toLowerCase();
            el.addEventListener(eventName, value);
            continue;
        }
        if (name === "children") {
            for (const child of value){
                if (typeof child === "string") {
                    el.appendChild(document.createTextNode(child));
                }
                if (typeof child === "object") {
                    if (isProxy(child)) {
                        const node = document.createTextNode("");
                        el.appendChild(node);
                        createEffect(()=>{
                            node.textContent = child.value;
                        });
                    } else {
                        el.appendChild(child);
                    }
                }
            }
            continue;
        }
        el.setAttribute(name, value);
    }
    return el;
}
function jsx(element, props) {
    const result = typeof element === "string" ? createDomElement(element, props) : element(props);
    return result;
}
function mount(root) {
    document.body.appendChild(root());
}
function Text({ name  }) {
    return jsx("p", {
        children: [
            "Hello, ",
            name
        ]
    });
}
function App() {
    const count = reactive(0);
    return jsx("div", {
        children: [
            jsx("button", {
                onClick: ()=>count.value++,
                children: [
                    "Count is: ",
                    count
                ]
            }),
            jsx(Text, {
                name: "Justin"
            })
        ]
    });
}
mount(App);
