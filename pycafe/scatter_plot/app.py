import numpy as np
import matplotlib.pyplot as plt
import solara


@solara.component
def Page():
    x = np.arange(10)
    y = x ** 2
    fig, ax = plt.subplots()
    ax.scatter(x, y)
    solara.FigureMatplotlib(fig)
    plt.close(fig)
