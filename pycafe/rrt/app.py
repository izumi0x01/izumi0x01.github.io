import contextlib
import io
import solara


@solara.component
def Page():
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        import numpy as np
        import matplotlib.pyplot as plt
        rng = np.random.default_rng(7)
        start, goal = np.array([0.05, 0.05]), np.array([0.95, 0.95])
        nodes = [start]
        edges = []
        # 円形障害物と線分の距離で衝突を判定
        center, radius = np.array([0.5, 0.5]), 0.18
        def collision(a, b):
            delta = b - a
            t = np.clip(np.dot(center-a, delta) / np.dot(delta, delta), 0, 1)
            return np.linalg.norm(a + t*delta - center) <= radius
        found = False
        for _ in range(1000):
            sample = goal if rng.random() < 0.1 else rng.random(2)
            distances = [np.linalg.norm(p-sample) for p in nodes]
            i = int(np.argmin(distances))
            delta = sample - nodes[i]
            length = np.linalg.norm(delta)
            if length < 1e-10:
                continue
            new = nodes[i] + delta / length * min(0.07, length)
            if collision(nodes[i], new):
                continue
            edges.append((i, len(nodes)))
            nodes.append(new)
            if np.linalg.norm(new-goal) < 0.07 and not collision(new, goal):
                edges.append((len(nodes)-1, len(nodes)))
                nodes.append(goal)
                found = True
                break
        fig, ax = plt.subplots()
        for a, b in edges:
            ax.plot([nodes[a][0], nodes[b][0]], [nodes[a][1], nodes[b][1]], color="#b8cbb8", linewidth=.7)
        if found:
            parents = {b:a for a,b in edges}
            current = len(nodes)-1
            path = [nodes[current]]
            while current != 0:
                current = parents[current]
                path.append(nodes[current])
            path = np.array(path)
            ax.plot(path[:,0], path[:,1], color="seagreen", linewidth=2)
        ax.add_patch(plt.Circle(center, radius, color="gray", alpha=.4))
        ax.scatter(*start, label="start")
        ax.scatter(*goal, label="goal")
        ax.set_aspect("equal")
        ax.legend()
        print("goal reached:", found, "nodes:", len(nodes))
        solara.FigureMatplotlib(plt.gcf())
        plt.close(plt.gcf())
    if output.getvalue():
        solara.Text(output.getvalue())
