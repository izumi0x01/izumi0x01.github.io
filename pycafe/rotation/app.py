import contextlib
import io
import solara


@solara.component
def Page():
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        import numpy as np
        import matplotlib.pyplot as plt
        theta = np.pi / 3
        R = np.array([[np.cos(theta), -np.sin(theta)], [np.sin(theta), np.cos(theta)]])
        p = np.array([1., 0.])
        q = R @ p
        print("rotated:", q)
        plt.plot([0, p[0]], [0, p[1]], label="original")
        plt.plot([0, q[0]], [0, q[1]], label="rotated")
        plt.axis("equal")
        plt.legend()
        solara.FigureMatplotlib(plt.gcf())
        plt.close(plt.gcf())
    if output.getvalue():
        solara.Text(output.getvalue())
