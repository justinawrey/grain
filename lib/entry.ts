// deno-lint-ignore-file no-explicit-any
function mount(root: any) {
  document.body.appendChild(root());
}

export { mount };
