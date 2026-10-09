# Matplotlibでanimation

## 円運動を描いてみる
Funcanimationの構文の基本形は以下の通り.
updateの中で処理を書くようにしよう.

```{python-interactive}
import matplotlib.pyplot as plt
import matplotlib
import matplotlib.animation as animation
import numpy as np

fig, ax = plt.subplots()
frames = 200
theta = np.linspace(0, 2*np.pi, frames)
line, = ax.plot([], [], 'o')

ax.set_xlim(-1.2,1.2)
ax.set_ylim(-1.2,1.2)
ax.set_aspect('equal')

def init():
  line.set_data([], [])
  return line,

def update(i):
    x = np.cos(theta[i])
    y = np.sin(theta[i])
    line.set_data([x],[y])
    return line,

anim = animation.FuncAnimation(fig, update, frames=frames, init_func=init, blit=True)
from IPython.display import HTML
HTML(anim.to_jshtml())
```

## 円の軌跡を描いてみる
listでスライス:を指定すると,円の軌跡が描けるようになる

```{python-interactive}
import matplotlib.pyplot as plt
import matplotlib
import matplotlib.animation as animation
import numpy as np

fig, ax = plt.subplots()
frames = 200
theta = np.linspace(0, 2*np.pi, frames)
line, = ax.plot([], [], '-')

ax.set_xlim(-1.2,1.2)
ax.set_ylim(-1.2,1.2)
ax.set_aspect('equal')

def init():
  line.set_data([], [])
  return line,

def update(i):
    x = np.cos(theta[:i+1])
    y = np.sin(theta[:i+1])
    line.set_data(x,y)
    return line,

anim = animation.FuncAnimation(fig, update, frames=frames, init_func=init, blit=True)
from IPython.display import HTML
HTML(anim.to_jshtml())
```

