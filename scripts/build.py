"""Build HOME and Wiki as one Sphinx dirhtml project."""
from pathlib import Path
import os
import json
import shutil
import subprocess
import sys
ROOT = Path(__file__).resolve().parents[1]
OUT = (ROOT / os.environ.get('BUILD_DIR', 'dist')).resolve()
if OUT != ROOT / 'dist' and Path('/tmp') not in OUT.parents:
    raise ValueError('BUILD_DIR must be dist/ or a directory under /tmp/')
# Build into a clean output so removed extensions do not leave published assets.
if OUT.exists():
    shutil.rmtree(OUT)
# JupyterLite merge tasks do not declare output targets. Reset its generated
# task cache whenever rebuilding the clean publication directory.
for task_cache in (ROOT / 'docs').glob('.jupyterlite.doit.db*'):
    if task_cache.is_file():
        task_cache.unlink()
subprocess.run([sys.executable, '-m', 'sphinx', '-E', '-W', '--keep-going', '-b', 'dirhtml', str(ROOT / 'docs'), str(OUT)], check=True)
runtime_config = json.loads((OUT / 'lite' / 'jupyter-lite.json').read_text())['jupyter-config-data']
if str(runtime_config.get('exposeAppInBrowser', '')).lower() != 'true':
    raise RuntimeError('JupyterLite application API was not enabled in the published configuration')
if not any(ext.get('name') == '@jupyterlite/pyodide-kernel-extension'
           for ext in runtime_config.get('federated_extensions', [])):
    raise RuntimeError('JupyterLite Pyodide kernel extension was not included; check the Python environment')
# Keep standard replite URLs and provide the inline runtime below /wiki/.
shutil.copytree(OUT / 'lite', OUT / 'wiki' / 'lite')
(OUT / '.nojekyll').touch()
print(f'Built single Sphinx HOME + Wiki: {OUT}')
