# Shovel-head Atlas

ショベルヘッドエンジン(1966–1984 ハーレーダビッドソン)のインタラクティブ図解 × 知識集約静的サイト。

エンジン図をクリックすると、そのパーツの **歴史(年式変遷)・故障傾向・パーツ情報(OEM番号、代替品、入手先)** が、日英の情報源を横断した **日本語要約 + 出典リンク** として読める。

- **公開URL**: https://miurasatoshimyu.github.io/Shovel-head-Atlas/
- **仕様書**: [SPEC.md](./SPEC.md)
- **Claude Code向け恒久指示**: [CLAUDE.md](./CLAUDE.md)

## ローカルで動かす

ビルド不要。静的サーバーで配信するだけ。

```bash
python3 -m http.server 8000
# → http://localhost:8000/
```

## 技術スタック

- 素の HTML + CSS + JS (フレームワーク・ビルド禁止)
- ES Modules
- JSON Schema (Draft 2020-12) でパーツデータ検証
- GitHub Pages 直配信

## Phase 進行状況

- [x] Phase 0: 足場 (リポジトリ初期化, JSON Schema, side-view SVGラフ, ダミー3パーツで動線確認)
- [ ] Phase 1: lubrication 系統を完成させる
- [ ] Phase 2: top-end / cam-drive
- [ ] Phase 3: bottom-end / carburetor / ignition
- [ ] Phase 4 以降: 車体系拡張、多言語UI、他機種テンプレート化

## パーツデータを追加する (Phase 1 以降)

```
/research-part <part-id>
```

Claude Code のスラッシュコマンドで、日英ソースを検索して `data/parts/<part-id>.json` を育てる。

## 貢献ルール

- 出典URLのない事実は書かない (詳細は [CLAUDE.md](./CLAUDE.md))
- 図は自作SVGのみ。転載禁止
- 著作権物(マニュアルPDF、カタログ画像)のバイナリをコミットしない

## License

[MIT](./LICENSE)
