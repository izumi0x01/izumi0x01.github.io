import {renderHTML} from './python-html-output.mjs';
import {EditorView, basicSetup} from 'codemirror';
import {python} from '@codemirror/lang-python';
let runtime;
let queue = Promise.resolve();
async function getKernel(url) {
 if (!runtime) runtime = (async () => {
  const source = new URL(url, location.href);
  if (source.origin !== location.origin) throw Error('Runtime must use the same origin');
  const frame = document.createElement('iframe');
  frame.className = 'python-runtime'; frame.title = 'JupyterLite Python runtime';
  frame.src = source.href; document.body.append(frame);
  const deadline = Date.now() + 120000;
  while (!frame.contentWindow?.jupyterapp) {
   if (Date.now() > deadline) throw Error('JupyterLiteの読み込みがタイムアウトしました。Reset後に再試行してください。');
   await new Promise(r => setTimeout(r, 100));
  }
  const app = frame.contentWindow.jupyterapp;
  await app.started;
  await app.serviceManager.ready;
  const kernel = await app.serviceManager.kernels.startNew({name: 'python'});
  const init = kernel.requestExecute({code: '%matplotlib inline', silent: true});
  await init.done; init.dispose();
  return kernel;
 })().catch(error => { runtime = undefined; document.querySelector('.python-runtime')?.remove(); throw error; });
 return runtime;
}
for (const block of document.querySelectorAll('.python-interactive')) {
 const initial = block.querySelector('pre').textContent;
 const host = block.querySelector('.python-editor'); host.replaceChildren();
 const editor = new EditorView({doc: initial, extensions: [basicSetup, python(), EditorView.lineWrapping], parent: host});
 const output = block.querySelector('.python-output');
 let cleanup = [];
 const clearOutput = () => {cleanup.forEach(dispose => dispose()); cleanup = []; output.replaceChildren();};
 const run = block.querySelector('.python-run'), reset = block.querySelector('.python-reset');
 const status = block.querySelector('.python-status');
 const text = value => { const pre = document.createElement('pre'); pre.textContent = value; output.append(pre); };
 run.onclick = () => {
  run.disabled = reset.disabled = true; status.textContent = '実行待ち…';
  queue = queue.catch(() => {}).then(async () => {
   clearOutput(); status.textContent = 'Pythonを準備中…';
   try {
    const kernel = await getKernel(block.dataset.runtime); status.textContent = '実行中…';
    let clearPending = false;
    const future = kernel.requestExecute({code: editor.state.doc.toString(), stop_on_error: true});
    future.onIOPub = msg => {
     const type = msg.header.msg_type, c = msg.content;
     if (type === 'clear_output') { if (c.wait) clearPending = true; else clearOutput(); return; }
     if (!['stream','error','display_data','execute_result'].includes(type)) return;
     if (clearPending) {clearOutput(); clearPending = false;}
     if (type === 'stream') text(c.text);
     else if (type === 'error') text(c.traceback.join('\n').replace(/\x1b\[[0-9;]*m/g, ''));
     else if (c.data['text/html']) cleanup.push(renderHTML(output, c.data['text/html']));
     else if (c.data['image/png']) { const img = document.createElement('img'); img.alt = 'Matplotlib Figure'; img.src = 'data:image/png;base64,' + c.data['image/png']; output.append(img); }
     else if (c.data['image/svg+xml']) {const img = document.createElement('img'); img.alt = 'Matplotlib Figure'; img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(c.data['image/svg+xml']); output.append(img);}
     else if (c.data['text/plain']) text(c.data['text/plain']);
    };
    await future.done; future.dispose(); status.textContent = '完了';
   } catch (error) {text(String(error)); status.textContent = '実行できませんでした';}
   finally {run.disabled = reset.disabled = false;}
  });
 };
 reset.onclick = () => {editor.dispatch({changes: {from: 0, to: editor.state.doc.length, insert: initial}}); clearOutput(); status.textContent = '';};
}
