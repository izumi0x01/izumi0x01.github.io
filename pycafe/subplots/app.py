import contextlib
import io
import solara


@solara.component
def Page():
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        import numpy as np
        import matplotlib.pyplot as plt
        x = np.linspace(0, 2*np.pi, 100)
        for fn in [np.sin, np.cos]:
            plt.figure(figsize=(5, 2))
            plt.plot(x, fn(x))
            plt.title(fn.__name__)
        solara.FigureMatplotlib(plt.gcf())
        plt.close(plt.gcf())
    if output.getvalue():
        solara.Text(output.getvalue())
