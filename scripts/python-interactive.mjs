import {renderHTML} from './python-html-output.mjs';
import {EditorView, basicSetup} from 'codemirror';
import {python} from '@codemirror/lang-python';
let runtime;
let queue = Promise.resolve();
const plottingKernels = new WeakSet();
function timeout(promise, message) {
 let timer;
 return Promise.race([promise, new Promise((_, reject) => {
  timer = setTimeout(() => reject(Error(message)), 120000);
 })]).finally(() => clearTimeout(timer));
}
async function getKernel(url, report) {
 if (!runtime) runtime = (async () => {
  report('1/3 JupyterLiteを読み込み中…', 0);
  const source = new URL(url, location.href);
  if (source.origin !== location.origin) throw Error('Runtime must use the same origin');
  const frame = document.createElement('iframe');
  frame.className = 'python-runtime'; frame.title = 'JupyterLite Python runtime';
  frame.src = source.href; document.body.append(frame);
  const deadline = Date.now() + 120000;
  while (!frame.contentWindow?.jupyterapp) {
   if (Date.now() > deadline) throw Error('JupyterLiteの読み込みがタイムアウトしました。Runで再試行してください。');
   await new Promise(r => setTimeout(r, 100));
  }
  const app = frame.contentWindow.jupyterapp;
  await timeout(app.started, 'JupyterLiteの起動がタイムアウトしました。');
  await timeout(app.serviceManager.ready, 'Pythonサービスの準備がタイムアウトしました。');
  report('2/3 Python環境を起動中…', 1);
  const kernel = await timeout(app.serviceManager.kernels.startNew({name: 'python'}), 'Python環境の起動がタイムアウトしました。');
  await timeout(kernel.info, 'Pythonの初期化がタイムアウトしました。');
  return kernel;
 })().catch(error => { runtime = undefined; document.querySelector('.python-runtime')?.remove(); throw error; });
 return runtime;
}
async function prepare(kernel, code, report) {
 report('3/3 実行の準備中…', 2);
 // NumPy-only cells do not download or initialize Matplotlib.
 if (/(?:matplotlib|\bplt\b|\bFuncAnimation\b)/.test(code) && !plottingKernels.has(kernel)) {
  report('3/3 Matplotlibを読み込み中…', 2);
  const future = kernel.requestExecute({code: 'import matplotlib\nget_ipython().run_line_magic("matplotlib", "inline")', silent: true});
  try {
   const reply = await timeout(future.done, 'Matplotlibの準備がタイムアウトしました。');
   if (reply?.content?.status === 'error') throw Error(reply.content.evalue || 'Matplotlibを準備できませんでした。');
   plottingKernels.add(kernel);
  } finally {future.dispose();}
 }
 report('準備完了', 3);
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
 const loading = block.querySelector('.python-loading');
 const progress = block.querySelector('.python-progress');
 const timing = block.querySelector('.python-timing');
 const report = (label, value) => {status.textContent = label; progress.value = value;};
 const text = value => {const pre = document.createElement('pre'); pre.textContent = value; output.append(pre);};
 run.onclick = () => {
  const started = performance.now();
  let ready;
  run.disabled = reset.disabled = true; loading.hidden = false;
  report('実行待ち…', 0);
  const elapsed = () => {timing.textContent = `経過 ${((performance.now()-started)/1000).toFixed(1)} 秒`;};
  elapsed();
  const ticker = setInterval(elapsed, 250);
  queue = queue.catch(() => {}).then(async () => {
   clearOutput();
   try {
    const code = editor.state.doc.toString();
    const kernel = await getKernel(block.dataset.runtime, report);
    await prepare(kernel, code, report);
    ready = performance.now();
    status.textContent = '実行中…'; progress.removeAttribute('value');
    let clearPending = false;
    const future = kernel.requestExecute({code, stop_on_error: true});
    future.onIOPub = msg => {
     const type = msg.header.msg_type, c = msg.content;
     if (type === 'clear_output') {if (c.wait) clearPending = true; else clearOutput(); return;}
     if (!['stream','error','display_data','execute_result'].includes(type)) return;
     if (clearPending) {clearOutput(); clearPending = false;}
     if (type === 'stream') text(c.text);
     else if (type === 'error') text(c.traceback.join('\n').replace(/\x1b\[[0-9;]*m/g, ''));
     else if (c.data['text/html']) cleanup.push(renderHTML(output, c.data['text/html']));
     else if (c.data['image/png']) {const img = document.createElement('img'); img.alt = 'Matplotlib Figure'; img.src = 'data:image/png;base64,' + c.data['image/png']; output.append(img);}
     else if (c.data['image/svg+xml']) {const img = document.createElement('img'); img.alt = 'Matplotlib Figure'; img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(c.data['image/svg+xml']); output.append(img);}
     else if (c.data['text/plain']) text(c.data['text/plain']);
    };
    try {
     const reply = await future.done;
     status.textContent = reply?.content?.status === 'error' ? 'Pythonエラー' : '完了';
    } finally {future.dispose();}
   } catch (error) {text(String(error)); status.textContent = '実行できませんでした。Runで再試行できます。';}
   finally {
    clearInterval(ticker); progress.value = 3;
    const ended = performance.now();
    timing.textContent = ready === undefined ? `経過 ${((ended-started)/1000).toFixed(1)} 秒` : `準備 ${((ready-started)/1000).toFixed(1)} 秒 / 実行 ${((ended-ready)/1000).toFixed(1)} 秒`;
    run.disabled = reset.disabled = false;
   }
  });
 };
 reset.onclick = () => {
  editor.dispatch({changes: {from: 0, to: editor.state.doc.length, insert: initial}});
  clearOutput(); status.textContent = ''; loading.hidden = true; timing.textContent = ''; progress.value = 0;
 };
}
