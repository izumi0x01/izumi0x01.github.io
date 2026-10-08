import contextlib
import io
import solara


@solara.component
def Page():
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        import numpy as np
        a = np.array([1, 2, 3])
        b = np.array([4, 5, 6])
        print("a² =", a ** 2)
        print("内積 =", np.dot(a, b))
    if output.getvalue():
        solara.Text(output.getvalue())
