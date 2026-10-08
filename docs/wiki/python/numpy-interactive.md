# NumPyを編集して実行する

NumPyの配列を使って計算します。コードを編集して **Run ▶** を押してください。
初回はPython環境を読み込みます。Resetで元のコードと空の出力に戻せます。

## 配列とベクトル演算

要素ごとの計算と内積を比較します。配列の値を変えてみてください。

```{python-interactive}
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print("a + b =", a + b)
print("a * b =", a * b)
print("a · b =", np.dot(a, b))
print("mean(a) =", np.mean(a))
```

## 連立一次方程式

$$
2x + y = 5,\qquad x + 3y = 7
$$

`np.linalg.solve` で解を計算し、元の式に代入して確かめます。

```{python-interactive}
import numpy as np

A = np.array([[2., 1.], [1., 3.]])
b = np.array([5., 7.])
x = np.linalg.solve(A, b)
print("solution =", x)
print("A @ x =", A @ x)
print("verified =", np.allclose(A @ x, b))
```

同じページのセルは変数を共有します。ページを移動するとPython環境は新しくなります。
次は [Matplotlibによる可視化](matplotlib-interactive.md) を試してください。
