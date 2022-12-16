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
function reactive(defaultValue) {
    let value = defaultValue;
    const subscribedEffects = new Set();
    const getter = ()=>{
        const currentEffect = context[context.length - 1];
        if (currentEffect) {
            subscribedEffects.add(currentEffect);
        }
        return value;
    };
    const setter = (newValue)=>{
        value = newValue;
        for (const effect of subscribedEffects){
            effect();
        }
    };
    return [
        getter,
        setter
    ];
}
function watch(signal, cb) {
    let prev = signal();
    let curr = signal();
    createEffect(()=>{
        prev = curr;
        curr = signal();
        if (prev !== curr) {
            cb(prev, curr);
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
                if (typeof child === "function") {
                    const node = document.createTextNode("");
                    el.appendChild(node);
                    createEffect(()=>{
                        node.textContent = child();
                    });
                }
                if (typeof child === "object") {
                    el.appendChild(child);
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
    const [count, setCount] = reactive(0);
    watch(count, (prev, curr)=>console.log("Count changed from", prev, "to", curr));
    return jsx("div", {
        children: [
            jsx("button", {
                onClick: ()=>setCount(1),
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
