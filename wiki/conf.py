import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent / '_ext'))
project = 'Technical Wiki'
author = 'Izumi'
language = 'ja'
extensions = ['myst_parser', 'sphinx.ext.mathjax', 'python_run']
myst_enable_extensions = ['dollarmath', 'amsmath', 'colon_fence']
html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']
templates_path = ['_templates']
html_css_files = ['runner.css']
html_js_files = ['runner.js']
html_show_sourcelink = False
exclude_patterns = ['_build']
html_search_options = {'type': 'search_ja.SubstringSplitter'}

# The theme links directly to each Markdown source in GitHub's web editor.
# GitHub handles authentication and repository write permissions.
html_context = {
    'display_github': True,
    'github_user': 'izumi0x01',
    'github_repo': 'izumi0x01.github.io',
    'github_version': 'main',
    'conf_py_path': '/wiki/',
}
html_theme_options = {'vcs_pageview_mode': 'edit'}


def hide_generated_page_edit_links(app, pagename, templatename, context, doctree):
    # Generated search/index pages have no editable source file.
    if pagename not in app.env.found_docs:
        context['display_vcs_links'] = False


def setup(app):
    app.connect('html-page-context', hide_generated_page_edit_links)
