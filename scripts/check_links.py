"""Check local links and asset references in the generated site."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import os
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else 'dist').resolve()
base = '/' + os.environ.get('BASE_PATH', '').strip('/')
base = base.rstrip('/')
errors = []
class Links(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key not in ('href', 'src') or not value: continue
            parsed = urlsplit(value)
            if parsed.scheme or parsed.netloc or not parsed.path: continue
            path = unquote(parsed.path)
            if path.startswith('/'):
                if base and not (path == base or path.startswith(base + '/')):
                    errors.append(f'{current}: outside base path {path}')
                    continue
                target = root / path[len(base):].lstrip('/')
            else:
                target = current.parent / path
            if target.is_dir(): target /= 'index.html'
            if not target.exists(): errors.append(f'{current}: missing {value}')
for current in root.rglob('*.html'):
    Links().feed(current.read_text())
if errors:
    print('\n'.join(errors))
    sys.exit(1)
print('All generated local links and assets exist.')
