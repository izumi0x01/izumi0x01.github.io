# ロボットの動力学

## 運動方程式

動力学は力と運動の関係を扱います。ここでは単純な減衰振動系をEuler法で近似します。刻み幅が大きいと誤差が増えるため注意してください。

$$
m\ddot{x}+c\dot{x}+kx=0
$$

## 実行して確かめる

以下のPyCafeアプリで実行結果を確認できます。コードを編集するには **Edit on PyCafe** を開いてください。初回は実行環境のダウンロードに時間がかかります。

```{literalinclude} ../../../pycafe/dynamics/app.py
:language: python
```

```{pycafe}
:source: dynamics
:height: 500px
:title: ロボットの動力学のPython実行例
```

## 試してみよう

数値やパラメータを変更し、式が予測する結果と出力を比較してください。各PyCafeアプリは独立した実行環境で動作します。
