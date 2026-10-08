odex開発指示：Sphinx WikiへのPyCafeインライン埋め込み

## 1. 目的

既存のSphinx製研究者ホームページに、PyCafeによるPython実行環境を埋め込んでください。

現在の構成は以下のとおりです。

- Sphinx：サイト全体の構築
- sphinx_rtd_theme：Read the Docs形式のテーマ
- MyST-Parser：Markdown記事
- GitHub Pages：公開
- GitHub Actions：CI/CD

HOMEには研究者プロフィール、研究者の写真、研究内容、研究業績を掲載しています。

Wikiは `/wiki/` 以下に配置されています。

これらの既存機能は維持してください。

今回変更するのはPython実行環境のみです。

**JupyterLite-SphinxからPyCafeへ移行します。**

## 2. PyCafeの採用

PyCafe公式サイト：

https://py.cafe/

公式ドキュメント：

https://py.cafe/docs

PyCafeのiframe埋め込み機能を使用してください。

ブラウザ内のPython実行環境を自作しないでください。

### 重要な要件

- Wikiの本文中にPython実行環境を配置する
- 閲覧者がページから離れずにPythonを実行できる
- NumPyを利用できる
- Matplotlibのグラフを表示できる
- 複数の実行環境を記事内に設置できる
- GitHub Pagesで動作する
- Pythonバックエンドサーバーを自前で用意しない

可能であれば、ユーザーがコードを編集できるPyCafeの共有画面を埋め込んでください。

ただし、PyCafeがエディタ付き画面のiframe埋め込みを正式にサポートしていない場合は、アプリ埋め込みと「Edit on PyCafe」リンクを併用してください。

非公式のURLパラメータや未検証の埋め込み方式に依存しないでください。

## 3. Sphinxへの埋め込み方法

PyCafeのiframeをSphinxの記事中で利用できるようにしてください。

例えば、次の形式です。

```html
<iframe
  src="https://py.cafe/embed/USER/PROJECT"
  width="100%"
  height="500"
  style="border: 0;"
  loading="lazy"
  title="Interactive Python Example">
</iframe>
```

`USER/PROJECT` は実際のPyCafeプロジェクトの情報に置き換えてください。

上記URLは形式の例です。存在しないプロジェクトを動作確認済みとして扱わないでください。

実際のPyCafeプロジェクトのShare → Embedから取得できる公式iframeコードを優先してください。

## 4. Markdownから簡単に埋め込める仕組み

Sphinx Wikiの記事はMyST Markdownで執筆します。

毎回iframeのHTMLを直接記述するのは避けたいので、できれば専用のSphinxディレクティブを作成してください。

使用例：

````markdown
# Matplotlib

以下のPythonコードを実行してください。

```{pycafe}
:project: USER/PROJECT
:height: 500px
```
````

この `{pycafe}` ディレクティブは、必要に応じて小規模なSphinx拡張として実装してください。

要件：

- PyCafeのプロジェクト識別子を指定できる
- iframeの高さを変更できる
- iframeの幅は100%にする
- レスポンシブ表示
- アクセシビリティ用title属性
- 読み込みに失敗した場合のリンク表示
- Markdownで簡単に再利用可能
- プロジェクト識別子のバリデーション
- 不正なHTML属性やスクリプトを注入できない設計

過剰な機能や複雑な依存関係は追加しないでください。

## 5. サンプル記事

次のファイルを対象にしてください。

`docs/wiki/python/matplotlib.md`

記事中に、PyCafeで実行できるMatplotlibの例を追加してください。

### サンプル1：正弦波

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.plot(x, y)
plt.show()
```

### サンプル2：複数グラフ

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 100)

plt.plot(x, np.sin(x), label="sin")
plt.plot(x, np.cos(x), label="cos")

plt.legend()
plt.show()
```

### サンプル3：散布図

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.arange(10)
y = x ** 2

plt.scatter(x, y)
plt.show()
```

PyCafeが対応するWebアプリフレームワークを使用し、必要に応じてMatplotlibの描画結果をUI内で表示できる形式にしてください。

単純な `plt.show()` がPyCafeで期待どおりに描画されない場合は、使用するフレームワークに適した描画方法へ変更してください。

まず1つのサンプルで正常動作を確認してから、他のサンプルに展開してください。

## 6. PyCafeプロジェクトの管理

PyCafeのコードを外部サービスにのみ保存する方式では、後から管理しにくくなります。

可能であればGitHubリポジトリにもPyCafe用のソースコードを保存してください。

推奨構造：

```text
repository/
├── docs/
│   ├── conf.py
│   ├── index.md
│   ├── wiki/
│   │   └── python/
│   │       └── matplotlib.md
│   └── _ext/
│       └── pycafe.py
│
├── pycafe/
│   ├── sine_wave/
│   │   ├── app.py
│   │   └── requirements.txt
│   ├── multiple_plots/
│   │   ├── app.py
│   │   └── requirements.txt
│   └── scatter_plot/
│       ├── app.py
│       └── requirements.txt
│
├── requirements.txt
└── .github/
    └── workflows/
        └── deploy.yml
```

GitHub上のコードとPyCafe上のプロジェクトは自動同期されると決めつけないでください。

自動同期が公式にサポートされていない場合は、更新手順をREADMEに明記してください。

## 7. JupyterLite関連コードの整理

従来のJupyterLite-SphinxをPyCafeに置き換えます。

既存環境を調査し、利用しなくなった場合のみ以下を削除してください。

- jupyterlite-sphinx
- jupyterlite-core
- jupyterlite-pyodide-kernel
- Replite用の設定
- JupyterLite専用の不要なアセット

既存のWiki記事や研究者ホームページを削除しないでください。

## 8. HOMEの維持

HOMEは引き続きSphinxによって生成してください。

次の構成を維持してください。

- 研究者の写真
- Profile
- Research Interests
- Research Projects
- Publications
- Education
- Experience
- Awards
- Contact

右上のグローバルメニューはHOMEとWikiのみです。

デザインはシンプルにしてください。

PyCafe導入のためにHOMEのデザインを変更しないでください。

## 9. GitHub Pages・CI/CD

GitHub ActionsによるSphinxビルドとGitHub Pagesへの自動デプロイを維持してください。

PyCafeのiframeが `/wiki/` 以下でも正常に表示されるようにしてください。

Sphinxの静的HTMLビルドがPyCafeへの接続を必要としない構造にしてください。

外部iframeを利用するため、PyCafe側の公開状態やサービス障害によって埋め込みが利用できなくなる可能性も考慮してください。

## 10. 動作確認

以下を確認してください。

1. Sphinxビルドが成功する
2. HOMEの研究者情報が維持される
3. WikiのRead the Docs Themeが維持される
4. MyST MarkdownでPyCafeを埋め込める
5. iframeが正しいサイズで表示される
6. PyCafeプロジェクトが読み込まれる
7. Pythonコードを実行できる
8. Matplotlibグラフが表示される
9. エディタを利用できる場合はコード編集が動作する
10. モバイル画面でも利用可能
11. GitHub Pages上でも動作する

ブラウザで検証できない項目は、未検証であることを明記してください。

## 11. 実装上の最重要方針

- Sphinxを維持する
- Read the Docs Themeを維持する
- HOMEとWikiを同じSphinxプロジェクトで管理する
- JupyterLite-SphinxをPyCafeに置き換える
- PyCafeの公式iframe埋め込みを利用する
- Python実行環境を自作しない
- Markdownから簡単に埋め込めるようにする
- GitHub Pagesで無料公開できる構成を維持する

実装後は、変更ファイル、PyCafeの埋め込みURL、テスト結果、PyCafe側で必要な作業、残っている制約を報告してください。
