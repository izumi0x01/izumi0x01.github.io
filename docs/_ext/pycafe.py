"""Offline PyCafe embeds using the official project and snippet URL formats."""
import base64
import gzip
import html
import json
import re
from pathlib import Path
from urllib.parse import urlencode

from docutils import nodes
from docutils.parsers.rst import directives
from sphinx.util.docutils import SphinxDirective


def urls(code, requirements):
    payload = json.dumps({'code': code, 'requirements': requirements})
    query = urlencode({'c': base64.b64encode(gzip.compress(payload.encode(), mtime=0)).decode()})
    return (f'https://py.cafe/embed?apptype=solara&theme=light&linkToApp=false#{query}',
            f'https://py.cafe/snippet/solara/v1#{query}')


class PyCafe(SphinxDirective):
    has_content = False
    option_spec = {'project': directives.unchanged_required,
                   'source': directives.unchanged_required,
                   'height': directives.unchanged_required,
                   'title': directives.unchanged_required}

    def run(self):
        if ('project' in self.options) == ('source' in self.options):
            raise self.error('Specify exactly one of :project: or :source:.')
        height = self.options.get('height', '500px')
        if not re.fullmatch(r'[1-9][0-9]{1,3}px', height):
            raise self.error('Height must be 10–9999px.')
        if 'project' in self.options:
            project = self.options['project']
            if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_.-]*/[A-Za-z0-9][A-Za-z0-9_-]*', project):
                raise self.error('Project must be USER/PROJECT without URL parameters.')
            embed, edit = f'https://py.cafe/embed/{project}', f'https://py.cafe/{project}'
        else:
            name = self.options['source']
            if not re.fullmatch(r'[a-z][a-z0-9_]*', name):
                raise self.error('Source must be a directory name under pycafe/.')
            root = (Path(self.env.srcdir).parent / 'pycafe').resolve()
            source = (root / name).resolve()
            if source.parent != root:
                raise self.error('Source must stay within pycafe/.')
            try:
                paths = [source / 'app.py', source / 'requirements.txt']
                for path in paths:
                    if path.resolve().parent != source:
                        raise self.error('Source files must stay within their directory.')
                    self.env.note_dependency(str(path))
                embed, edit = urls(*(path.read_text(encoding='utf-8') for path in paths))
            except OSError as exc:
                raise self.error(f'Cannot read PyCafe source: {exc}')
        title = self.options.get('title', 'Interactive Python Example').strip()
        if not title:
            raise self.error('Title must not be empty.')
        escape = html.escape
        markup = (f'<div class="pycafe-example"><iframe src="{escape(embed, quote=True)}" '
                  f'title="{escape(title, quote=True)}" width="100%" height="{height[:-2]}" '
                  f'style="width:100%;height:{height};border:0;" loading="lazy"></iframe>'
                  '<p>表示できない場合やコードを編集する場合： '
                  f'<a href="{escape(edit, quote=True)}" target="_blank" rel="noopener noreferrer">'
                  'Edit on PyCafe（新しいタブ）</a></p></div>')
        return [nodes.raw('', markup, format='html')]


def setup(app):
    app.add_directive('pycafe', PyCafe)
    return {'version': '1.0', 'parallel_read_safe': True, 'parallel_write_safe': True}
