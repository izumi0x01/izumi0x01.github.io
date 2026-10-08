import numpy as np
import matplotlib.pyplot as plt
import solara


@solara.component
def Page():
    frequency, set_frequency = solara.use_state(1.0)
    solara.SliderFloat('周波数', value=frequency, on_value=set_frequency,
                       min=0.1, max=3.0, step=0.1)
    x = np.linspace(0, 10, 100)
    y = np.sin(frequency * x)
    fig, ax = plt.subplots()
    ax.plot(x, y)
    solara.FigureMatplotlib(fig)
    plt.close(fig)
