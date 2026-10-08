"""Add explicitly requested Jupyter paths without duplicating default extensions."""
import os
import sys
from pathlib import Path

# JupyterLite already scans sys.prefix/share/jupyter/labextensions. Adding that
# directory again creates duplicate build tasks in normal virtual environments.
default = (Path(sys.prefix) / 'share/jupyter/labextensions').resolve()
extra = []
for root in os.environ.get('JUPYTER_PATH', '').split(os.pathsep):
    if root:
        candidate = (Path(root) / 'labextensions').resolve()
        if candidate != default and str(candidate) not in extra:
            extra.append(str(candidate))
c.FederatedExtensionAddon.extra_labextensions_path = extra
