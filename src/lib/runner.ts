import {EditorView} from '@codemirror/view';
import {basicSetup} from 'codemirror';
import {python} from '@codemirror/lang-python';
let worker: Worker | undefined;
let active: { fail: (message: string) => void } | undefined;
const editors: EditorView[] = [];
const theme = EditorView.theme({ '&':{backgroundColor:'var(--panel)',color:'var(--ink)'}, '.cm-gutters':{backgroundColor:'var(--paper)',color:'var(--muted)',borderRight:'1px solid var(--line)'}, '.cm-activeLine':{backgroundColor:'#7d9e7915'}, '.cm-activeLineGutter':{backgroundColor:'#7d9e7915'}, '.cm-cursor':{borderLeftColor:'var(--ink)'}});
function terminate() { worker?.terminate(); worker=undefined; }
for(const root of document.querySelectorAll<HTMLElement>('.python-runner')) {
 const initial=root.dataset.code || '';
 const view=new EditorView({doc:initial,extensions:[basicSetup,python(),theme,EditorView.contentAttributes.of({'aria-label':'Pythonコード'})],parent:root.querySelector('.runner-editor')!});
 editors.push(view);
 const button=(action:string)=>root.querySelector<HTMLButtonElement>(`[data-action="${action}"]`)!;
 const status=root.querySelector<HTMLElement>('.runner-status')!;
 const output=root.querySelector<HTMLElement>('.runner-output')!;
 let timer: ReturnType<typeof setTimeout>;
 const finish=()=>{clearTimeout(timer);active=undefined;document.querySelectorAll<HTMLButtonElement>('[data-action="run"]').forEach(b=>b.disabled=false);button('stop').disabled=true;};
 const fail=(message:string)=>{terminate();output.replaceChildren();const pre=document.createElement('pre');pre.className='error';pre.textContent=message;output.append(pre);status.textContent='実行を終了しました。';finish();};
 button('run').addEventListener('click',()=>{
  if(active)return;
  output.replaceChildren();status.textContent='実行準備中…';active={fail};
  document.querySelectorAll<HTMLButtonElement>('[data-action="run"]').forEach(b=>b.disabled=true);button('stop').disabled=false;
  timer=setTimeout(()=>fail('初期化がタイムアウトしました。通信環境を確認して再実行してください。'),180000);
  try {
   worker ??= new Worker(`${import.meta.env.BASE_URL.replace(/\/$/,'')}/python-worker.mjs`,{type:'module'});
   worker.onerror=event=>fail(`Python環境を起動できませんでした: ${event.message}`);
   worker.onmessage=({data})=>{
    if(data.type==='status')status.textContent=data.message;
    if(data.type==='running'){clearTimeout(timer);timer=setTimeout(()=>fail('実行上限30秒に達したため停止しました。Python環境は次回再初期化されます。'),30000);status.textContent='実行中…';}
    if(data.type==='result'){
     if(data.stdout){const pre=document.createElement('pre');pre.textContent=data.stdout;output.append(pre);}
     for(const [index,encoded] of (data.images as string[]).entries()){const img=document.createElement('img');img.src=`data:image/png;base64,${encoded}`;img.alt=`Python実行結果のグラフ ${index+1}`;output.append(img);}
     if(data.error){const pre=document.createElement('pre');pre.className='error';pre.textContent=data.error;output.append(pre);}
     status.textContent=data.error?'エラーが発生しました。':'実行完了';finish();
    }
   };
   worker.postMessage({code:view.state.doc.toString()});
  }catch(error){fail(String(error));}
 });
 button('stop').addEventListener('click',()=>active?.fail('ユーザー操作で停止しました。'));
 button('reset').addEventListener('click',()=>{view.dispatch({changes:{from:0,to:view.state.doc.length,insert:initial}});if(!active){output.replaceChildren();status.textContent='初期コードに戻しました。';}});
 button('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(view.state.doc.toString());button('copy').textContent='Copied';}catch{button('copy').textContent='コピー不可';}setTimeout(()=>button('copy').textContent='Copy',2000);});
}
window.addEventListener('pagehide',()=>{terminate();editors.forEach(view=>view.destroy());});
