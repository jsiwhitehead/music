# Music

## What this repo is

Music is a TypeScript project for building and managing a local catalogue of music selections, then opening selected items directly in YouTube Music.

## Quickstart

```sh
bun install
bun run app
```

## Validation (run from repo root)

```sh
bun run typecheck
bun test
bun run format
```

## Repo map (at a glance)

- `src/`: TypeScript source files.
- `src/classical.txt`: classical library data.
- `src/general.txt`: general library data.
- `src/bahai.txt`: Baha'i library data.
- `static/index.html`: app entry HTML.
- `static/styles.css`: app styles.
- `docs/architecture.md`: canonical architecture and invariant contracts.
- `docs/library.md`: curation approach and library file format rules.

## Key docs

- `CONTRIBUTING.md`: contributor workflow and review expectations.
- `AGENTS.md`: coding-agent guardrails for safe, repo-consistent changes.
- `docs/architecture.md`: canonical architecture and invariant contracts.
- `docs/library.md`: curation approach and library file format rules.

## Common tasks (links-first)

- Understand system invariants: `docs/architecture.md`
- Check library format rules: `docs/library.md`
- Check contributor workflow: `CONTRIBUTING.md`
- Check agent guardrails: `AGENTS.md`
