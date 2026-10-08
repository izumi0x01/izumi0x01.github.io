const VERSION = '314.0.7';
let runtime;
let ready;
const setup = `
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io, base64, contextlib, traceback, json
class _LimitedOutput(io.StringIO):
    def write(self, value):
        remaining = 100000 - self.tell()
        if remaining > 0:
            super().write(value[:remaining])
        return len(value)
def _execute_cell(source):
    plt.close('all')
    output = _LimitedOutput()
    images = []
    error = None
    def capture(*args, **kwargs):
        for number in plt.get_fignums():
            if len(images) >= 12:
                break
            buffer = io.BytesIO()
            plt.figure(number).savefig(buffer, format='png', dpi=100, bbox_inches='tight')
            images.append(base64.b64encode(buffer.getvalue()).decode())
        plt.close('all')
    old_show = plt.show
    plt.show = capture
    try:
        with contextlib.redirect_stdout(output), contextlib.redirect_stderr(output):
            exec(compile(source, '<cell>', 'exec'), {'__name__': '__main__'})
            capture()
    except BaseException:
        error = traceback.format_exc()
    finally:
        plt.show = old_show
        plt.close('all')
    return json.dumps({'stdout': output.getvalue(), 'images': images, 'error': error})
`;
self.onmessage = async ({data}) => {
 try {
  if (!ready) ready = (async () => {
   self.postMessage({type:'status',message:'Python・NumPy・Matplotlibを読み込み中…'});
   const {loadPyodide} = await import(`https://cdn.jsdelivr.net/pyodide/v${VERSION}/full/pyodide.mjs`);
   runtime = await loadPyodide({indexURL:`https://cdn.jsdelivr.net/pyodide/v${VERSION}/full/`});
   await runtime.loadPackage(['numpy','matplotlib']);
   await runtime.runPythonAsync(setup);
  })();
  await ready;
  self.postMessage({type:'running'});
  runtime.globals.set('_cell_source', data.code);
  let result;
  try { result = await runtime.runPythonAsync('_execute_cell(_cell_source)'); }
  finally { runtime.globals.delete('_cell_source'); }
  self.postMessage({type:'result',...JSON.parse(result)});
 } catch(error) { self.postMessage({type:'result',stdout:'',images:[],error:String(error)}); }
};
