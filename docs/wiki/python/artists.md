# Artist・Axes・Figureの関係

## 描画オブジェクトの階層

Figureは図全体、Axesは座標系、Artistは線・文字などの描画要素です。オブジェクトを明示的に扱うと複雑な図でも管理しやすくなります。

$$
\mathrm{Figure}\supset\mathrm{Axes}\supset\mathrm{Artist}
$$

## 実行して確かめる

以下のPyCafeアプリで実行結果を確認できます。コードを編集するには **Edit on PyCafe** を開いてください。初回は実行環境のダウンロードに時間がかかります。

```{literalinclude} ../../../pycafe/artists/app.py
:language: python
```

```{pycafe}
:source: artists
:height: 500px
:title: Artist・Axes・Figureの関係のPython実行例
```

## 試してみよう

数値やパラメータを変更し、式が予測する結果と出力を比較してください。各PyCafeアプリは独立した実行環境で動作します。
