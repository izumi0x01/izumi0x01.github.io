"""Inline editor using the deployed JupyterLite service manager."""
from html import escape
from docutils import nodes
from sphinx.util.docutils import SphinxDirective

class PythonInteractive(SphinxDirective):
    has_content = True
    def run(self):
        code = escape('\n'.join(self.content))
        # dirhtml paths are relative to the current article directory.
        from posixpath import relpath
        page = self.env.app.builder.get_target_uri(self.env.docname)
        base = relpath('wiki/lite/tree/index.html', page if page.endswith('/') else page.rsplit('/', 1)[0] or '.')
        return [nodes.raw('', f'<section class="python-interactive" data-runtime="{escape(base, quote=True)}"><div class="python-controls"><span>Python</span><button type="button" class="python-run">Run ▶</button><button type="button" class="python-reset">Reset</button><span class="python-status" role="status"></span></div><div class="python-loading" hidden><progress class="python-progress" max="3" value="0" aria-label="Pythonの準備段階"></progress><span class="python-timing"></span></div><div class="python-editor"><pre>{code}</pre></div><div class="python-output" aria-live="polite"></div></section>', format='html')]

def page_assets(app, pagename, templatename, context, doctree):
    if doctree is not None and any('class="python-interactive"' in node.astext()
                                  for node in doctree.findall(nodes.raw)):
        app.add_css_file('python-interactive.css')
        app.add_js_file('python-interactive.js', type='module')

def setup(app):
    app.add_directive('python-interactive', PythonInteractive)
    app.connect('html-page-context', page_assets)
    return {'parallel_read_safe': True}
