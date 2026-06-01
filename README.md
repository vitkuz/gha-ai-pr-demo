# gha-ai-pr-demo

A tiny demo showing how **GitHub Actions + the Pi coding agent (on DeepSeek V4 Pro)**
can write code and open pull requests with **zero local editing**.

The seed is a minimal functional DynamoDB adapter (`@vitkuz/dynamo-demo-adapter`)
with a single `createOne` operation. Every new operation (`getOne`, `deleteOne`,
`patchOne`, ...) is added by the AI agent through a PR.

Agent: [`shaftoe/pi-coding-agent-action`](https://github.com/shaftoe/pi-coding-agent-action)
wrapping the [Pi coding agent](https://github.com/earendil-works/pi), model
`deepseek-v4-pro` via the DeepSeek API.

## How to drive it

### Prerequisite (one-time)

1. Add a repo secret `DEEPSEEK_API_KEY`
   (Settings → Secrets and variables → Actions → New repository secret),
   or: `gh secret set DEEPSEEK_API_KEY --repo vitkuz/gha-ai-pr-demo`.
2. Settings → Actions → General → enable
   **"Allow GitHub Actions to create and approve pull requests"**.

### Option A — `/pi` in an issue or comment

Open a GitHub issue (or comment) starting with `/pi`, e.g.:

> /pi Please add a `getOne` operation mirroring `create-one.ts`, wire it into
> the adapter and barrel, and open a PR.

The `pi.yml` workflow runs, implements it, and opens a PR.

### Option B — manual button

Actions tab → **Pi Dispatch** → **Run workflow** → type a prompt, e.g.
`Add a deleteOne operation following AGENTS.md and open a PR.`

## Local build (optional)

```bash
npm install
npm run build   # outputs dist/ (ESM + CJS + .d.ts) via tsup
```
