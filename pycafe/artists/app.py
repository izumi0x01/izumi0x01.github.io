import contextlib
import io
import solara


@solara.component
def Page():
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        import matplotlib.pyplot as plt
        fig, ax = plt.subplots()
        line, = ax.plot([0, 1, 2], [0, 1, 4])
        ax.set_title("Figure > Axes > Artist")
        print(type(fig).__name__, type(ax).__name__, type(line).__name__)
        solara.FigureMatplotlib(plt.gcf())
        plt.close(plt.gcf())
    if output.getvalue():
        solara.Text(output.getvalue())
