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
