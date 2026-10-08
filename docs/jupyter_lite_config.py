"""Discover installed kernels in standard Jupyter data directories."""
from jupyter_core.paths import jupyter_path
c = get_config()  # noqa: F821 -- provided by Jupyter's config loader
c.FederatedExtensionAddon.extra_labextensions_path = jupyter_path('labextensions')
