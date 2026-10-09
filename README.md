# Research HOME & Interactive Python Wiki

HOMEとWikiを単一のSphinxプロジェクト（`docs/`）から生成します。Wikiの記事は `python-interactive` を使う4ページに統一しています。

- `/wiki/python/interactive/`: 通常・大きな・複数のMatplotlib Figure
- `/wiki/python/numpy-interactive/`: 配列・内積・連立方程式
- `/wiki/python/matplotlib-interactive/`: 波形の重ね描き・複数Axes
- `/wiki/python/animation/`: FuncAnimationの生成・再生・停止

## ビルドと公開

```sh
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
python3 scripts/build.py
python3 scripts/check_links.py
python3 scripts/preview.py
```

http://localhost:4321/ でプレビューできます。mainへのpushでGitHub Actionsが検証し、GitHub Pagesへ公開します。公開ページは `/wiki/` 以下です。バックエンドサーバーは不要です。

HOMEは `docs/index.md`、Wikiは `docs/wiki/`、共通設定は `docs/conf.py` で管理します。各記事のEdit on GitHubから編集できます。

## 記事への埋め込み

````markdown
```{python-interactive}
import numpy as np
import matplotlib.pyplot as plt
x = np.linspace(0, 10, 100)
plt.plot(x, np.sin(x))
plt.show()
```
````

CodeMirrorで直接編集し、Runで実行します。JupyterLiteの公式 `serviceManager.kernels.startNew` / `requestExecute` APIとPyodideカーネルを使用します。実行エンジンの配布ファイルは変更しません。同一ページのセルは1個のカーネルを共有し、実行は直列化します。ページ移動で環境は新しくなります。Resetはそのセルのコード・出力・進捗表示だけを戻します。

## 読み込み時間と高速化

コードブロックにHTMLのprogress要素を組み込み、Runから完了までの経過秒数を表示します。準備は「JupyterLite読み込み」「Python環境の起動」「実行の準備」の3段階です。バーは完了した段階数を表示し、実行中は所要時間が不明なためindeterminate表示に切り替わります。ダウンロードのバイト数や架空のパーセントは表示しません。終了後は準備時間と実行時間を分けて表示します。待機中・エラー時にも経過時間が分かります。

Python環境はRunまで遅延読み込みします。NumPyだけのセルではMatplotlibを初期化しません。Matplotlibのimport、plt、FuncAnimationを使うセルでのみ `%matplotlib inline` を準備し、同一カーネルでは1回だけ行います。動的にライブラリ名を組み立ててimportする特殊なコードでは、必要に応じて `%matplotlib inline` をコードに明記してください。ページ内の再実行では準備済み環境を再利用します。エディタJSは圧縮して配布し、HOMEや目次では読み込みません。実行環境の配布物も `/wiki/lite/` の1か所に統一しています。

初回にはインターネット接続とPyodide・必要パッケージの取得が必要です。通信速度や端末性能によって時間は変わり、ページ間でPythonカーネルは共有しません。

## 出力とアニメーション

テキスト・例外・NumPy結果・PNG/SVG・複数Figureを本文のDOMに表示します。画像は最大幅100%で縦横比を保ち、出力に固定高さや独立した縦スクロールは設定しません。

FuncAnimationは `display(HTML(ani.to_jshtml(default_mode="loop")))` でブラウザのプレイヤーを出力します。Runでフレームを生成し、Playで再生します。Pause・フレーム選択・速度変更が使えます。FFmpegは不要です。フレーム数を増やすと生成時間とメモリ使用量が増えます。

HTML出力はallow-scriptsのみを許可したsandboxに隔離します。CSPで外部スクリプトや通信を禁止し、プレイヤー用のFont Awesomeのスタイル・フォントのみ許可します。出力から記事やカーネルのDOMへアクセスできません。ResizeObserverとmicrotaskで内容の高さを通知し、親は送信元、opaque origin、ランダムトークンを検証します。再実行・Reset時に古いプレイヤーとイベントリスナーを破棄します。実行の中断とJupyterの対話ウィジェットは未対応です。

## 検証とエディタの更新

```sh
npm ci
npm run build:editor
npm exec playwright install chromium
npm test
python3 -m unittest discover -s tests -p 'test_*.py'
# 実際のPython・Matplotlib・アニメーションを含む検証
JUPYTERLITE_LIVE=1 npm test
```

通常CIは外部CDNに依存する実行検証を分離し、初期表示・進捗表示・HOME・検索・目次を検証します。実行検証では各ページのPython、Matplotlibの遅延読み込み、再実行、エラー、出力の伸縮、FuncAnimationのフレーム変化・再生・停止・モバイル表示を確認します。スクリーンショットは `test-results/` に保存します。
