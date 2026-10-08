import contextlib
import io
import solara


@solara.component
def Page():
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        import numpy as np
        import matplotlib.pyplot as plt
        t1, t2 = np.pi/4, -np.pi/3
        l1, l2 = 1., .8
        p1 = l1 * np.array([np.cos(t1), np.sin(t1)])
        p2 = p1 + l2 * np.array([np.cos(t1+t2), np.sin(t1+t2)])
        print("end effector:", p2)
        plt.plot([0, p1[0], p2[0]], [0, p1[1], p2[1]], "o-", linewidth=3)
        plt.axis("equal")
        plt.grid(True)
        solara.FigureMatplotlib(plt.gcf())
        plt.close(plt.gcf())
    if output.getvalue():
        solara.Text(output.getvalue())
