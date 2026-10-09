"""Two axes sharing one animation clock."""
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

x = np.linspace(0, 2 * np.pi, 200)
fig, axes = plt.subplots(2, 1, figsize=(6, 5), constrained_layout=True)
lines = [axis.plot([], [], lw=2)[0] for axis in axes]
for axis, title in zip(axes, ('Sine', 'Cosine')):
    axis.set(xlim=(0, 2 * np.pi), ylim=(-1.2, 1.2), title=title)
    axis.grid(True)

def update(frame):
    phase = frame * 0.1
    lines[0].set_data(x, np.sin(x + phase))
    lines[1].set_data(x, np.cos(x + phase))
    return tuple(lines)

ani = FuncAnimation(fig, update, frames=60, interval=50, blit=True)
