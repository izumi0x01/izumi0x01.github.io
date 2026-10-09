# Research HOME & Python Wiki

HOME（https://izumi0x01.github.io/）からWikiへ移動できます。
Matplotlibの記事は `/wiki/python/matplotlib-interactive/` に公開します。

## 記事の編集

HOMEは `docs/index.md`、Wikiの目次は `docs/wiki/index.md`、Pythonの記事は `docs/wiki/python/matplotlib-interactive.md` を編集してください。mainへのコミットで自動公開します。
`{python-interactive}` ブロック内のPythonコードが、ページ上の編集・実行欄になります。
ブラウザ上の編集は記事には保存されません。

## 公開

mainへのpushでGitHub ActionsがSphinxのHTMLとJupyterLiteの実行環境を生成し、GitHub Pagesへ公開します。テストは実行しません。

ローカルでプレビューする場合：

```sh
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
python3 scripts/build.py
python3 scripts/preview.py
```

http://localhost:4321/ で閲覧できます。

## エディタの更新

```sh
npm ci
npm run build:editor
```

生成された `docs/_static/python-interactive.js` もコミットしてください。記事だけの編集では不要です。
