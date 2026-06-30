# Claude Code Instructions — gridu-design-system

> Part of the **gridu** ecosystem (`gridu` API · `gridu-web` app · `gridu-landing` · this repo).
> The canonical ecosystem policy lives in the `gridu` repo (`gridu/CLAUDE.md` and
> `.github/ai-governance.md`). This repo holds the shared design system (tokens, principles,
> and components) consumed by `gridu-web` and `gridu-landing`.

---

## 1. Commit Messages — Always Apply

Apply the **Conventional Commits** standard on every commit (see `gridu/CLAUDE.md` §1 for the
full type reference). Never add `Co-Authored-By` or AI/agent attribution lines. Never create a
commit unless explicitly requested.

## 2. Branch workflow — Always Apply

Work happens on `develop`; ship to `main` via Pull Request. Never commit or push to `main`
directly. Never force push. Never skip hooks with `--no-verify`.

## 3. Spec Kit workflow — Always Apply

This repo drives the **Product Identity Refresh** epic (tracked in
`gridu/docs/planning/epic-product-identity-refresh.md`). Phases 0 (foundations) and 1
(components) of that epic live here, numbered 00-12 to match the epic tracker. Each feature
follows: `/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` →
`/speckit-analyze` → `/speckit-implement`. Once Feature 02 (Design Principles) is implemented,
its output becomes this repo's `/speckit-constitution`.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/09-card-component/plan.md
<!-- SPECKIT END -->
