# Research Portfolio & Interactive Wiki

Astro / Starlightによる研究者サイトと、日本語の実行可能な技術Wikiです。要件原文は `readme.md` に保存しています。プロフィール・研究テーマ・論文は編集用サンプルです。架空の論文は明示しており、実在する本人の実績ではありません。

## 起動

Node.js 22.12以上（推奨22）を使用します。

```sh
npm ci
npm run dev
```

http://localhost:4321 を開いてください。

```sh
npm run check
npm run build
npm run preview
```

## 編集方法

- `src/data/site.ts`: プロフィール、連絡先、CV、ナビゲーション、研究テーマ、プロジェクト、論文。論文はIDで研究テーマと関連付け、単一の配列で管理します。DOI/PDFが未登録の場合はリンクを表示しません。BibTeX表示・コピー、年別表示、種類別フィルターに対応しています。
- `src/content/docs/wiki/`: 記事をMarkdown / MDXで追加するとページ・サイドバー・検索に反映されます。
- `public/`: 写真、動画、PDFなど。データのimageフィールドにファイル名、videoにURLを指定します。現在の画像は概念図です。
- `src/styles/global.css`: 共通の配色、レイアウト、モバイル表示。

Wikiで数式は `$...$` または `$$...$$` を使います。実行セルはMDXから以下のように利用できます。

```mdx
---
title: 実行例
---
import PythonRunner from '@components/PythonRunner.astro';

<PythonRunner code={`import numpy as np
print(np.arange(5))`} />
```

## Python実行の設計

CodeMirror 6で編集し、必要時にモジュール型Web Workerを起動します。Pyodide 314.0.7、NumPy、MatplotlibはjsDelivrから取得します。Pythonコードを実行サーバーに送信しません。初回読込には通信が必要で、数十MB以上のダウンロードが発生します。オフライン初回実行は対応していません。

ランタイムはページ内で共有しますが、セルのグローバル変数は毎回新しい辞書に分離します。インポートしたモジュール自体の状態は共有されるため、完全なセキュリティ分離ではありません。実行は直列です。標準出力・標準エラー・例外を捕捉し、MatplotlibのAggバックエンドからPNGを返します。show時と実行終了時に図を回収・閉鎖するため再実行で図が蓄積しません。

Stopと30秒タイムアウトはWorkerを終了し、次回に環境を再生成します。初期化の上限は180秒です。標準出力は100,000文字、図は12枚まで。メモリ使用量に厳密な上限を設ける仕組みはなく、大規模な配列や図はブラウザのメモリ不足を起こす可能性があります。ブラウザのネットワーク・ファイルアクセス制約が適用されます。

## GitHub Pages

1. このプロジェクトをGitHubにpushします（既定ブランチ `main`）。
2. リポジトリの Settings → Pages → Source を **GitHub Actions** に設定します。
3. `.github/workflows/deploy.yml` がcheck・build後に公式Pages Actionsで公開します。

`username.github.io` と通常リポジトリ配下のサブパスの双方に対応します。Actionsが公開先のorigin/base_pathを取得します。ローカルでサブパスを検証する場合:

```sh
BASE_PATH=/research SITE_URL=https://example.github.io npm run build
npm run preview
# http://localhost:4321/research/ を開く
```

他の静的ホスティングにも `dist/` を配置できます。`SITE_URL` と `BASE_PATH` を公開先に合わせてください。GitHub Pagesの公開状況はリポジトリのActionsとSettings → Pagesで確認できます。

## ブラウザテスト

```sh
npm exec playwright install chromium
npm run build
npm test
```

Playwrightで各ページ、業績フィルター、モバイル幅、KaTeX、実際のPyodide / NumPy / Matplotlib、複数セル、例外、Reset、再実行、Stop、Wiki検索を検証します。PythonテストではCDNへのアクセスが必要です。検索はビルド後のpreviewで検証してください。

## 公式ドキュメント

- [Astro](https://docs.astro.build/)
- [Starlightの導入・サブパス設定](https://starlight.astro.build/manual-setup/)
- [PyodideのWeb Worker](https://pyodide.org/en/stable/usage/webworker.html)
- [CodeMirror](https://codemirror.net/docs/)
