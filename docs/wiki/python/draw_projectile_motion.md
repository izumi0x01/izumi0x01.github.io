# 斜方投射

空気抵抗を無視し、初速度 $v_0$、投射角 $\theta$ で物体を投げ上げる。
$x$ 軸を水平方向、$y$ 軸を鉛直上向きとすると、ニュートンの運動方程式は、

$$
\begin{aligned}
m\ddot{x} &= 0 \\
m\ddot{y} &= -mg
\end{aligned}
$$

となる。したがって、加速度は $a_x=0$、$a_y=-g$ である。

初期位置を $(0,0)$ とすると、時刻 $t$ における位置は、

$$
\begin{aligned}
x(t) &= v_0\cos\theta\,t \\
y(t) &= v_0\sin\theta\,t-\frac{1}{2}gt^2
\end{aligned}
$$

で表される。

## 飛距離と最高到達点

物体が投射位置と同じ高さに戻るまでの時間 $T$ は、

$$
T = \frac{2v_0\sin\theta}{g}
$$

水平方向の飛距離（横幅）$R$ は、

$$
R = v_0\cos\theta\,T
  = \frac{v_0^2\sin 2\theta}{g}
$$

最高到達点の高さ（縦幅）$H$ は、

$$
H = \frac{v_0^2\sin^2\theta}{2g}
$$

となる。


```{python-interactive}
import matplotlib.pyplot as plt
import matplotlib.animation as animation
import numpy as np
from IPython.display import HTML

fig, ax = plt.subplots(figsize=(12, 4))

line, = ax.plot([], [], lw=2, color='red', marker='o')
frames = 200

v = 20
rad = np.deg2rad(45)
g = 9.8

tmax = 2 * v * np.sin(rad) / g
tarray = np.linspace(0, tmax, frames)
xmax = v * np.cos(rad) * tmax
ymax = 0.5 * v**2 * np.sin(rad)**2 / g

ax.set_xlim(-1, xmax + 1)
ax.set_ylim(-1, ymax + 1)
ax.axhline(0, color='black')

def init():
    line.set_data([], [])
    return line,

def update(i):
    x = v * np.cos(rad) * tarray[i]
    y = -0.5 * g * tarray[i]**2 + v * np.sin(rad) * tarray[i]

    line.set_data([x], [y])
    return line,

anim = animation.FuncAnimation(
    fig,
    update,
    frames=frames,
    init_func=init,
    interval=50,
    blit=True
)

plt.close(fig)  # 静止画像の自動表示を抑制

HTML(anim.to_jshtml())
```
