"""Reject missing, empty, corrupt or single-frame animation artifacts."""
from pathlib import Path
from PIL import Image

def verify(path):
    path = Path(path)
    if not path.is_file() or path.stat().st_size == 0:
        raise ValueError(f'Missing or empty GIF: {path}')
    with Image.open(path) as image:
        if image.format != 'GIF' or image.n_frames < 2:
            raise ValueError(f'Expected animated GIF: {path}')
        for frame in range(image.n_frames):
            image.seek(frame)
            image.load()
        if image.info.get('loop') != 0:
            raise ValueError(f'Expected looping GIF: {path}')

if __name__ == '__main__':
    root = Path(__file__).resolve().parents[1]
    sources = list((root / 'examples').rglob('*.py'))
    if not sources:
        raise ValueError('No examples found')
    for source in sources:
        verify(root / 'build/generated' / source.relative_to(root / 'examples').with_suffix('.gif'))
