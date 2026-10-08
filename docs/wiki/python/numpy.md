# NumPy配列の基本

## 配列とベクトル演算

NumPyの配列は複数の数値をまとめて扱います。演算は要素ごとに適用され、内積はベクトル間の関係を表します。

$$
\mathbf{a}\cdot\mathbf{b}=\sum_i a_i b_i
$$

## 実行して確かめる

コードを編集して **Shift+Enter** を押してください。初回は実行環境のダウンロードに時間がかかります。

```{replite}
:kernel: python
:height: 450px
:execute: False

import numpy as np
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print("a² =", a ** 2)
print("内積 =", np.dot(a, b))
```

## 試してみよう

数値やパラメータを変更し、式が予測する結果と出力を比較してください。各実行セルはそれぞれのPythonカーネルで実行されます。
