"""The publication contains only the selected inline Python articles."""
from pathlib import Path
import unittest
ROOT = Path(__file__).resolve().parents[1]

class WikiTests(unittest.TestCase):
    def test_article_set(self):
        articles = {str(p.relative_to(ROOT / 'docs/wiki'))
                    for p in (ROOT / 'docs/wiki').rglob('*.md')}
        expected = {'index.md', 'python/index.md', 'python/interactive.md',
                    'python/numpy-interactive.md', 'python/matplotlib-interactive.md',
                    'python/animation.md', 'python/matplotlib.md',
                    'python/multiple-plots.md', 'python/scatter-plot.md'}
        self.assertEqual(articles, expected)
        for name in expected - {'index.md', 'python/index.md'}:
            text = (ROOT / 'docs/wiki' / name).read_text()
            self.assertTrue('```{python-interactive}' in text or '```{python-example}' in text)
