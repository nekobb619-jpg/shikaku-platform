# 宅建 統合ラボ

宅建士試験対策のケーススタディ型学習アプリ。法律用語を「コアイメージ」として
ビジュアル化し、分岐実験ラボで条件を動かしながら判断の分かれ目を体験できる。

## フォルダ構成

```
.
├── index.html          # エントリーポイント（このファイルを開く）
├── app.js              # 共通ロジック（画面遷移・進捗管理・装置レンダラー）
└── fields/
    ├── rights/         # 1. 権利関係（化学実験ラボ）
    │   ├── terms.js
    │   └── questions.js
    ├── gyoho/           # 2. 宅建業法（検査管制ラボ）
    │   ├── terms.js
    │   └── questions.js
    ├── houserei/        # 3. 法令上の制限（測量設計ラボ）
    │   ├── terms.js
    │   └── questions.js
    └── zeimu/           # 4. 税・その他（会計窓口ラボ）
        ├── terms.js
        └── questions.js
```

各 `terms.js` / `questions.js` は IIFE で囲まれ、`window.FIELDS.<分野名>.terms`
/ `.questions` に登録される。`index.html` は8ファイルすべてを読み込んだ後、
`app.js` を読み込んで起動する。

現在の収録数：権利関係33語・10問／宅建業法21語・10問／法令上の制限18語・10問／
税・その他12語・10問。

## GitHub Pages での公開

1. このリポジトリを GitHub に作成し、上記ファイル一式をルートに配置して push
2. **Settings → Pages**
   - Source: `Deploy from a branch`
   - Branch: `main` / `/ (root)`
   - Save
3. 数分後、`https://<username>.github.io/<repo>/` で公開される

`index.html` 内のスクリプト読み込みはすべて相対パス（`fields/rights/terms.js` 等）
なので、サブパス配信でもそのまま動作する。

## ローカルでの確認

`fetch`等は使っていないので、`index.html` をブラウザで直接開くだけで動く。
ただし一部ブラウザの設定によっては `file://` 経由のスクリプト読み込みが
制限される場合があるので、その際は簡易サーバーを立てて確認する。

```bash
python3 -m http.server 8000
# http://localhost:8000/ にアクセス
```

## 分野を追加する場合

1. `fields/<新分野キー>/terms.js` と `questions.js` を作成
   （既存ファイルの IIFE 構造をコピーして書き換える）
2. `index.html` の `<script>` 読み込みリストに2行追加
3. `app.js` の `FIELD_META` に分野のメタ情報を追加
4. `app.js` の `DEVICE_RENDERERS` に分野専用の `visual` レンダラー関数を追加
5. `app.js` の `FIELD_ORDER` 配列に分野キーを追加

## データ構造のメモ

- `terms.js`: 用語名をキーにした辞書。各エントリは `reading` / `plain`
  （やさしい翻訳）/ `core`（コアイメージ）/ `visual`（装置タイプ）/ `state` を持つ
- `questions.js`: ケース配列。各ケースは `caseText` 内の `[[用語]]` 記法で
  用語集と連動し、`branchLab`（レバーで条件を切り替えて結論の分岐を試せる
  サブ実験）を持つ

## 進捗データ

localStorage に分野ごと（`takkenlab_v2_<分野キー>`）で保存される。
正答率・ベストストリーク・用語集の既読状況を記録する。
