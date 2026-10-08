import numpy as np
import matplotlib.pyplot as plt
import solara


@solara.component
def Page():
    x = np.linspace(0, 10, 100)
    fig, ax = plt.subplots()
    ax.plot(x, np.sin(x), label="sin")
    ax.plot(x, np.cos(x), label="cos")
    ax.legend()
    solara.FigureMatplotlib(fig)
    plt.close(fig)
