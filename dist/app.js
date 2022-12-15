// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function jsx() {
    console.log("hi");
}
const context = [];
function createSignal(defaultValue) {
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
function mount(root) {
    document.body.appendChild(root());
}
function App() {
    const [count, setCount] = createSignal(0);
    return jsx("div", {
        hi: "hi"
    });
}
mount(App);
