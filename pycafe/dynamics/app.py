import contextlib
import io
import solara


@solara.component
def Page():
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        import numpy as np
        import matplotlib.pyplot as plt
        dt = 0.01
        t = np.arange(0, 10, dt)
        x, v = 1., 0.
        positions = []
        for _ in t:
            v += (-0.3*v - x)*dt
            x += v*dt
            positions.append(x)
        plt.plot(t, positions)
        plt.xlabel("time")
        solara.FigureMatplotlib(plt.gcf())
        plt.close(plt.gcf())
    if output.getvalue():
        solara.Text(output.getvalue())
