# Matplotlibを編集して実行する

説明を読みながら、コードを編集し **Run ▶** で図を作成できます。
図は本文幅に合わせて表示されます。

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

図を時間とともに変える方法は [FuncAnimation](animation.md) で試せます。
[通常・大きな・複数Figureの検証例](interactive.md) も利用できます。
