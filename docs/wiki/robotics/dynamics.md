# ロボットの動力学

## 運動方程式

動力学は力と運動の関係を扱います。ここでは単純な減衰振動系をEuler法で近似します。刻み幅が大きいと誤差が増えるため注意してください。

$$
m\ddot{x}+c\dot{x}+kx=0
$$

## 実行して確かめる

コードを編集して **Shift+Enter** を押してください。初回は実行環境のダウンロードに時間がかかります。

```{replite}
:kernel: python
:height: 450px
:execute: False

import numpy as np
import matplotlib.pyplot as plt
dt = 0.01
t = np.arange(0, 10, dt)
x, v = 1., 0.
positions = []
for _ in t:
    v += (-0.3*v - x)*dt
    x += v*dt
    positions.append(x)
plt.plot(t, positions)
plt.xlabel("time")
plt.show()
```

## 試してみよう

数値やパラメータを変更し、式が予測する結果と出力を比較してください。各実行セルはそれぞれのPythonカーネルで実行されます。
