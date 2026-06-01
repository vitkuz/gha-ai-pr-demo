# gha-ai-pr-demo

A tiny demo showing how **GitHub Actions + the Claude Code Action** can write
code and open pull requests with **zero local editing**.

The seed is a minimal functional DynamoDB adapter (`@vitkuz/dynamo-demo-adapter`)
with a single `createOne` operation. Every new operation (`getOne`, `deleteOne`,
`patchOne`, ...) is added by the AI agent through a PR.

## How to drive it

### Prerequisite (one-time)

1. Add a repo secret `ANTHROPIC_API_KEY`
   (Settings → Secrets and variables → Actions → New repository secret),
   or: `gh secret set ANTHROPIC_API_KEY --repo vitkuz/gha-ai-pr-demo`.
2. Settings → Actions → General → enable
   **"Allow GitHub Actions to create and approve pull requests"**.

### Option A — tag `@claude` in an issue

Open a GitHub issue mentioning `@claude`, e.g.:

> @claude Please add a `getOne` operation mirroring `create-one.ts`, wire it
> into the adapter and barrel, and open a PR.

The `claude.yml` workflow runs, implements it, and opens a PR.

### Option B — manual button

Actions tab → **Claude Dispatch** → **Run workflow** → type a prompt, e.g.
`Add a deleteOne operation following CLAUDE.md and open a PR.`

## Local build (optional)

```bash
npm install
npm run build   # outputs dist/ (ESM + CJS + .d.ts) via tsup
```
