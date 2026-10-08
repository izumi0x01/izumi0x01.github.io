# RRTによる経路探索の基礎

## 探索木をランダムに伸ばす

RRTは空間から点をサンプリングし、最近傍ノードから少しずつ探索木を伸ばします。この例は円形障害物に対して線分の衝突判定を行います。乱数seedや刻み幅を変えて探索の違いを観察しましょう。最短経路は保証しません。

$$
q_{new}=q_{near}+\min(\epsilon,\|q_{rand}-q_{near}\|)\frac{q_{rand}-q_{near}}{\|q_{rand}-q_{near}\|}
$$

## 実行して確かめる

コードを編集して **Shift+Enter** を押してください。初回は実行環境のダウンロードに時間がかかります。

```{replite}
:kernel: python
:height: 450px
:execute: False

import numpy as np
import matplotlib.pyplot as plt
rng = np.random.default_rng(7)
start, goal = np.array([0.05, 0.05]), np.array([0.95, 0.95])
nodes = [start]
edges = []
# 円形障害物と線分の距離で衝突を判定
center, radius = np.array([0.5, 0.5]), 0.18
def collision(a, b):
    delta = b - a
    t = np.clip(np.dot(center-a, delta) / np.dot(delta, delta), 0, 1)
    return np.linalg.norm(a + t*delta - center) <= radius
found = False
for _ in range(1000):
    sample = goal if rng.random() < 0.1 else rng.random(2)
    distances = [np.linalg.norm(p-sample) for p in nodes]
    i = int(np.argmin(distances))
    delta = sample - nodes[i]
    length = np.linalg.norm(delta)
    if length < 1e-10:
        continue
    new = nodes[i] + delta / length * min(0.07, length)
    if collision(nodes[i], new):
        continue
    edges.append((i, len(nodes)))
    nodes.append(new)
    if np.linalg.norm(new-goal) < 0.07 and not collision(new, goal):
        edges.append((len(nodes)-1, len(nodes)))
        nodes.append(goal)
        found = True
        break
fig, ax = plt.subplots()
for a, b in edges:
    ax.plot([nodes[a][0], nodes[b][0]], [nodes[a][1], nodes[b][1]], color="#b8cbb8", linewidth=.7)
if found:
    parents = {b:a for a,b in edges}
    current = len(nodes)-1
    path = [nodes[current]]
    while current != 0:
        current = parents[current]
        path.append(nodes[current])
    path = np.array(path)
    ax.plot(path[:,0], path[:,1], color="seagreen", linewidth=2)
ax.add_patch(plt.Circle(center, radius, color="gray", alpha=.4))
ax.scatter(*start, label="start")
ax.scatter(*goal, label="goal")
ax.set_aspect("equal")
ax.legend()
print("goal reached:", found, "nodes:", len(nodes))
plt.show()
```

## 試してみよう

数値やパラメータを変更し、式が予測する結果と出力を比較してください。各実行セルはそれぞれのPythonカーネルで実行されます。
