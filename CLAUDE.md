# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

VS Lens Mart is at the initial-setup stage. No application code, `package.json`, or build/test tooling exists yet, so there are no build, lint, or test commands. Update this file once the app is scaffolded.

## Intended stack (inferred from `.gitignore`)

- **Next.js** (Node) app
- **Playwright** for end-to-end tests
- **Netlify** for deployment

## Repository layout

- `docs/requirements/`: requirements documents. Read these before implementing features.
- `mockups/`: UI mockups that implementation should match.
- `tests/`: test suites (Playwright expected).
- `.claude/agents/`: project-specific Claude Code subagent definitions.

## Conventions

- Personal notes go in `CLAUDE.local.md` and local overrides in `.claude/settings.local.json`. Both are gitignored, so don't commit them.
- Secrets go in `.env` / `.env.*`, which are gitignored. Only `.env.example` is committed. Add new required variables there with placeholder values.
