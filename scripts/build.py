"""Build HOME and Wiki as one Sphinx dirhtml project."""
from pathlib import Path
import os
import subprocess
import sys
ROOT = Path(__file__).resolve().parents[1]
OUT = (ROOT / os.environ.get('BUILD_DIR', 'dist')).resolve()
if OUT != ROOT / 'dist' and Path('/tmp') not in OUT.parents:
    raise ValueError('BUILD_DIR must be dist/ or a directory under /tmp/')
subprocess.run([sys.executable, '-m', 'sphinx', '-E', '-W', '--keep-going', '-b', 'dirhtml', str(ROOT / 'docs'), str(OUT)], check=True)
(OUT / '.nojekyll').touch()
print(f'Built single Sphinx HOME + Wiki: {OUT}')
