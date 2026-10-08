import contextlib
import io
import solara


@solara.component
def Page():
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        for n in range(5):
            print(n, n ** 2)
    if output.getvalue():
        solara.Text(output.getvalue())
