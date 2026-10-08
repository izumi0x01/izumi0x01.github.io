# RRTによる経路探索の基礎

## 探索木をランダムに伸ばす

RRTは空間から点をサンプリングし、最近傍ノードから少しずつ探索木を伸ばします。この例は円形障害物に対して線分の衝突判定を行います。乱数seedや刻み幅を変えて探索の違いを観察しましょう。最短経路は保証しません。

$$
q_{new}=q_{near}+\min(\epsilon,\|q_{rand}-q_{near}\|)\frac{q_{rand}-q_{near}}{\|q_{rand}-q_{near}\|}
$$

## 実行して確かめる

以下のPyCafeアプリで実行結果を確認できます。コードを編集するには **Edit on PyCafe** を開いてください。初回は実行環境のダウンロードに時間がかかります。

```{literalinclude} ../../../pycafe/rrt/app.py
:language: python
```

```{pycafe}
:source: rrt
:height: 500px
:title: RRTによる経路探索の基礎のPython実行例
```

## 試してみよう

数値やパラメータを変更し、式が予測する結果と出力を比較してください。各PyCafeアプリは独立した実行環境で動作します。
