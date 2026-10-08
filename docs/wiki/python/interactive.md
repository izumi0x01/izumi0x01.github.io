---
orphan: true
---

# インラインPythonとMatplotlib

コードを編集し、Runを押してください。初回はPythonとパッケージを取得します。
同じページのセルは変数を共有します。Resetはコードと出力を戻します。

## 通常のグラフ

```{python-interactive}
import numpy as np
import matplotlib.pyplot as plt
x = np.linspace(0, 10, 100)
plt.plot(x, np.sin(x))
plt.show()
```

## 大きなグラフ

```{python-interactive}
import numpy as np
import matplotlib.pyplot as plt
x = np.linspace(0, 10, 100)
plt.figure(figsize=(10, 6))
plt.plot(x, np.sin(x))
plt.show()
```

## 複数のグラフ

```{python-interactive}
import numpy as np
import matplotlib.pyplot as plt
x = np.linspace(0, 10, 100)
plt.figure()
plt.plot(x, np.sin(x))
plt.show()
plt.figure()
plt.plot(x, np.cos(x))
plt.show()
```

グラフの下に通常の記事本文が続きます。
