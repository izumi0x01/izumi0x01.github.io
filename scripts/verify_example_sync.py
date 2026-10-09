"""Build a temporary cosine variant; never modify the working sample."""
from pathlib import Path
import hashlib
import html
import os
import shutil
import subprocess
import sys
import tempfile
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def verify_sync():
    with tempfile.TemporaryDirectory(prefix='example-sync-') as directory:
        root = Path(directory)
        for name in ('docs', 'scripts', 'examples'):
            shutil.copytree(ROOT / name, root / name,
                            ignore=shutil.ignore_patterns('__pycache__', '_contents', '.jupyterlite.doit.db*'))
        sample = root / 'examples/matplotlib/sine_animation.py'
        original = sample.read_text()
        changed = original.replace('np.sin(x + frame * 0.1)', 'np.cos(x + frame * 0.1)')
        if changed == original:
            raise ValueError('Expected sine expression was not found')
        sample.write_text(changed)
        output = root / 'site'
        subprocess.run([sys.executable, str(root / 'scripts/build.py')], check=True,
                       env={**os.environ, 'BUILD_DIR': str(output)}, stdout=subprocess.DEVNULL)
        page = (output / 'wiki/python/matplotlib/index.html').read_text()
        decoded = html.unescape(unquote(page))
        # Highlighting inserts span elements between code tokens.
        from re import sub
        plain = sub('<[^>]+>', '', decoded)
        assert 'np.cos(x + frame * 0.1)' in plain, 'Displayed code did not update'
        assert 'np.cos(x + frame * 0.1)' in decoded.split('onclick=', 1)[1], 'Replite code did not update'
        assert digest(root / 'build/generated/matplotlib/sine_animation.gif') != digest(
            ROOT / 'build/generated/matplotlib/sine_animation.gif'), 'GIF did not update'
        print('Cosine edit synchronized highlighted source, GIF and Replite initial code.')

if __name__ == '__main__':
    verify_sync()
