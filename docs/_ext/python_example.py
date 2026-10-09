"""One Python source supplies highlighted code, generated GIF and Replite."""
from pathlib import Path
import os
from posixpath import relpath
from urllib.parse import quote
from docutils import nodes
from docutils.parsers.rst import directives
from sphinx.util.docutils import SphinxDirective
from jupyterlite_sphinx.jupyterlite_sphinx import RepliteIframe

ROOT = Path(__file__).resolve().parents[2]

def interactive_code(source):
    return source + '\n\nfrom IPython.display import HTML, display\nplt.close(fig)\ndisplay(HTML(ani.to_jshtml(default_mode="loop")))\n'

class PythonExample(SphinxDirective):
    option_spec = {'source': directives.unchanged_required, 'mode': directives.unchanged_required}

    def run(self):
        name = self.options['source']
        source = (ROOT / 'examples' / name).resolve()
        if not source.is_relative_to(ROOT / 'examples') or source.suffix != '.py':
            raise self.error('source must be a Python file inside examples/')
        self.env.note_dependency(str(source))
        code = source.read_text()
        mode = self.options['mode']
        if mode == 'code':
            literal = nodes.literal_block(code, code, language='python')
            link = nodes.reference('', 'GitHubでサンプルを編集', refuri='https://github.com/izumi0x01/izumi0x01.github.io/edit/main/examples/' + quote(name))
            return [nodes.paragraph('', '', link), literal]
        if mode == 'output':
            output = ROOT / 'build/generated' / Path(name).with_suffix('.gif')
            self.env.note_dependency(str(output))
            uri = os.path.relpath(output, Path(self.get_source_info()[0]).parent)
            return [nodes.image(uri=uri, alt=f'{name} の実行結果', width='100%')]
        if mode == 'interactive':
            page = self.env.app.builder.get_target_uri(self.env.docname)
            prefix = relpath('wiki/lite', page if page.endswith('/') else '.')
            return [RepliteIframe(prefix=prefix, content=interactive_code(code).splitlines(),
                width='100%', height='720px', prompt='Interactive Pythonを起動',
                lite_options={'kernel': 'python', 'execute': '0', 'toolbar': '1',
                              'promptCellPosition': 'top', 'clearCellsOnExecute': '1',
                              'clearCodeContentOnExecute': '0'})]
        raise self.error('mode must be code, output or interactive')

def setup(app):
    app.add_directive('python-example', PythonExample)
    return {'parallel_read_safe': True}
