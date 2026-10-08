import contextlib
import io
import solara


@solara.component
def Page():
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        import numpy as np
        A = np.array([[2., 1.], [1., 2.]])
        values, vectors = np.linalg.eigh(A)
        print("eigenvalues:", values)
        print("residual:", np.linalg.norm(A @ vectors - vectors * values))
    if output.getvalue():
        solara.Text(output.getvalue())
