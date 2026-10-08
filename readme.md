odex開発指示：Sphinxによる研究者ホームページとInteractive Wikiの統合

## 1. 目的

研究者の個人ホームページと技術Wikiを、すべてSphinxで構築してください。

**HOMEとWikiで異なるWebフレームワークを使用しないでください。**

サイト全体を以下の技術で構成します。

- Sphinx
- sphinx_rtd_theme
- MyST-Parser
- jupyterlite-sphinx
- jupyterlite-pyodide-kernel
- NumPy / Matplotlib
- GitHub Pages
- GitHub Actions

研究者プロフィール・写真・研究内容・研究業績もSphinxで生成してください。

デザインはSimple is Bestを徹底し、Read the Docs Themeの標準デザインを最大限活用してください。

## 2. 既存リポジトリの確認

最初に現在のファイル構成を確認してください。

既存のSphinx設定、研究者情報、画像、Wiki記事、GitHub Actionsを確認し、再利用してください。

既存ファイルを不必要に削除しないでください。

現在のHOMEがHTMLや別のフレームワークで作成されている場合は、必要な情報を保持しながらSphinxに統合してください。

実在する研究業績、氏名、所属などを推測で生成しないでください。

## 3. サイト全体の構成

サイト内のページは論理的に以下の2種類だけにしてください。

- HOME
- Wiki

グローバルナビゲーションのメニューは、右上に `HOME` と `Wiki` の2項目だけ表示してください。

### HOME

URL：

`https://username.github.io/`

HOMEには、以下の情報を1ページに集約します。

1. Profile
2. Research Interests
3. Research Projects
4. Publications
5. Education
6. Experience
7. Awards
8. Contact

各セクションを別ページに分割しないでください。

HOMEの上部には研究者の写真、氏名、所属、研究分野を配置してください。

論文業績はJournal Papers、International Conferences、Domestic Conferencesなどの分類で掲載してください。

DOI、PDF、GitHub、Google Scholar、ORCIDなどへのリンクを設置できるようにしてください。

業績は新しい順に表示してください。

### Wiki

URL：

`https://username.github.io/wiki/`

Sphinxの標準的なドキュメントサイトとして構成してください。

- 左側に階層的なサイドバー
- 検索
- Markdown記事
- LaTeX数式
- Pythonコード
- Matplotlib実行結果

Wiki記事はMyST Markdownで管理してください。

## 4. デザイン

SphinxのRead the Docs Themeをすべてのページに適用してください。

```python
html_theme = "sphinx_rtd_theme"
```

HOMEについては、研究者の写真とプロフィールを見やすく配置するために必要な最小限のCSSを追加して構いません。

ただし、テーマ全体を大幅に変更しないでください。

- 白背景
- シンプルな文字と見出し
- 余計なアニメーションなし
- モバイル対応
- 読みやすい業績一覧
- 全ページでHOME / Wikiメニューを表示

右上のHOME / Wikiメニューは、Sphinxのテンプレート継承などを使い、全ページ共通のナビゲーションとして実装してください。

標準テーマの検索、サイドバー、モバイルナビゲーションを壊さないでください。

## 5. 研究者情報の管理

研究者の氏名、写真、所属、研究分野、経歴、研究成果、受賞歴をSphinxで表示してください。

基本的には `index.md` を編集するだけでHOMEの文章を更新できるようにしてください。

研究業績が増えても管理しやすいように、BibTeXまたはYAMLで業績データを分離することも検討してください。

ただし、複雑なCMSは導入しないでください。

HOMEはSphinxから生成される単一のHTMLページとしてください。

### 写真

研究者の写真は `_static/images/profile.jpg` などの位置で管理してください。

実際の写真が存在しない場合、他人の写真を勝手に使用しないでください。

## 6. Pythonを実行できるWiki

`jupyterlite-sphinx` を導入してください。

Pyodideを使用し、GitHub Pages上でPythonを実行できるようにします。

Pythonの実行環境にはサーバーを使用せず、閲覧者のブラウザ内で処理してください。

`requirements.txt` には互換性を確認した以下のパッケージを含めてください。

```text
sphinx
sphinx-rtd-theme
myst-parser
jupyterlite-sphinx
jupyterlite-core
jupyterlite-pyodide-kernel
```

### Sphinx設定

`conf.py` に以下を追加してください。

```python
extensions = [
    "myst_parser",
    "jupyterlite_sphinx",
]

html_theme = "sphinx_rtd_theme"
replite_auto_execute = False
```

既存の設定がある場合は統合してください。

### Python実行セル

Wiki記事内ではMyST Markdownの `replite` ディレクティブを使用してください。

例えば以下のコードを実行可能にしてください。

````markdown
# Matplotlibの基本

次のコードを編集して実行してください。

```{replite}
:kernel: python
:height: 450px
:execute: False

import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.plot(x, y)
plt.show()
```
````

実行セルについては以下を保証してください。

- コード編集
- Python実行
- 標準出力表示
- エラー表示
- NumPyの利用
- Matplotlibグラフのインライン表示
- 複数セルの設置
- 外部Pythonサーバー不要

独自のPythonエディタは開発せず、JupyterLite-Sphinxの標準機能を優先してください。

## 7. Wiki記事の構成

以下を初期コンテンツとして作成してください。

```text
wiki/
├── index.md
├── python/
│   ├── index.md
│   ├── numpy.md
│   └── matplotlib.md
├── robotics/
│   ├── index.md
│   ├── kinematics.md
│   ├── dynamics.md
│   └── rrt.md
└── mathematics/
    ├── index.md
    └── linear_algebra.md
```

記事の編集はMarkdownだけでできるようにしてください。

Matplotlibの記事には正弦波、複数グラフ、散布図の実行例を用意してください。

## 8. ディレクトリ構造

以下を基本構成としてください。

```text
repository/
├── docs/
│   ├── conf.py
│   ├── index.md
│   ├── wiki/
│   │   ├── index.md
│   │   ├── python/
│   │   ├── robotics/
│   │   └── mathematics/
│   ├── _static/
│   │   ├── images/
│   │   │   └── profile.jpg
│   │   └── custom.css
│   └── _templates/
├── requirements.txt
├── .github/
│   └── workflows/
│       └── deploy.yml
└── README.md
```

重要：HOMEとWikiは同一のSphinxプロジェクトとしてビルドしてください。

2つのSphinxプロジェクトに分割しないでください。

## 9. URL構造

公開URLは次の形式とします。

```text
/
└── index.html

/wiki/
└── index.html

/wiki/python/matplotlib/
└── index.html
```

Sphinxの `dirhtml` ビルダーを検討し、GitHub Pagesで上記URL構造を実現してください。

GitHub Pagesのルート公開と、必要に応じたサブパス公開の両方を考慮してください。

## 10. Wiki記事の編集方法

各Wiki記事に「Edit on GitHub」リンクを設けてください。

ブラウザからMarkdownを修正してCommitすると、GitHub Actionsによって自動更新されるようにしてください。

普段の更新ではローカルでのGit Pushを必要としない構成にしてください。

## 11. CI/CD

GitHub Actionsを使用してください。

Pull Request時：

- 依存関係のインストール
- Sphinxビルド
- リンクや構造の確認
- 必要なテスト

mainへのPush時：

- SphinxによるHOMEとWikiの一括ビルド
- JupyterLiteアセットの生成
- GitHub Pagesへの自動デプロイ

CIに失敗した場合はデプロイしないでください。

GitHub Pagesの公式Actionsを使用してください。

## 12. 動作確認

以下を検証してください。

### HOME

- SphinxからHOMEが生成される
- プロフィール写真が表示される
- 研究者情報が表示される
- 研究業績が表示される
- 右上にHOMEとWikiだけが表示される

### Wiki

- Read the Docs Themeが適用される
- サイドバーが表示される
- 検索が動作する
- MyST Markdownが表示される
- LaTeX数式が表示される

### Python実行

- JupyterLiteのPythonカーネルが起動する
- Pythonコードを編集・実行できる
- NumPyが動作する
- Matplotlibグラフが表示される
- Python例外が表示される

### GitHub Pages

- HOMEとWikiが正しいURLで公開される
- JavaScriptとWebAssemblyが読み込まれる
- ページの再読み込みで問題が発生しない

実ブラウザで可能な限り動作確認してください。

## 13. 開発方針

最も重視するのは保守の簡単さです。

- WebフレームワークはSphinxに統一する
- HOMEは単一のMarkdownページ
- Wikiは階層的なMarkdown記事
- Python実行はJupyterLite-Sphinx
- デザインはRead the Docs Theme
- 公開はGitHub Pages
- 更新はGitHub Actions

React、Astro、Next.js、独自CMSを追加しないでください。

機能を増やすより、シンプルで安定したサイトを完成させることを優先してください。

最後に、変更ファイル、ビルド結果、ブラウザテスト結果、未解決の問題を報告してください。
