# Research HOME & Interactive Wiki

HOMEとWikiを単一のSphinxプロジェクト（`docs/`）から生成します。全ページにRead the Docs Themeを使用します。

## ビルド・プレビュー

Python 3.10以上（CIは3.12）を使用します。

```sh
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
python3 scripts/build.py
python3 scripts/check_links.py
python3 scripts/preview.py
```

http://localhost:4321/ で確認できます。`dirhtml`によりHOMEは`/`、Wikiは`/wiki/`、記事は`/wiki/python/matplotlib/`です。相対リンクを使用するためサブパスにも配置できます。

## 更新

- `docs/index.md`: HOMEのProfile、Research Interests、Research Projects、Publications、Education、Experience、Awards、Contact。実在する本人の情報だけを追記し、業績は分類内で新しい順に並べます。
- `docs/_static/images/`: 写真と図。写真未登録のため現在は明示したプレースホルダーです。
- `docs/wiki/**/*.md`: MyST Markdownの記事。各`index.md`のtoctreeで階層を管理します。
- `docs/conf.py`、`docs/_templates/layout.html`、`docs/_static/custom.css`: 共通設定、HOME / Wikiメニュー、最小限のCSS。

記事の **Edit on GitHub** からMarkdownを編集・CommitするとActionsが検証して自動公開します。ブランチ保護がある場合はPRをマージします。PagesのSourceはGitHub Actionsに設定してください。

## Python実行

[JupyterLite-Sphinx標準のreplite](https://jupyterlite-sphinx.readthedocs.io/en/latest/directives/replite.html)を使用します。

````markdown
```{replite}
:kernel: python
:height: 450px
:execute: False

import numpy as np
import matplotlib.pyplot as plt
x = np.linspace(0, 10, 100)
plt.plot(x, np.sin(x))
plt.show()
```
````

セルをクリックしてコードを編集し、Shift+Enterで実行します。Pyodideはブラウザ内で動作し、Pythonサーバーは不要です。初回のカーネル・NumPy・Matplotlib取得にはインターネット接続が必要です。別の埋め込みセルは変数を共有しません。自動実行は無効です。

## 検証・公開

```sh
npm ci
npm exec playwright install chromium
npm test
```

PRではビルド・内部リンク・ブラウザ検証を行い、mainへのpushでは同じ検証に成功した場合だけ公式GitHub Pages Actionsで公開します。

旧`wiki/`、`src/`、`data/`、`assets/`、`public/`は移行元として保存し、現在の公開ビルドには使用しません。旧データの架空サンプル論文はHOMEには掲載しません。
