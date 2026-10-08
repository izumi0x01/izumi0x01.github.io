// Rich output is isolated from the article and the JupyterLite kernel.
export function renderHTML(output, html) {
 const frame = document.createElement('iframe');
 frame.className = 'python-html-output';
 frame.title = 'Python HTML output / Matplotlib animation';
 frame.setAttribute('sandbox', 'allow-scripts');
 const token = crypto.randomUUID();
 let lastHeight = 0;
 const resize = event => {
  if (event.origin !== 'null' || event.source !== frame.contentWindow) return;
  const message = event.data;
  if (message?.type !== 'python-output-size' || message.token !== token) return;
  const height = Math.ceil(message.height);
  if (!Number.isFinite(height) || height < 1 || height > 100000 || height === lastHeight) return;
  lastHeight = height; frame.style.height = `${height}px`;
 };
 window.addEventListener('message', resize);
 const bridge = `(() => {
  const root = document.getElementById('python-output-root');
  let pending = false, previous = 0;
  function measure() {
   if (pending) return;
   pending = true;
   queueMicrotask(() => {
    pending = false;
    const height = Math.ceil(root.getBoundingClientRect().height);
    if (height === previous) return;
    previous = height;
    parent.postMessage({type:'python-output-size', token:${JSON.stringify(token)}, height}, ${JSON.stringify(location.origin)});
   });
  }
  new ResizeObserver(measure).observe(root);
  document.addEventListener('load', measure, true);
  window.addEventListener('resize', measure);
  measure();
 })();`;
 frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline' https://cdnjs.cloudflare.com https://maxcdn.bootstrapcdn.com; font-src https://cdnjs.cloudflare.com https://maxcdn.bootstrapcdn.com; img-src data: blob:; base-uri 'none'; form-action 'none'"><style>html,body{margin:0;padding:0;overflow:hidden}body{font:14px sans-serif}#python-output-root{display:flow-root}img,svg,video{max-width:100%;height:auto}.animation{width:100%}.anim-controls{max-width:100%}.anim-buttons{display:flex;flex-wrap:wrap;justify-content:center}.anim-buttons button{min-width:26px;min-height:28px;cursor:pointer}#python-output-root input[type=range].anim-slider{width:95%;max-width:100%;box-sizing:border-box}</style></head><body><main id="python-output-root">${html}</main><script>${bridge}</script></body></html>`;
 output.append(frame);
 return () => window.removeEventListener('message', resize);
}
