odexへの開発指示：Research Portfolio & Interactive Technical Wiki
n Wiki

## 1. 概要

GitHub Pages（`username.github.io`）で公開する、研究者の個人ホームページを作成してください。

サイトは以下の2ページ構成とします。

1. **HOME**：個人プロフィール・研究内容・研究業績をすべて掲載
2. **Wiki**：Sphinx + Read the Docs Themeによる技術ドキュメント

デザインは「Simple is Best」を最優先としてください。

独自の凝ったデザインや複雑なフレームワークは不要です。既存のGitHub Pages向け研究者テンプレートを参考に、シンプルで長期間メンテナンスできるサイトにしてください。

**最重要機能は、Wikiの文章中でPythonコードを編集・実行し、Matplotlibのグラフをページ内に表示できることです。**

## 2. 技術スタック

### HOME

- HTML / CSS
- 必要最小限のJavaScript
- GitHub Pages向けの軽量な研究者ホームページテンプレート

参考候補：

- academicpages/academicpages.github.io
- alshedivat/al-folio

これらを比較してください。ただし、テンプレートをそのまま導入して不要な機能や複雑な依存関係が増える場合は、シンプルなHTML/CSSで実装して構いません。

優先順位は、保守性、シンプルさ、読みやすさです。

### Wiki

以下を使用してください。

- Sphinx
- sphinx_rtd_theme
- MyST-Parser（Markdown対応）
- MathJax（LaTeX数式）
- Pyodide（Python実行）
- NumPy
- Matplotlib

必要に応じてCodeMirrorなどのコードエディタを利用してください。

Astro、Next.js、Reactなどは原則として使用しないでください。

## 3. 全体レイアウト

サイトの右上に表示するグローバルメニューは、以下の2項目のみです。

```text
                          HOME    Wiki
------------------------------------------------

            Page Content
```

- HOME：`/`
- Wiki：`/wiki/`

不要なメニューやリンクをヘッダーに追加しないでください。

HOMEでは右上のメニューを固定的に表示します。

WikiではSphinxの標準レイアウトを維持し、必要最小限の変更でHOMEとWikiを行き来できるようにしてください。

両ページのデザインを完全に一致させる必要はありません。

## 4. HOMEページ

HOMEは1ページ完結型にしてください。

About、Publications、Researchなどを別ページに分割しないでください。

以下を縦方向に配置してください。

### Profile

- 研究者の写真
- 氏名（英語・日本語）
- 所属大学
- 研究室
- 学位・所属課程
- 研究分野
- メールアドレス
- GitHub
- ORCID
- Google Scholar

研究者の写真はページ上部に表示します。

写真が未設定の場合は、シンプルなプレースホルダーを表示してください。

### Research Interests

研究分野と研究テーマについて簡潔に記述します。

### Research Projects

各研究について、タイトル、概要、画像、関連論文へのリンクを掲載できるようにしてください。

### Publications

研究業績を新しい順に並べてください。

以下の分類に対応してください。

- Journal Papers
- Conference Papers
- Domestic Conferences
- Other Publications

各業績には以下を表示してください。

- 著者
- 論文タイトル
- 会議名・雑誌名
- 発表年
- DOI（存在する場合）
- PDF（存在する場合）
- BibTeX（存在する場合）

BibTeXやYAMLなど、編集しやすいファイルから業績を管理できる設計が望ましいです。

### Education / Experience

- 学歴
- 研究歴
- 職歴（必要に応じて）

### Awards

受賞歴を掲載します。

### Contact

メールアドレスや研究者プロフィールへのリンクを掲載します。

### デザイン

- 白背景
- 黒・グレーを中心とした配色
- 研究者の写真を目立つ位置に表示
- 文字を読みやすくする
- アニメーション不要
- 不要な装飾は追加しない
- スマートフォン対応

サンプル情報は明確に仮データと分かるようにしてください。

## 5. Wikiページ

WikiにはSphinxを使用します。

テーマは必ず以下を使用してください。

```python
html_theme = "sphinx_rtd_theme"
```

デザインはRead the Docsの標準テーマを原則そのまま採用してください。

参考：

https://www.sphinx-doc.org/

https://github.com/readthedocs/sphinx_rtd_theme

### レイアウト

```text
┌───────────────────┬──────────────────────────────┐
│ Wiki              │ HOME    Wiki                  │
│                   ├──────────────────────────────┤
│ Search            │                              │
│                   │  Matplotlib Basics           │
│ Introduction      │                              │
│ Python            │  Explanation                 │
│   NumPy           │                              │
│   Matplotlib      │  Python Code                 │
│ Robotics          │                              │
│   Kinematics      │  [ Run ]  [ Reset ]           │
│   Dynamics        │                              │
│   RRT             │  Graph Output                │
│ Mathematics       │                              │
│                   │                              │
└───────────────────┴──────────────────────────────┘
```

### 必須機能

- 左側のサイドバー
- 階層的な目次
- サイト内検索
- 日本語・英語表示
- Markdown対応
- LaTeX数式
- コードのシンタックスハイライト
- 前後の記事へのナビゲーション
- HOMEに戻るリンク

Wiki全体の外観はSphinxの標準機能を活用し、独自CSSは必要最小限にしてください。

フッターには標準の以下の表記を残してください。

Built with Sphinx using a theme provided by Read the Docs.

## 6. Pythonのインライン実行

Wikiの最重要機能です。

ユーザーが説明文を読みながら、Pythonコードをその場で変更・実行できるようにしてください。

例：

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.plot(x, y)
plt.show()
```

このコードがWiki内に表示され、ユーザーがRunボタンを押すと、すぐ下にグラフが表示される仕組みを作成してください。

### 必須仕様

- Pythonコードを直接編集可能
- Runボタン
- Resetボタン
- 標準出力の表示
- エラー・例外の表示
- Matplotlibのグラフをセル直下に表示
- NumPyが使用可能
- 同一ページに複数の実行セルを配置可能
- 初回ロード時の進行状況表示
- スマートフォン対応

Python実行にはPyodideを使用してください。

**GitHub Pagesは静的サイトなので、Pythonコードは閲覧者のブラウザ内で実行してください。**

通常のPythonサーバーや有料APIは使用しないでください。

### 実装方針

まず、Sphinxと互換性のある既存の実行セル機能（Thebe、JupyterLiteなど）を調査してください。

ただし、外部Binderサーバーに依存する構成は採用しないでください。

JupyterLiteやThebeを採用する場合も、ブラウザ内Pythonカーネルで動作することを確認してください。

既存ライブラリの導入が複雑になる場合は、Pyodideと最小限のJavaScriptで専用コンポーネントを作成してください。

以下の点に注意してください。

- MatplotlibのSVGまたはPNG出力を表示する
- 再実行時に古いグラフを適切に消去する
- Python例外を画面内に表示する
- 複数セルの変数共有方式を明確化する
- Pyodideを必要以上に繰り返し初期化しない
- 実行中のUIフリーズを防ぐ
- 長時間実行するコードの停止・リセット方法を検討する
- 静的サイトの制約内で実装する

### Sphinx記事からの利用

`.md` または `.rst` ファイルの中に、簡単な記述で実行セルを埋め込めるようにしてください。

例えば、次のようなMarkdownディレクティブで記述できる方式が理想です。

````markdown
# Matplotlibの基本

正弦波を描画してみましょう。

```{python-run}
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 100)
plt.plot(x, np.sin(x))
plt.show()
```
````

`python-run` は目標とする独自ディレクティブ名です。必要に応じてSphinx拡張として実装してください。

Wikiの執筆者がJavaScriptやHTMLを書かずにPython実行セルを追加できるようにすることが重要です。

## 7. Wikiのサンプル記事

以下を作成してください。

```text
Wiki
├── Introduction
├── Python
│   ├── NumPy
│   ├── Matplotlib
│   └── Python Basics
├── Robotics
│   ├── Kinematics
│   ├── Dynamics
│   └── RRT
└── Mathematics
    └── Linear Algebra
```

記事本文は日本語とし、SphinxのMarkdown形式で管理してください。

Matplotlibの記事には、少なくとも以下の実行例を用意してください。

1. 正弦波の描画
2. 複数グラフの描画
3. 散布図の描画

数式とPythonの実行結果を同じページで確認できるようにしてください。

## 8. ファイル構造

推奨構成：

```text
username.github.io/
├── index.html
├── assets/
│   ├── css/
│   ├── images/
│   └── js/
├── data/
│   ├── profile.yml
│   ├── publications.bib
│   └── research.yml
├── wiki/
│   ├── conf.py
│   ├── index.md
│   ├── python/
│   │   ├── numpy.md
│   │   └── matplotlib.md
│   ├── robotics/
│   │   ├── kinematics.md
│   │   ├── dynamics.md
│   │   └── rrt.md
│   └── mathematics/
│       └── linear_algebra.md
├── requirements.txt
├── .github/
│   └── workflows/
│       └── deploy.yml
└── README.md
```

必要に応じて構造を変更して構いません。

ただし、GitHub Pagesで正しく公開できるよう、Sphinxのソースと生成されたHTMLの配置を区別してください。

HOMEのプロフィールや業績のデータファイルは、ビルド時にHTMLへ反映されるようにしてください。

## 9. デプロイ

GitHub Pagesで公開します。

GitHub Actionsを用いて次の処理を自動化してください。

1. リポジトリを取得
2. 必要なPython依存パッケージをインストール
3. SphinxのWikiをHTMLへビルド
4. HOMEとWikiの生成物を統合
5. GitHub Pagesにデプロイ

公開後の構成：

```text
https://username.github.io/
https://username.github.io/wiki/
```

GitHub Pagesでの公開に必要な設定をREADMEに記載してください。

## 10. テスト

必ず以下を確認してください。

- HOMEが表示される
- HOMEにプロフィールと業績が表示される
- 写真が表示される
- 右上のメニューがHOMEとWikiだけである
- WikiでRead the Docs Themeが適用される
- Sphinxの検索が動作する
- Markdown記事が表示される
- LaTeX数式が表示される
- Pythonコードを編集できる
- RunボタンでPythonが実行される
- NumPyが使用できる
- Matplotlibのグラフがセル直下に表示される
- Pythonエラーが表示される
- 複数セルを利用できる
- GitHub Pagesの公開パスで動作する

Pythonの動作については、可能な限りPlaywright等を使ったブラウザテストも実施してください。

## 11. 最重要方針

以下の優先順位を厳守してください。

1. シンプルな研究者ホームページ
2. HOMEにすべての個人情報・研究業績を集約
3. HOMEとWikiだけのナビゲーション
4. WikiはSphinx + Read the Docs Theme
5. Wiki内でPythonとMatplotlibを実行可能
6. GitHub Pagesで無料公開
7. 容易な更新と保守

見た目のために依存関係や複雑な構成を増やさないでください。

完成イメージではなく、実際にビルド・公開できるコードを作成してください。

既存リポジトリがある場合は、構造を確認し、既存ファイルを必要以上に削除しないでください。

未実装の機能を実装済みと報告しないでください。

## 1. プロジェクト概要

研究者個人のホームページと、インタラクティブな技術Wikiを統合したWebサイトを構築してください。

単なる静的なポートフォリオサイトではなく、研究業績の公開、研究内容の紹介、技術知識の蓄積、Pythonコードのブラウザ内実行を一つのサイトで実現することが目的です。

最終的にGitHub Pagesで無料公開することを想定しています。

**重要：設計案やモックアップだけで終わらず、実際に動くプロジェクトを作成してください。**

## 2. 技術スタック

以下を基本構成としてください。

- Astro：Webサイト全体のフレームワーク
- Starlight：技術WikiのドキュメントUI
- TypeScript：フロントエンドの実装
- MDX / Markdown：研究紹介・Wiki記事の管理
- Pyodide：ブラウザ内でのPython実行
- CodeMirror 6：Pythonコードエディタ
- Matplotlib / NumPy：Pythonによる数値計算とグラフ表示
- KaTeX：LaTeX数式表示
- GitHub Actions：ビルドと自動デプロイ
- GitHub Pages：ホスティング

原則として、サーバーサイドのPython実行環境は使用しないでください。

使用するライブラリについては、実装時点の最新の安定版と公式ドキュメントを確認してください。互換性に問題がある場合は、代替手段を検討してください。

## 3. サイト構成

以下のURL構造を基本とします。

```text
/
├── /about/
├── /research/
├── /publications/
├── /projects/
└── /wiki/
    ├── python/
    │   ├── basics/
    │   ├── numpy/
    │   └── matplotlib/
    ├── robotics/
    │   ├── kinematics/
    │   ├── dynamics/
    │   └── rrt/
    └── mathematics/
        └── linear-algebra/
```

### Home

研究者のプロフィールを紹介するトップページ。

掲載内容：

- 氏名、所属、研究分野
- 簡潔な自己紹介
- 主な研究テーマ
- 最近の研究成果
- Publicationsへのリンク
- Interactive Wikiへのリンク
- GitHubへのリンク

研究者として信頼感があり、長期運用できるデザインにしてください。

### About / CV

以下を掲載できるようにしてください。

- プロフィール
- 学歴・経歴
- 所属
- 専門分野
- スキル
- 受賞歴
- CVへのリンク
- 連絡先

情報はサンプルデータとして用意し、簡単に編集できる構造にしてください。架空の実績を実在する本人の情報として表示しないでください。

### Research

研究テーマを紹介するページです。

各研究について以下を掲載できるようにしてください。

- 研究タイトル
- 概要
- 写真
- 動画
- 使用技術
- 関連論文
- 関連するWiki記事
- GitHubリポジトリ

研究テーマを追加しやすいデータ構造を採用してください。

### Publications

研究業績を一覧表示するページです。

以下の機能を実装してください。

- 論文タイトル
- 著者
- 学会・ジャーナル名
- 発表年
- DOI
- PDFへのリンク
- BibTeXの表示・コピー
- 発表年によるグループ化
- 業績の種類によるフィルタリング

可能であればBibTeXファイルから論文情報を取得する方式にしてください。

論文情報を1か所で管理し、研究紹介ページにも再利用できる構造にしてください。

### Projects

研究で開発したソフトウェア、ハードウェア、オープンソースプロジェクトを紹介するページです。

プロジェクトカードには、画像、概要、使用技術、GitHubリンク、関連Wikiリンクを表示してください。

## 4. Interactive Wiki

このWebサイトの重要な機能です。

Wikipediaや技術ドキュメントのように、階層的な技術解説記事を掲載します。

Starlightを利用して以下を実装してください。

- 左側の階層的なサイドバー
- 記事検索
- Markdown / MDX対応
- LaTeX数式表示
- コードのシンタックスハイライト
- 記事内の見出しナビゲーション
- 前後の記事へのリンク
- ダークモード
- レスポンシブ表示

Wiki記事はMarkdown / MDXファイルを追加するだけで増やせるようにしてください。

Starlightを `/wiki/` 以下で運用し、通常のAstroページとデザイン・ナビゲーションを統一してください。

## 5. Pythonコードのインライン実行

**最優先で実装する機能です。**

Wikiの記事内にPythonコードエディタを直接埋め込み、閲覧者がその場でコードを編集・実行できる仕組みを実装してください。

例えば、記事の途中に次のコードを表示します。

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.plot(x, y)
plt.show()
```

閲覧者はコードを書き換え、Runボタンを押すことで、同じページ内にMatplotlibのグラフを表示できるようにします。

### 必須機能

1. Pythonコードの表示と編集
2. Runボタンによるコード実行
3. Matplotlibグラフのインライン表示
4. `print()` の標準出力表示
5. Python例外・エラーの表示
6. Resetボタンによる初期コードへの復元
7. Copyボタンによるコードのコピー
8. 実行中のローディング表示
9. 複数のPython実行セルを同じ記事内に配置可能
10. スマートフォンでも利用可能

### 技術的な要件

- Pyodideを使ってブラウザ内でPythonを実行する
- NumPyとMatplotlibを利用可能にする
- CodeMirror 6でエディタを実装する
- Pyodideの初期化は必要時に行う
- 初回ロード後はランタイムを可能な範囲で再利用する
- Python実行中にUIが固まらないようWeb Workerの利用を検討する
- セル間でPython変数を共有するかどうかを明確に設計する
- Matplotlibの描画結果が各セルの出力欄に正しく表示されるようにする
- 複数回実行した際に図や出力が意図せず蓄積しないようにする
- Pythonがブラウザ内で動作することを前提とし、外部サーバーに任意コードを送信しない
- Pyodideの実行制限、メモリ管理、同時実行や無限ループへの対策を検討する

### MDXからの利用方法

WikiのMarkdown / MDX内で、再利用可能なコンポーネントを使ってPython実行セルを埋め込めるようにしてください。

例えば以下のようなAPIを目標とします。

```mdx
import PythonRunner from '@components/PythonRunner';

# Matplotlibの基本

以下は正弦波を描画する例です。

<PythonRunner
  code={`import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 100)
plt.plot(x, np.sin(x))
plt.show()
`}
/>
```

上記は目標とする使用例です。AstroとMDXの仕様に合わせて、動作する形式に調整してください。

## 6. デザイン要件

全体のデザインは、シンプルで洗練された研究者向けWebサイトとしてください。

参考となる方向性：

- 大学研究者の個人ホームページ
- モダンな技術ドキュメント
- Jupyter Notebook
- GitHub Docs

以下を重視してください。

- 白・黒・グレーを基調とした落ち着いた配色
- 読みやすいタイポグラフィ
- 過剰なアニメーションを避ける
- 余白を適切に使う
- 数式とコードの可読性を優先
- ダークモード対応
- モバイル対応
- HomeとWikiのデザインの統一

Wikiはドキュメントとしての読みやすさを優先し、研究業績ページは一覧性を優先してください。

## 7. コンテンツ管理

サイトの更新が容易になるように設計してください。

- Wiki記事はMarkdown / MDXで管理
- 研究情報はMarkdownまたは構造化データで管理
- PublicationはBibTeXまたは構造化データで管理
- プロフィールは一つの設定ファイルから更新可能にする
- サイト全体のナビゲーションも設定ファイルで管理

研究内容や論文を追加するとき、ReactコンポーネントなどのUI実装を書き換えなくても済むようにしてください。

## 8. GitHub Pagesへのデプロイ

GitHub Actionsによる自動デプロイを実装してください。

要件：

- GitHubへのPushでビルド・デプロイ
- GitHub Pagesの公式Actionsを利用
- Astroの静的サイト出力を使用
- `username.github.io` 形式に対応
- 通常のリポジトリ配下のサブパス公開にも対応できる設計
- base pathやasset pathを正しく設定
- READMEに公開方法を明記

初期状態ではGitHub Pagesで公開できるようにしてください。

VercelやCloudflare Pagesへ移行しやすい構造を維持してください。

## 9. 実装するサンプル記事

サイトの機能を検証するため、以下の記事を実際に作成してください。

### Python / Matplotlib

- NumPy配列の基本
- Matplotlibによる正弦波の描画
- 複数のグラフの描画
- MatplotlibのArtist、Axes、Figureの関係

### Robotics

- 二次元平面上の回転運動
- ロボットの順運動学
- RRTによる経路探索の基礎

各記事には、説明文、数式、Pythonコード、実行可能な例を含めてください。

説明は日本語で作成してください。

## 10. 検証項目

実装後、以下を確認してください。

- Astroのビルドが成功する
- 各ページへのリンクが正常に動く
- Wikiの検索・サイドバーが動作する
- LaTeX数式が表示される
- Pythonコードをブラウザで実行できる
- NumPyによる計算が正しく実行される
- Matplotlibのグラフが表示される
- 複数セルの実行が動作する
- Pythonのエラーが正常に表示される
- PC・スマートフォンの表示が崩れない
- GitHub Pagesのbase pathで問題が発生しない

可能な限り自動テストも用意してください。

特にPython実行セルは、Playwright等によるブラウザテストで正常動作を確認してください。

## 11. 成果物

以下を作成してください。

1. 動作するAstroプロジェクト一式
2. Starlightによる技術Wiki
3. PyodideによるPython実行コンポーネント
4. Matplotlibの実行・描画機能
5. 研究業績表示ページ
6. サンプル研究紹介ページ
7. サンプル技術記事
8. GitHub Actionsのデプロイ設定
9. README.md
10. サイトの更新・管理方法の説明

## 12. 作業の進め方

まずリポジトリを確認し、既存の実装がある場合はそれを尊重してください。

次にプロジェクトの構成を決め、以下の順番で実装してください。

1. Astro + Starlightの基本環境構築
2. Home、About、Research、Publications、Projectsの作成
3. Wiki構造と記事ナビゲーションの実装
4. Pyodide + CodeMirrorによるPythonRunnerの実装
5. Matplotlib出力機能の実装
6. サンプル記事の追加
7. デザイン調整
8. GitHub Actionsによるデプロイ設定
9. ビルドとブラウザテスト
10. READMEの作成

不明な点は合理的なデフォルトを選び、実装を進めてください。

**最重要要件は、研究者の個人サイトとして公開できることと、閲覧者がWiki記事内でPythonコードを編集・実行し、Matplotlibの結果をその場で確認できることです。**

技術的な制約で実現できない部分がある場合は、動作しないダミー実装で代用せず、その制約と現実的な代替案を明示してください。

