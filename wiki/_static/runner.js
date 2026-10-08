document.addEventListener('DOMContentLoaded', () => {
let worker;
let active;
function terminate() { worker?.terminate(); worker=undefined; }
for(const root of document.querySelectorAll('.python-runner')) {
 const initial=root.dataset.code || '';
 const editor=root.querySelector('.runner-editor');
 const button=(action)=>root.querySelector(`[data-action="${action}"]`);
 const status=root.querySelector('.runner-status');
 const output=root.querySelector('.runner-output');
 let timer;
 const finish=()=>{clearTimeout(timer);active=undefined;document.querySelectorAll('[data-action="run"]').forEach(b=>b.disabled=false);button('stop').disabled=true;};
 const fail=(message)=>{terminate();output.replaceChildren();const pre=document.createElement('pre');pre.className='error';pre.textContent=message;output.append(pre);status.textContent='実行を終了しました。';finish();};
 button('run').addEventListener('click',()=>{
  if(active)return;
  output.replaceChildren();status.textContent='実行準備中…';active={fail};
  document.querySelectorAll('[data-action="run"]').forEach(b=>b.disabled=true);button('stop').disabled=false;
  timer=setTimeout(()=>fail('初期化がタイムアウトしました。通信環境を確認して再実行してください。'),180000);
  try {
   worker ??= new Worker(new URL('python-worker.mjs', document.querySelector('script[src*="_static/runner.js"]').src),{type:'module'});
   worker.onerror=event=>fail(`Python環境を起動できませんでした: ${event.message}`);
   worker.onmessage=({data})=>{
    if(data.type==='status')status.textContent=data.message;
    if(data.type==='running'){clearTimeout(timer);timer=setTimeout(()=>fail('実行上限30秒に達したため停止しました。Python環境は次回再初期化されます。'),30000);status.textContent='実行中…';}
    if(data.type==='result'){
     if(data.stdout){const pre=document.createElement('pre');pre.textContent=data.stdout;output.append(pre);}
     for(const [index,encoded] of data.images.entries()){const img=document.createElement('img');img.src=`data:image/png;base64,${encoded}`;img.alt=`Python実行結果のグラフ ${index+1}`;output.append(img);}
     if(data.error){const pre=document.createElement('pre');pre.className='error';pre.textContent=data.error;output.append(pre);}
     status.textContent=data.error?'エラーが発生しました。':'実行完了';finish();
    }
   };
   worker.postMessage({code:editor.value});
  }catch(error){fail(String(error));}
 });
 button('stop').addEventListener('click',()=>active?.fail('ユーザー操作で停止しました。'));
 button('reset').addEventListener('click',()=>{editor.value=initial;if(!active){output.replaceChildren();status.textContent='初期コードに戻しました。';}});
 button('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(editor.value);button('copy').textContent='Copied';}catch{button('copy').textContent='コピー不可';}setTimeout(()=>button('copy').textContent='Copy',2000);});
}
window.addEventListener('pagehide',()=>{terminate();});

});
