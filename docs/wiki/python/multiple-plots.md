# 複数のグラフの描画

## Figureを分けて比較する

figureを呼ぶと新しい描画領域を作れます。複数のFigureは同じセルの出力欄に順番に表示されます。

$$
\cos^2 x + \sin^2 x = 1
$$

## 実行して確かめる

コードを編集して **Shift+Enter** を押してください。初回は実行環境のダウンロードに時間がかかります。

```{replite}
:kernel: python
:height: 450px
:execute: False

import numpy as np
import matplotlib.pyplot as plt
x = np.linspace(0, 2*np.pi, 100)
for fn in [np.sin, np.cos]:
    plt.figure(figsize=(5, 2))
    plt.plot(x, fn(x))
    plt.title(fn.__name__)
plt.show()
```

## 試してみよう

数値やパラメータを変更し、式が予測する結果と出力を比較してください。各実行セルはそれぞれのPythonカーネルで実行されます。
