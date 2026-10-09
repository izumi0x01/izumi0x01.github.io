# Matplotlibを編集して実行する

コード欄をクリックして書き換え、**Run ▶** を押すと、その下にグラフが表示されます。インストールは不要です。

## まず1つ描いてみる

そのまま **Run ▶** を押してから、`np.sin(x)` を `np.cos(x)` に変更して、もう一度実行してください。
`color="tab:blue"` を `color="tab:orange"` に変えると線の色も変わります。

```{python-interactive}
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2 * np.pi, 200)
plt.figure(figsize=(7, 4))
plt.plot(x, np.sin(x), color="tab:blue")
plt.grid(True)
plt.show()
```

初回はPythonとMatplotlibの読み込みに時間がかかります。準備状況はコード欄に表示されます。
同じページでの再実行では準備済みの環境を使います。**Reset** はその欄のコードを元に戻し、出力を消します。
ブラウザでの編集は記事には保存されません。ページを離れる前に、残したいコードをコピーしてください。

## 波形を重ねる

$$
y_1=\sin x,\qquad y_2=\cos x
$$

色・線の種類・標本数を変更して、波形を比較してください。

```{python-interactive}
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2 * np.pi, 200)
fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(x, np.sin(x), label="sin(x)")
ax.plot(x, np.cos(x), "--", label="cos(x)")
ax.set(xlabel="x", ylabel="y", title="Sine and cosine")
ax.grid(True, alpha=0.3)
ax.legend()
plt.show()
```

## 複数のAxesを並べる

1つのFigureに2つのAxesを配置します。`figsize` を変更すると表示の高さも変わります。

```{python-interactive}
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2 * np.pi, 200)
fig, axes = plt.subplots(2, 1, figsize=(7, 6), constrained_layout=True)
axes[0].plot(x, np.sin(x))
axes[0].set_title("sin(x)")
axes[1].plot(x, np.cos(x), color="tab:orange")
axes[1].set_title("cos(x)")
plt.show()
```

## うんちいいいいいいいいいいいいいいいいい

