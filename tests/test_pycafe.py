"""Validate author input through a real Sphinx build, including hostile attributes."""
import base64
import gzip
import io
import json
import sys
import tempfile
import unittest
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

from sphinx.application import Sphinx

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'docs/_ext'))
from pycafe import urls


class PyCafeTests(unittest.TestCase):
    def test_snippet_roundtrip(self):
        code = (ROOT / 'pycafe/sine_wave/app.py').read_text()
        requirements = (ROOT / 'pycafe/sine_wave/requirements.txt').read_text()
        embed, edit = urls(code, requirements)
        self.assertEqual(urlsplit(embed).path, '/embed')
        self.assertEqual(urlsplit(edit).path, '/snippet/solara/v1')
        self.assertEqual(urlsplit(embed).fragment, urlsplit(edit).fragment)
        payload = parse_qs(urlsplit(embed).fragment)['c'][0]
        self.assertEqual(json.loads(gzip.decompress(base64.b64decode(payload))),
                         {'code': code, 'requirements': requirements})
        self.assertEqual(urls(code, requirements), (embed, edit))

    def test_validation_and_escaping(self):
        with tempfile.TemporaryDirectory() as temporary:
            source = Path(temporary) / 'docs'
            source.mkdir()
            (source / 'conf.py').write_text(
                f'import sys\nsys.path.insert(0, {str(ROOT / "docs/_ext")!r})\n'
                'extensions = ["pycafe"]\n')
            (source / 'index.rst').write_text('''Examples
========

.. pycafe::
   :project: user.name/example-1
   :title: " onload="alert(1)<script>
   :height: 600px

.. pycafe::
   :project: user/project" onload="alert(1)

.. pycafe::
   :project: user/project
   :height: 500px;border:expression(1)

.. pycafe::
   :source: ../outside

.. pycafe::
   :source: absent

.. pycafe::
   :project: user/project
   :source: sine_wave
''')
            warning = io.StringIO()
            app = Sphinx(str(source), str(source), str(Path(temporary)/'out'),
                         str(Path(temporary)/'cache'), 'html',
                         status=io.StringIO(), warning=warning, freshenv=True)
            app.build()
            output = (Path(temporary)/'out/index.html').read_text()
            self.assertEqual(output.count('<iframe '), 1)
            self.assertIn('height="600"', output)
            self.assertIn('&quot; onload=&quot;alert(1)&lt;script&gt;', output)
            for message in ['Project must', 'Height must', 'Source must',
                            'Cannot read PyCafe source', 'Specify exactly one']:
                self.assertIn(message, warning.getvalue())


if __name__ == '__main__':
    unittest.main()
