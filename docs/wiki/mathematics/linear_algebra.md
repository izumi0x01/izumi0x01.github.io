# 線形代数の基礎

## 固有値と固有ベクトル

行列による変換で方向が変わらないベクトルを固有ベクトルと呼びます。NumPyで固有値と残差を計算します。

$$
A\mathbf{v}=\lambda\mathbf{v}
$$

## 実行して確かめる

コードを編集して **Shift+Enter** を押してください。初回は実行環境のダウンロードに時間がかかります。

```{replite}
:kernel: python
:height: 450px
:execute: False

import numpy as np
A = np.array([[2., 1.], [1., 2.]])
values, vectors = np.linalg.eigh(A)
print("eigenvalues:", values)
print("residual:", np.linalg.norm(A @ vectors - vectors * values))
```

## 試してみよう

数値やパラメータを変更し、式が予測する結果と出力を比較してください。各実行セルはそれぞれのPythonカーネルで実行されます。
