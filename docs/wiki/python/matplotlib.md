# Matplotlibによる正弦波の描画

## 正弦波を描く

linspaceで等間隔の標本を生成し、sin関数を評価します。標本数や周波数を変えて描画の違いを観察してください。

$$
y=\sin(\omega x)
$$

## 実行して確かめる

コードを編集して **Shift+Enter** を押してください。初回は実行環境のダウンロードに時間がかかります。

```{replite}
:kernel: python
:height: 450px
:execute: False

import numpy as np
import matplotlib.pyplot as plt
x = np.linspace(0, 10, 100)
y = np.sin(x)
plt.plot(x, y, color="seagreen")
plt.xlabel("x")
plt.ylabel("sin(x)")
plt.grid(True)
print("samples:", len(x))
plt.show()
```

## 試してみよう

数値やパラメータを変更し、式が予測する結果と出力を比較してください。各実行セルはそれぞれのPythonカーネルで実行されます。

## 独立した2つ目のセル

別の埋め込み実行セルとは変数を共有しません。

```{replite}
:kernel: python
:height: 450px
:execute: False

print(2 + 3)
```

## 複数グラフ

```{replite}
:kernel: python
:height: 450px
:execute: False

import numpy as np
import matplotlib.pyplot as plt
x = np.linspace(0, 10, 100)
fig, axes = plt.subplots(2, 1)
axes[0].plot(x, np.sin(x))
axes[1].plot(x, np.cos(x))
fig.tight_layout()
plt.show()
```

## 散布図

```{replite}
:kernel: python
:height: 450px
:execute: False

import numpy as np
import matplotlib.pyplot as plt
rng = np.random.default_rng(42)
x = rng.normal(size=100)
y = 2*x + rng.normal(size=100)
plt.scatter(x, y)
plt.xlabel('x')
plt.ylabel('y')
plt.show()
```
