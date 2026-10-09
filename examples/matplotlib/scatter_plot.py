"""Animate the points of a rotating ellipse."""
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

angles = np.linspace(0, 2 * np.pi, 40, endpoint=False)
fig, ax = plt.subplots()
points = ax.scatter(np.cos(angles), 0.6 * np.sin(angles), c=angles, cmap='viridis')
ax.set(xlim=(-1.2, 1.2), ylim=(-1.2, 1.2), title='Rotating ellipse')
ax.set_aspect('equal')
ax.grid(True)

def update(frame):
    phase = frame * 0.1
    x = np.cos(angles)
    y = 0.6 * np.sin(angles)
    points.set_offsets(np.column_stack((x * np.cos(phase) - y * np.sin(phase),
                                        x * np.sin(phase) + y * np.cos(phase))))
    return points,

ani = FuncAnimation(fig, update, frames=60, interval=50, blit=True)
