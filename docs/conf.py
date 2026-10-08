import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
project = 'Izumi | Research & Wiki'
author = 'Izumi'
language = 'ja'
extensions = ['myst_parser', 'sphinx.ext.mathjax', 'jupyterlite_sphinx']
myst_enable_extensions = ['dollarmath', 'amsmath', 'colon_fence']
html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']
templates_path = ['_templates']
html_css_files = ['custom.css']
html_show_sourcelink = False
exclude_patterns = ['_build', '_contents']
html_search_options = {'type': 'search_ja.SubstringSplitter'}
replite_auto_execute = False
html_context = {
    'display_github': True,
    'github_user': 'izumi0x01',
    'github_repo': 'izumi0x01.github.io',
    'github_version': 'main',
    'conf_py_path': '/docs/',
}
html_theme_options = {'vcs_pageview_mode': 'edit'}
def hide_generated_page_edit_links(app, pagename, templatename, context, doctree):
    if pagename not in app.env.found_docs:
        context['display_vcs_links'] = False
# replite currently computes iframe paths as if the builder were html.
# Compute them from dirhtml output directories so nested pages also work.
def fix_replite_paths(app, pagename, templatename, context, doctree):
    import posixpath
    import re
    output = app.builder.get_target_uri(pagename)
    directory = output if output.endswith('/') else posixpath.dirname(output)
    lite = posixpath.relpath('lite', directory or '.')
    context['body'] = re.sub(r'src="(?:\.\./)*lite/', f'src="{lite}/', context.get('body', ''))

def setup(app):
    app.connect('html-page-context', hide_generated_page_edit_links)
    app.connect('html-page-context', fix_replite_paths)

jupyterlite_config = str(Path(__file__).parent / 'jupyter_lite_config.py')
