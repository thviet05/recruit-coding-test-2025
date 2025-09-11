# Coding Test 2025

- Fork して小さなコミットで開発し、PR を作成してください。
- Node 20 / pnpm 推奨。DevContainer は任意です。
- CI は `typecheck`/`lint`/`test`/`docker build` を実行します。

# ディレクトリ構成

```
repo/
  ├─ .github/workflows/ci.yml
  ├─ .devcontainer/devcontainer.json
  ├─ Dockerfile # Q2 の docker build 確認用（CI で build のみ）
  ├─ package.json
  ├─ pnpm-lock.yaml
  ├─ tsconfig.json
  ├─ vitest.config.ts
  ├─ .eslintrc.json
  ├─ .prettierrc
  ├─ README.md
  └─ src/
  ├─ q1/
  │ ├─ README.md
  │ ├─ cli.ts
  │ ├─ solve.ts
  │ └─ solve.spec.ts
  └─ q2/
  ├─ README.md
  ├─ main.ts
  ├─ core.ts
  ├─ core.spec.ts
  └─ sample.csv
```

## Q1: 映画館の券売機（CLI）

- 入力: 標準入力の複数行。出力: 標準出力。
- 実行: `pnpm q1:run`
- 仕様詳細は `src/q1/README.md` を参照。

## Q2: アクセスログ集計 & Docker

- CLI 実行: `pnpm q2:run --file=src/q2/sample.csv --from=2025-01-01 --to=2025-01-31 --tz=jst --top=3`
- 仕様詳細は `src/q2/README.md` を参照。

## テスト

- `pnpm test` で公開テストが実行されます（初期は一部 `it.skip`）。
