self.onmessage = async (event) => {
  const { type, payload } = event.data;
  if (type === 'SIMULATE_WASM_OPTIMIZATION') {
    const compressed = payload.map((slide) => ({ ...slide, markdown: slide.markdown.trim() }));
    self.postMessage({ type: 'WASM_DONE', payload: compressed });
  }
};
