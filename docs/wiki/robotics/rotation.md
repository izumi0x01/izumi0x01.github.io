# 二次元平面上の回転運動

## 回転行列

平面上の点を原点のまわりに回転させます。回転行列はベクトルの長さを保存します。角度thetaを変えて確かめてください。

$$
R(\theta)=\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}
$$

## 実行して確かめる

以下のPyCafeアプリで実行結果を確認できます。コードを編集するには **Edit on PyCafe** を開いてください。初回は実行環境のダウンロードに時間がかかります。

```{literalinclude} ../../../pycafe/rotation/app.py
:language: python
```

```{pycafe}
:source: rotation
:height: 500px
:title: 二次元平面上の回転運動のPython実行例
```

## 試してみよう

数値やパラメータを変更し、式が予測する結果と出力を比較してください。各PyCafeアプリは独立した実行環境で動作します。
