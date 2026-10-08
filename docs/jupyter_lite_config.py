"""Discover installed extensions, including environments using JUPYTER_PATH."""
from jupyter_core.paths import jupyter_path
c.FederatedExtensionAddon.extra_labextensions_path = jupyter_path('labextensions')
