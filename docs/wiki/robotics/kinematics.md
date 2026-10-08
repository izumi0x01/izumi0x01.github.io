# ロボットの順運動学

## 2リンクアーム

関節角度から手先位置を求める計算が順運動学です。第2リンクの絶対角度は2つの関節角度の和になります。

$$
x=l_1\cos\theta_1+l_2\cos(\theta_1+\theta_2),\quad y=l_1\sin\theta_1+l_2\sin(\theta_1+\theta_2)
$$

## 実行して確かめる

以下のPyCafeアプリで実行結果を確認できます。コードを編集するには **Edit on PyCafe** を開いてください。初回は実行環境のダウンロードに時間がかかります。

```{literalinclude} ../../../pycafe/kinematics/app.py
:language: python
```

```{pycafe}
:source: kinematics
:height: 500px
:title: ロボットの順運動学のPython実行例
```

## 試してみよう

数値やパラメータを変更し、式が予測する結果と出力を比較してください。各PyCafeアプリは独立した実行環境で動作します。
