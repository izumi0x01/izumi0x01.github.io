# ロボットの順運動学

## 2リンクアーム

関節角度から手先位置を求める計算が順運動学です。第2リンクの絶対角度は2つの関節角度の和になります。

$$
x=l_1\cos\theta_1+l_2\cos(\theta_1+\theta_2),\quad y=l_1\sin\theta_1+l_2\sin(\theta_1+\theta_2)
$$

## 実行して確かめる

コードを編集して **Shift+Enter** を押してください。初回は実行環境のダウンロードに時間がかかります。

```{replite}
:kernel: python
:height: 450px
:execute: False

import numpy as np
import matplotlib.pyplot as plt
t1, t2 = np.pi/4, -np.pi/3
l1, l2 = 1., .8
p1 = l1 * np.array([np.cos(t1), np.sin(t1)])
p2 = p1 + l2 * np.array([np.cos(t1+t2), np.sin(t1+t2)])
print("end effector:", p2)
plt.plot([0, p1[0], p2[0]], [0, p1[1], p2[1]], "o-", linewidth=3)
plt.axis("equal")
plt.grid(True)
plt.show()
```

## 試してみよう

数値やパラメータを変更し、式が予測する結果と出力を比較してください。各実行セルはそれぞれのPythonカーネルで実行されます。
