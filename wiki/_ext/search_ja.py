"""Add Japanese substring tokens to Sphinx's standard Japanese search index."""
import re
from sphinx.search.ja import DefaultSplitter

class SubstringSplitter(DefaultSplitter):
    def split(self, text):
        words = super().split(text)
        for run in re.findall(r'[\u3040-\u30ff\u3400-\u9fff]+', text):
            for length in range(2, min(len(run), 12) + 1):
                words.extend(run[start:start + length] for start in range(len(run) - length + 1))
        return list(set(words))
