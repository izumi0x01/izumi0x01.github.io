"""Discover additional kernel installations without duplicating sys.prefix."""
import sys
from pathlib import Path
from jupyter_core.paths import jupyter_path
c = get_config()  # noqa: F821 -- provided by Jupyter's config loader
standard = (Path(sys.prefix) / 'share/jupyter/labextensions').resolve()
c.FederatedExtensionAddon.extra_labextensions_path = [
    path for path in jupyter_path('labextensions')
    if Path(path).resolve() != standard
]
