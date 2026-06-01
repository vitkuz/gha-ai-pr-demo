# AGENTS.md

Guidance for the AI agent (Pi, running on DeepSeek `deepseek-reasoner` / V4 thinking) in GitHub Actions.

## What this repo is

A minimal, functional **DynamoDB adapter** npm package. It is the seed for a
demo: all new code should arrive via pull requests opened by you (the AI agent),
triggered from GitHub Issues/comments (`/pi ...`) or the manual dispatch workflow.

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
