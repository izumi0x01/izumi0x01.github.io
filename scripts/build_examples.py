"""Execute repository examples in isolated processes with bounded resources."""
from pathlib import Path
import os
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
GENERATED = ROOT / 'build/generated'

def render(source, output):
    import resource
    resource.setrlimit(resource.RLIMIT_CPU, (60, 60))
    resource.setrlimit(resource.RLIMIT_AS, (2 * 1024**3, 2 * 1024**3))
    import matplotlib
    matplotlib.use('Agg')
    import runpy
    from matplotlib.animation import PillowWriter
    import matplotlib.pyplot as plt
    namespace = runpy.run_path(source)
    animation = namespace['ani']
    animation.save(output, writer=PillowWriter(fps=1000 / animation.event_source.interval))
    plt.close('all')

def build():
    from verify_outputs import verify
    for source in sorted((ROOT / 'examples').rglob('*.py')):
        output = GENERATED / source.relative_to(ROOT / 'examples').with_suffix('.gif')
        output.parent.mkdir(parents=True, exist_ok=True)
        output.unlink(missing_ok=True)
        subprocess.run([sys.executable, __file__, str(source), str(output)],
                       check=True, timeout=90, cwd=output.parent,
                       env={**os.environ, 'OPENBLAS_NUM_THREADS': '1', 'OMP_NUM_THREADS': '1',
                            'MPLCONFIGDIR': str(GENERATED / '.matplotlib')})
        verify(output)

if __name__ == '__main__':
    if len(sys.argv) == 3:
        render(*sys.argv[1:])
    else:
        build()
