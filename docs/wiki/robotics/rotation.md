# 二次元平面上の回転運動

## 回転行列

平面上の点を原点のまわりに回転させます。回転行列はベクトルの長さを保存します。角度thetaを変えて確かめてください。

$$
R(\theta)=\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}
$$

## 実行して確かめる

コードを編集して **Shift+Enter** を押してください。初回は実行環境のダウンロードに時間がかかります。

```{replite}
:kernel: python
:height: 450px
:execute: False

import numpy as np
import matplotlib.pyplot as plt
theta = np.pi / 3
R = np.array([[np.cos(theta), -np.sin(theta)], [np.sin(theta), np.cos(theta)]])
p = np.array([1., 0.])
q = R @ p
print("rotated:", q)
plt.plot([0, p[0]], [0, p[1]], label="original")
plt.plot([0, q[0]], [0, q[1]], label="rotated")
plt.axis("equal")
plt.legend()
plt.show()
```

## 試してみよう

数値やパラメータを変更し、式が予測する結果と出力を比較してください。各実行セルはそれぞれのPythonカーネルで実行されます。
