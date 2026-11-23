# ふたりの旅ノート

夫婦2人で、旅行の予定・予約・やること・費用・比較・メモを共有するWebアプリです。スマホのホーム画面に追加して使えます。
最初の旅行はシンガポール（2027/6 D23 Asia）。国内・海外どちらの旅行にも使えます。

## できること

| タブ | 中身 |
| --- | --- |
| 概要 | 出発までの日数、未完了のやること、お金の合計、決まったこと |
| 旅程 | 日ごとの予定表。日付のある予約も自動で並びます |
| 予約 | 航空券・ホテル・チケットの予約番号、金額、支払い状況 |
| やること | 期限・担当つきのチェックリスト（期限切れは赤） |
| 費用 | 支出の記録と、どちらがいくら払えば精算できるか |
| 比較 | 航空券・ホテルなどの候補（カード／表）。「決定」にすると概要に出ます |
| メモ | 注意点・現地情報など（重要度つき） |

金額は現地通貨と目安の円（例：S$120（約1.5万円））で表示します。レートは旅行ごとに ⚙️ で設定します。
⚙️ からバックアップ（JSON）を保存でき、ホームの「JSONから取り込む」で戻せます。

## しくみ

| 場所 | 中身 |
| --- | --- |
| `docs/` | アプリ本体（GitHub Pages で公開）。ビルド不要 |
| `docs/config.js` | Firebase の設定。空（null）だと「お試しモード」（端末のブラウザだけに保存） |
| `docs/store.js` | データの保存（Firebase：Googleログイン＋Firestore、オフラインでも閲覧可） |
| `docs/seed-singapore.js` | シンガポール旅行の初期データ（`tools/make_seed_singapore.py` で比較CSVから生成） |
| `firestore.rules` | 2人だけが読み書きできるようにする Firestore のルール |

## 最初に一度だけ

1. **GitHub Pages**：Settings → Pages → Source「Deploy from a branch」、Branch `main`・フォルダ `/docs` → Save
2. **Firebase**：プロジェクトを作成 → Authentication で Google を有効化 → Firestore を作成（asia-northeast1）
3. Authentication → 設定 → 承認済みドメインに `<GitHubユーザー名>.github.io` を追加
4. `docs/config.js` に firebaseConfig を貼る
5. `firestore.rules` の2つのメールアドレスを書き換えて、Firestore →「ルール」に貼って公開
6. 2人ともアプリを開いて Google でログイン。旅行の ⚙️ →「共有するGoogleアカウント」に相手のメールを入れると共有されます
