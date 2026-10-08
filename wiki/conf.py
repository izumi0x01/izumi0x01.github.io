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
