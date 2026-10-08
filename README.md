# Research Portfolio & Interactive Wiki

HOME一枚とSphinx + Read the Docs Themeの技術Wikiです。`readme.md`には相反する2案があるため、先頭の「最重要方針」に従いSphinx版を採用しました。旧Astroソースは保存していますが、公開物はPythonビルドで生成します。

## 起動とビルド

Python 3.10以上を使用します（GitHub Actionsは3.12）。

```sh
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
python3 scripts/build.py
python3 scripts/preview.py
```

`http://localhost:4321/`でHOME、`/wiki/`でWikiを表示します。ソースは`wiki/`、公開物は`dist/`です。ビルドは生成物の`dist/`を置き換えます。

## 更新

- `data/profile.yml`: 氏名、大学、研究室、学位、分野、連絡先、経歴、受賞歴。未登録項目は明示します。
- `data/research.yml`: 研究テーマ、画像、関連Wiki、論文ID。
- `data/publications.yml`: 著者、題名、媒体、年、種別、DOI、PDF、BibTeX。年の降順に表示します。種別は`journal`、`conference`、`domestic`、`other`。
- `public/`: 写真・画像・PDF。`photo`にはファイル名を指定。未設定の場合はプレースホルダーを表示します。
- `wiki/**/*.md`: 日本語MyST Markdown記事。英語も併記できます。新記事を各`index.md`のtoctreeへ追加します。

サンプル研究と架空論文は実在する本人の実績ではありません。

## 実行セル

記事に以下を書きます。rstでも`.. python-run::`を使えます。

````markdown
```{python-run}
import numpy as np
import matplotlib.pyplot as plt
x = np.linspace(0, 10, 100)
plt.plot(x, np.sin(x))
plt.show()
```
````

数式は`$...$`または`$$...$$`でMathJax表示。コードは編集可能なtextarea、Run / Stop / Reset / Copyを備えます。標準のコードブロックはSphinxがシンタックスハイライトします。

Pyodide 314.0.7 / NumPy / Matplotlibを必要時にCDNから取得し、Web Workerで実行。初回は通信が必要です。コードはPython実行サーバーへ送信しません。ランタイムはページ内で再利用しますが、セルの変数は毎回独立します。モジュールの状態は共有します。実行は直列、図はPNGで各セル直下に表示し、再実行時に出力を消します。

Stopと30秒上限はWorkerを終了し、次回再初期化します。初期化上限180秒、出力100,000文字、図12枚。メモリ量の厳密な制限はありません。

## GitHub Pages

`.github/workflows/deploy.yml`がmainへのpushでビルド・公式Pages Actionsで公開します。Settings → Pages → Sourceを**GitHub Actions**にしてください。

公開先は`https://izumi0x01.github.io/`と`https://izumi0x01.github.io/wiki/`。通常のリポジトリのサブパスも`BASE_PATH`で対応します。

```sh
BASE_PATH=/research python3 scripts/build.py
```

`BASE_PATH=/research python3 scripts/check_links.py`で生成したリンクも検証できます。

`dist/`を`/research/`へ配置してください。Wiki内は相対リンクで動作します。

## 検証

```sh
npm ci
npm exec playwright install chromium
python3 scripts/build.py
npm test
```

PlaywrightはHOME、メニュー、モバイル、Sphinx検索、MathJax、実際のPython / NumPy / Matplotlib、複数セル、例外、再実行、Reset、Stopを確認します。CDN接続が必要です。

## 採用方式の比較

[Academic Pages](https://academicpages.github.io/)は研究業績・CV等の複数ページに強く、[al-folio](https://github.com/alshedivat/al-folio)もJekyllの研究者向けテーマです。今回はHOME一枚を維持するため、構造化データからHTML/CSSを生成します。

[Thebe](https://github.com/jupyter-book/thebe)はthebe-liteでJupyterLiteを利用でき、[JupyterLite](https://jupyterlite.readthedocs.io/en/stable/howto/configure/kernels.html)にはブラウザ内Pyodideカーネルがあります。既存Workerを再利用して依存を増やさず、[Sphinx拡張API](https://www.sphinx-doc.org/en/master/extdev/appapi.html)による小さな独自ディレクティブを採用しました。Binderは不要です。
