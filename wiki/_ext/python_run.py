from html import escape
from docutils import nodes
from docutils.parsers.rst import Directive

class PythonRun(Directive):
    has_content = True
    def run(self):
        code = escape('\n'.join(self.content), quote=True)
        markup = f'''<div class="python-runner" data-code="{code}"><div class="runner-toolbar"><strong>Python / 実行セル</strong><button data-action="run">Run ▶</button><button data-action="stop" disabled>Stop ■</button><button data-action="reset">Reset</button><button data-action="copy">Copy</button></div><textarea class="runner-editor" aria-label="Pythonコード" spellcheck="false">{code}</textarea><div class="runner-status" role="status" aria-live="polite">実行するとPython環境を読み込みます。</div><div class="runner-output" aria-live="polite"></div><p>ブラウザ内で実行 · セル間の変数は独立 · 上限30秒</p></div>'''
        return [nodes.raw('', markup, format='html')]

def setup(app):
    app.add_directive('python-run', PythonRun)
    return {'version': '1.0', 'parallel_read_safe': True, 'parallel_write_safe': True}
