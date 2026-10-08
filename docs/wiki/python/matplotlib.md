# Matplotlibによる正弦波の描画

## 正弦波を描く

linspaceで等間隔の標本を生成し、sin関数を評価します。スライダーで周波数を変えて描画の違いを観察してください。

$$
y=\sin(\omega x)
$$

## 実行して確かめる

以下のPyCafeアプリはNumPyで計算した結果をMatplotlibで描画します。
コードを編集する場合は **Edit on PyCafe** を開き、変更後に **Save all** を押し、プレビューを **refresh** してください。
初回はPython環境とパッケージの取得に時間がかかります。
各アプリは独立しており、変数を共有しません。

## 正弦波

```{literalinclude} ../../../pycafe/sine_wave/app.py
:language: python
```

```{pycafe}
:source: sine_wave
:height: 500px
:title: NumPyとMatplotlib：正弦波
```

## 複数グラフ

```{literalinclude} ../../../pycafe/multiple_plots/app.py
:language: python
```

```{pycafe}
:source: multiple_plots
:height: 500px
:title: NumPyとMatplotlib：複数グラフ
```

## 散布図

```{literalinclude} ../../../pycafe/scatter_plot/app.py
:language: python
```

```{pycafe}
:source: scatter_plot
:height: 500px
:title: NumPyとMatplotlib：散布図
```

## 試してみよう

標本数や周波数、散布図の式を変更し、予測した形と出力を比較してください。
PyCafeが利用できない場合も、記事中のソースをローカルのPython環境で実行できます。
