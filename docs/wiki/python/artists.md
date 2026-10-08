# Artist・Axes・Figureの関係

## 描画オブジェクトの階層

Figureは図全体、Axesは座標系、Artistは線・文字などの描画要素です。オブジェクトを明示的に扱うと複雑な図でも管理しやすくなります。

$$
\mathrm{Figure}\supset\mathrm{Axes}\supset\mathrm{Artist}
$$

## 実行して確かめる

コードを編集して **Shift+Enter** を押してください。初回は実行環境のダウンロードに時間がかかります。

```{replite}
:kernel: python
:height: 450px
:execute: False

import matplotlib.pyplot as plt
fig, ax = plt.subplots()
line, = ax.plot([0, 1, 2], [0, 1, 4])
ax.set_title("Figure > Axes > Artist")
print(type(fig).__name__, type(ax).__name__, type(line).__name__)
plt.show()
```

## 試してみよう

数値やパラメータを変更し、式が予測する結果と出力を比較してください。各実行セルはそれぞれのPythonカーネルで実行されます。
