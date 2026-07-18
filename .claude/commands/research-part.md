---
description: パーツの日英ソースを調査して data/parts/<part-id>.json を育てる
argument-hint: <part-id> (例: oil-pump-body)
---

# /research-part $ARGUMENTS

`$ARGUMENTS` で受け取ったパーツID (kebab-case) について、日英のソースを調査して `data/parts/$ARGUMENTS.json` を育てる。

## 手順

### 1. 既存JSONを読む(なければ雛形作成)
- `data/parts/$ARGUMENTS.json` が存在すればRead。無ければ `data/schema/part.schema.json` を参照して雛形を作る
- 既存の `variants` / `history_ja` / `failure_modes` / `links` を保持

### 2. WebSearch で日英ソースを収集
- 英語圏の主要ソース:
  - HDForums (`hdforums.com`)
  - Jockey Journal (`jockeyjournal.com`)
  - XLForum (`xlforum.net`)
  - Cycle Adventures Iberica / CAI blog
  - Wrench Wheels / Rider Files 系ブログ
- 日本語圏の主要ソース:
  - バージンハーレー (`virginharley.com`)
  - 個人ショップブログ (Google検索で "ショベル ${パーツ名}" 等)
- 各ソースにアクセスし、以下を抽出:
  - **年式変遷**: 何年に何が変わったか、OEM番号は何か
  - **故障傾向**: 「持病」「弱点」「よくある不具合」の記述
  - **入手性**: 純正・リプロ (S&S / V-Twin MFG / Bikers Choice等) の在庫状況

### 3. 情報を反映
- `variants[]`: OEM番号と年式範囲。`years` は `[start, end]` (1966..1984)、`oem_numbers` は `^[0-9A-Z][0-9A-Z\-]*$` の形式
- `history_ja`: 日本語要約。数段落。
- `failure_modes[]`: 各故障モードに:
  - `title_ja`, `years_affected`, `severity` (`low`/`medium`/`high`)
  - `summary_ja` (症状・原因・対策)
  - `sources[]` (**必ず1件以上、URL付き**、`accessed` は本日の日付 YYYY-MM-DD)
- `links[]`: 参考リンクを `type` (`forum`/`blog`/`catalog`/`manual`/`video`) で分類
- `parts_availability_ja`: リプロ/純正の入手性を日本語で
- 信頼度が低い項目には `"confidence": "low"` を残す (消さない)

### 4. スキーマ検証
```bash
npx --yes -p ajv-cli -p ajv-formats ajv validate \
  -s data/schema/part.schema.json \
  -d "data/parts/$ARGUMENTS.json" \
  --spec=draft2020 -c ajv-formats
```

### 5. 差分をユーザーに提示してからコミット
- `git diff data/parts/$ARGUMENTS.json` を見せる
- ユーザー承認後にコミット。メッセージ例:
  `feat(data): $ARGUMENTS の履歴と故障モード追加 (Phase X)`

## 絶対守ること (CLAUDE.md 参照)

- **出典URLのない事実は書かない**
- 転載しない。要約 + リンクのみ
- 著作権物 (マニュアルPDF、カタログ画像) をリポジトリに入れない
- 情報の正誤に自信がない場合は `confidence: low` で残す (消さない)
