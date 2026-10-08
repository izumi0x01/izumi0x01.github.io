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

## Python実行：PyCafe

[公式API](https://py.cafe/docs/api)と[公式プラグイン](https://github.com/py-cafe/mkdocs-pycafe/blob/main/src/mkdocs_pycafe/__init__.py)のSnippet埋め込み方式を使用します。Python環境はPyCafeが提供し、独自バックエンドは不要です。SphinxビルドはPyCafeへの接続を必要としません。

````markdown
```{pycafe}
:source: sine_wave
:height: 500px
:title: 正弦波を実行する
```
````

`:source:` は `pycafe/<名前>/app.py` と `requirements.txt` を読み込み、JSON → gzip → base64でコードを含むURLを生成します。埋め込みURLは `https://py.cafe/embed?apptype=solara&theme=light&linkToApp=false#c=…`、編集URLは `https://py.cafe/snippet/solara/v1#c=…` です。架空の公開プロジェクトIDは使いません。記事をビルドすると最新のリポジトリ内コードが反映され、外部プロジェクトの同期作業は不要です。NumPy、Matplotlibを使用し、グラフは `solara.FigureMatplotlib(fig)` で表示します。

埋め込み内のスライダーなどを操作できます。コードを編集する場合は **Edit on PyCafe** で新しいタブを開き、PyCafeのエディタで変更し、**Save all** で実行環境に反映してからプレビューの **refresh** で再実行します。エディタ付きiframeは採用していません。各アプリは独立しています。初回はパッケージ取得に時間がかかり、インターネット接続が必要です。外部サービスが利用できない場合も、常に表示される編集リンクと記事中のコードを利用できます。

公開済みPyCafeプロジェクトを使用する場合は、`:source:` の代わりに次のように指定します。`USER/PROJECT` は説明用で、実際に公開したIDに置き換えてください。

````markdown
```{pycafe}
:project: USER/PROJECT
:height: 500px
:title: Interactive Python Example
```
````

この場合はPyCafe側でSolaraプロジェクトを作成し、対応する `app.py` と `requirements.txt` をアップロードしてください。Share → EmbedのURLが `https://py.cafe/embed/USER/PROJECT` に対応することと、ログアウト状態で表示されることを確認します。リポジトリ更新時にはPyCafeにもファイルを再アップロードし、表示を再確認します。GitHubとの自動同期は設定していません。公開プロジェクトを使用する方式への変更は任意で、現在のSnippet方式ではPyCafe側の登録・公開作業は不要です。

高さは10〜9999px、幅は100%です。プロジェクトID、ソース名、高さを検証し、titleとURLのHTML属性をエスケープします。任意HTMLやJavaScript属性を指定する機能はありません。

実際のサンプルURL、検証結果、未検証項目は [pycafe/README.md](pycafe/README.md) に記録しています。

## 検証・公開

```sh
npm ci
npm exec playwright install chromium
npm test
python3 -m unittest discover -s tests -p 'test_*.py'
# PyCafeへの接続を含む任意の実行検証
PYCAFE_LIVE=1 npm test -- tests/pycafe-live.spec.ts
```

PRではビルド・内部リンク・ブラウザ検証を行い、mainへのpushでは同じ検証に成功した場合だけ公式GitHub Pages Actionsで公開します。

旧`wiki/`、`src/`、`data/`、`assets/`、`public/`は移行元として保存し、現在の公開ビルドには使用しません。旧データの架空サンプル論文はHOMEには掲載しません。

## 本文内のJupyterLite Pythonコードブロック

既存記事・HOME・ナビゲーションは維持し、新しい検証記事を `/wiki/python/interactive/` に追加しました。MyST記事では次のように記述します。

````markdown
```{python-interactive}
import numpy as np
import matplotlib.pyplot as plt
x = np.linspace(0, 10, 100)
plt.plot(x, np.sin(x))
plt.show()
```
````

CodeMirror 6で編集し、Runで同一オリジンのJupyterLite 0.8.6の公開されたアプリケーションと `serviceManager.kernels.startNew` / `requestExecute` APIを使用します。Pythonエンジンはjupyterlite-pyodide-kernelです。配布ファイルの書き換えは行いません。隠したJupyterLite treeアプリを初回Run時に読み込み、ページごとに1個のカーネルを作成します。セルは変数を共有し、実行は直列化します。ページを離れると環境は失われます。Resetはそのセルのコードと出力だけを戻し、カーネルの変数は消しません。

出力はiframe外のSphinx本文にPNG/SVGの画像またはテキストとして追加します。出力の固定高さ、縦スクロール、iframeの高さ通知は不要です。画像には `max-width:100%; height:auto` を適用し、画像読込と画面幅変更に応じてブラウザが本文の高さを計算します。再実行時に出力を置換し、Resetで出力領域が消えます。同一オリジンのURLを検証したうえで直接APIを使用するため、postMessage通信はありません。

[公式Replite仕様](https://jupyterlite-sphinx.readthedocs.io/en/latest/directives/replite.html)を確認し、標準 `{replite}` と `:kernel: python` / `:execute: False` はインストールしたjupyterlite-sphinx 0.23.0が対応しています。ただし標準Repliteは固定高さのコンソールで、本文に合わせる自動リサイズを提供しません。今回のUIには `{python-interactive}` を使用してください。標準の `/lite/` とインライン実行用 `/wiki/lite/` の静的配布物をビルド時に生成します。

初回実行には外部CDNからPyodideとパッケージを取得するためインターネット接続が必要です。`text/html` は記事とカーネルにアクセスできないsandbox（allow-scriptsのみ）で表示します。親は送信元・opaque origin・ランダムなトークンを検証して高さ通知を受け取ります。対話ウィジェット、実行の中断は未対応です。PNG/SVG、print、例外、text/plain（NumPy結果を含む）、複数Figure、clear_outputに対応します。

エディタソースを変更した場合は以下で配布用JSを再生成します。

```sh
node_modules/.bin/esbuild scripts/python-interactive.mjs --bundle --format=esm --minify --outfile=docs/_static/python-interactive.js
npm test -- tests/interactive.spec.ts
# 外部CDNを使う実行検証（通常CIからは分離）
JUPYTERLITE_LIVE=1 npm test -- tests/interactive.spec.ts
```

実行検証では通常・大きな・複数グラフ、再実行、Reset、例外、print、NumPy、モバイルを確認し、出力とエディタのscrollHeight/clientHeightを比較します。スクリーンショットは `test-results/inline-*.png` に保存します。

2026-10-09の検証結果：Sphinx警告をエラー扱いにしたビルド、別出力先への再ビルド、内部リンク検査、Pythonテスト2件が成功。ChromiumでJupyterLite実行テストを有効にした全体検証は5件成功、既存PyCafeの外部実行テスト1件は未実行です。通常・大きな・複数Figure、再実行、Reset、例外、print、NumPy、初回遅延読み込み、モバイル、縦スクロール不要の検査に成功しました。デスクトップ／モバイルのスクリーンショットも取得し、モバイルで2枚の図が縦に全体表示されることを目視確認しました。GitHub Pagesへの公開操作は行っていません。

## 追加のインライン実行記事とFuncAnimation

- `/wiki/python/numpy-interactive/`: 配列・内積・連立方程式。
- `/wiki/python/matplotlib-interactive/`: 波形の重ね描き・複数Axes。
- `/wiki/python/animation/`: `matplotlib.animation.FuncAnimation` の24フレームの正弦波。

アニメーションは `display(HTML(ani.to_jshtml(default_mode="loop")))` で出力します。`plt.show()` の静止画とは異なり、標準Matplotlibプレイヤーで再生・停止・フレーム選択ができます。フレーム生成はPythonのワーカーで行い、生成後の再生はブラウザ側で行います。FFmpegは不要です。フレーム数が多いと初期生成とメモリ使用量が増えます。

HTML出力は独立したsandboxでJavaScriptを実行します。CSPで外部スクリプトや通信を禁止し、Font Awesomeのスタイルとフォントだけを許可します。ResizeObserverが実際の内容の高さを測り、microtaskで通知をまとめ、画面外iframeの描画待ちで高さ更新が止まることを防ぎます。再実行・Reset時には古いプレイヤーとイベントリスナーを破棄します。HTML出力から記事・カーネルのDOMへはアクセスできません。

`JUPYTERLITE_LIVE=1 npm test -- tests/animation.spec.ts` は、実際のPythonで各記事を実行し、アニメーションの先頭と末尾の画像の違い、再生中のフレーム番号の変化、Pause後の停止、モバイルの高さ、再実行、Resetを検証します。スクリーンショットは `test-results/animation-*.png` に保存します。
