// deno-lint-ignore no-explicit-any
function mount(root: any) {
  document.body.appendChild(root());
}

export { mount };
