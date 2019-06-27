# ui-loading

## 学習内容
CodeGridの記事を元に、ローディング画面を作成
- https://app.codegrid.net/entry/2018-common-ui-4

ローディング画面におけるJavaScriptの基本的な考え方を学ぶ。

### ポイント
- progressbarロール（進行状況を示すロール）を使用して実装
- 進行状況の値
    - aria-valuemin：進行状況の最小値
    - aria-valuemax：進行状況の最大値
    - aria-valuenow：進行状況の現在値（進行度が変わるたびにJavaScriptから書き換え）
- `Document.createDocumentFragment()`を使用して、DOMへのappend回数を減らす

## 課題
- 画像のロード完了を判定する部分を、`Promise`、`async/await`で書き直してみる
- スクロール固定は色々な場面で出てくるので、機能を切り出して再利用しやすいようにしたい。