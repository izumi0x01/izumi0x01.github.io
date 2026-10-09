
# 斜方投射の数値シミュレーション

## 運動方程式

空気抵抗を無視し、質量 $m$ の物体を初速度 $v_0$、投射角 $\theta$ で投げ上げる運動を考える。

水平方向を $x$ 軸、鉛直上向きを $y$ 軸とすると、ニュートンの運動方程式は、

$$
\begin{aligned}
m\ddot{x} &= 0 \\
m\ddot{y} &= -mg
\end{aligned}
$$

となる。ここで、$g$ は重力加速度である。

## 状態方程式

数値積分を行うため、位置と速度からなる状態ベクトルを定義する。

$$
\boldsymbol{q} =
\begin{bmatrix}
x & y & v_x & v_y
\end{bmatrix}^{\mathsf T}
$$

ここで、$v_x=\dot{x}$、$v_y=\dot{y}$ である。

運動方程式を一階の微分方程式に変換すると、

$$
\boxed{
\dot{\boldsymbol{q}}
=
f(\boldsymbol{q})
=
\begin{bmatrix}
v_x \\
v_y \\
0 \\
-g
\end{bmatrix}
}
$$

となる。

初期位置を原点とすると、初期状態は、

$$
\boldsymbol{q}_0 =
\begin{bmatrix}
0 \\
0 \\
v_0\cos\theta \\
v_0\sin\theta
\end{bmatrix}
$$

で与えられる。

## 4次のルンゲ＝クッタ法（RK4）

状態方程式 $\dot{\boldsymbol{q}}=f(\boldsymbol{q})$ を、時間刻み $\Delta t$ で数値積分する。

RK4では、各ステップで4つの傾きを計算する。

$$
\begin{aligned}
k_1 &= f(\boldsymbol{q}_n) \\
k_2 &= f\left(\boldsymbol{q}_n+\frac{\Delta t}{2}k_1\right) \\
k_3 &= f\left(\boldsymbol{q}_n+\frac{\Delta t}{2}k_2\right) \\
k_4 &= f\left(\boldsymbol{q}_n+\Delta t\,k_3\right)
\end{aligned}
$$

これらを用いて、次の状態を計算する。

$$
\boxed{
\boldsymbol{q}_{n+1}
=
\boldsymbol{q}_n
+
\frac{\Delta t}{6}
(k_1+2k_2+2k_3+k_4)
}
$$

## 飛距離と最高到達点

物体が投射位置と同じ高さに戻るまでの時間 $T$、飛距離 $R$、最高到達点 $H$ は、それぞれ次式で与えられる。

$$
\begin{aligned}
T &= \frac{2v_0\sin\theta}{g} \\[6pt]
R &= \frac{v_0^2\sin 2\theta}{g} \\[6pt]
H &= \frac{v_0^2\sin^2\theta}{2g}
\end{aligned}
$$

これらを用いて、シミュレーション時間とグラフの表示範囲を設定する。

## Pythonによる数値積分とアニメーション

SymPyで状態方程式を定義し、`lambdify` によってNumPyで評価可能な関数へ変換する。

RK4で各時刻の状態を計算し、得られた位置をMatplotlibの `FuncAnimation` で表示する。

```python
import matplotlib.pyplot as plt
import matplotlib.animation as animation
import numpy as np
import sympy as sp
from IPython.display import HTML

# パラメータ
frames = 200
v = 20
rad = np.deg2rad(45)
g = 9.8

tmax = 2 * v * np.sin(rad) / g
tarray = np.linspace(0, tmax, frames)
dt = tarray[1] - tarray[0]

# SymPyによる運動方程式の定義
x, y, vx, vy = sp.symbols('x y vx vy')
gravity = sp.symbols('g')

q = sp.Matrix([x, y, vx, vy])
dq = sp.Matrix([vx, vy, 0, -gravity])

f = sp.lambdify((q, gravity), dq, 'numpy')

# 初期状態 [x, y, vx, vy]
q0 = np.array([
    0,
    0,
    v * np.cos(rad),
    v * np.sin(rad)
], dtype=float)

# 4次のルンゲ＝クッタ法
def rk4(q, dt):
    k1 = f(q, g).flatten()
    k2 = f(q + dt*k1/2, g).flatten()
    k3 = f(q + dt*k2/2, g).flatten()
    k4 = f(q + dt*k3, g).flatten()

    return q + dt*(k1 + 2*k2 + 2*k3 + k4)/6

# 数値積分
trajectory = np.zeros((frames, 4))
trajectory[0] = q0

for i in range(frames - 1):
    trajectory[i + 1] = rk4(trajectory[i], dt)

# 描画
fig, ax = plt.subplots(figsize=(12, 4))
line, = ax.plot([], [], lw=2, color='red', marker='o')

xmax = v * np.cos(rad) * tmax
ymax = v**2 * np.sin(rad)**2 / (2*g)

ax.set_xlim(-1, xmax + 1)
ax.set_ylim(-1, ymax + 1)
ax.axhline(0, color='black')

def init():
    line.set_data([], [])
    return line,

def update(i):
    line.set_data(
        [trajectory[i, 0]],
        [trajectory[i, 1]]
    )
    return line,

anim = animation.FuncAnimation(
    fig,
    update,
    frames=frames,
    init_func=init,
    interval=50,
    blit=True
)

plt.close(fig)

HTML(anim.to_jshtml())
```

## 解析解との比較

空気抵抗を無視した斜方投射では、位置の解析解は、

$$
\begin{aligned}
x(t) &= v_0\cos\theta\,t \\
y(t) &= v_0\sin\theta\,t-\frac{1}{2}gt^2
\end{aligned}
$$

となる。

今回の運動方程式は加速度が一定であるため、RK4による数値積分結果は、浮動小数点の丸め誤差を除いて解析解と一致する。

一方、空気抵抗などを導入すると運動方程式が複雑になるため、数値積分による解法が有効となる。
