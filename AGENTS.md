# AGENTS.md

Guidance for the AI agent (Pi, running on DeepSeek `deepseek-reasoner` / V4 thinking) in GitHub Actions.

## What this repo is

A functional, no-class **AWS adapters** package — `dynamodb`, `s3`, `sns`, `sqs`,
`lambda` — each under `src/<service>/`. New code should arrive via pull requests
opened by you (the AI agent), triggered from GitHub Issues/comments (`/pi ...`) or
the manual dispatch workflow.

## Layout (follow it)

Each service lives in `src/<service>/` with: `client.ts` (`create<Service>Client`),
`adapter.ts` (`createAdapter(config, logger?)`), `types.ts` (`Logger` +
`<Service>Context`), `operations/<verb-object>.ts` (one curried op per file), and
`index.ts` (barrel). The root `src/index.ts` re-exports each service as a namespace
(`export * as s3 from './s3'`). When adding an operation, mirror an existing one in
that service, wire it into that service's `adapter.ts`, and export it from that
service's `index.ts`. Do not edit `dist/`.

## Coding rules

- **No classes.** Use curried higher-order functions and plain objects.
- **Operation signature:** `(context: DynamoContext) => (input: Input) => Promise<Output>`.
  Mirror `src/operations/create-one.ts` exactly.
- **Explicit types** for non-primitives, parameters, and return values.
- **No file extensions in imports** (`moduleResolution: bundler`) — e.g. `from '../types'`.
- Always log operation start / success / error with `logger?.debug`.
- Keep `id === pk` for items; `pk` and `sk` are required keys.

## When adding a new operation

1. Create `src/operations/<verb-object>.ts` following the `create-one.ts` pattern.
2. Wire it into the adapter in `src/adapter.ts` (add to the returned object).
3. Re-export it from the barrel `src/index.ts`.
4. Make sure `npm run build` would succeed (valid TypeScript, correct imports).

## Pull request rules

- **Never push to `main`.** Always create a new branch, commit, and open a PR.
- Use a clear PR title and a short description of what the operation does.
