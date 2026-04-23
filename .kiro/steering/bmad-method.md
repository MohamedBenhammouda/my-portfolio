---
inclusion: always
---

# BMAD Method — Kiro Integration
> Breakthrough Method for Agile AI-Driven Development v6.3.0

## What is BMAD?

BMAD is a structured, role-based AI development framework. It organizes work into 4 phases with specialized agents, each with a defined role, responsibilities, and boundaries.

## The 4 Phases

| Phase | Name | Purpose |
|-------|------|---------|
| 1 | Analysis | Research, brainstorming, product brief, domain/market/technical research |
| 2 | Planning | PRD creation, UX design, requirements validation |
| 3 | Solutioning | Architecture, epics & stories, implementation readiness check |
| 4 | Implementation | Sprint planning, story creation, dev, code review, QA, retrospective |

## Planning Tracks

| Track | Best For | Documents |
|-------|----------|-----------|
| Quick Flow | Bug fixes, simple features (1–15 stories) | Tech-spec only |
| BMad Method | Products, platforms, complex features (10–50+ stories) | PRD + Architecture + UX |
| Enterprise | Compliance, multi-tenant (30+ stories) | PRD + Architecture + Security + DevOps |

## Output Folders

- `_bmad-output/planning-artifacts/` — PRD, architecture, epics, UX design, research
- `_bmad-output/implementation-artifacts/` — Sprint plan, stories, QA tests, retrospectives
- `docs/` — Project knowledge, documentation

## BMAD Configuration

- Config: `_bmad/_config/manifest.yaml`
- Agents: `_bmad/_config/agent-manifest.csv`
- Skills: `_bmad/_config/skill-manifest.csv`
- BMM Module: `_bmad/bmm/`
- Core Module: `_bmad/core/`

## Workflow Invocation

To invoke any BMAD workflow, reference it by skill name in chat:
- `bmad-help` — Get guidance on what to do next
- `bmad-document-project` — Document this brownfield project
- `bmad-generate-project-context` — Generate lean project-context.md
- `bmad-create-prd` — Create Product Requirements Document
- `bmad-create-architecture` — Create technical architecture
- `bmad-create-epics-and-stories` — Break PRD into epics and stories
- `bmad-sprint-planning` — Generate sprint plan
- `bmad-create-story` — Prepare next story for implementation
- `bmad-dev-story` — Implement a story
- `bmad-code-review` — Review implemented code
- `bmad-quick-dev` — Fast intent-to-code workflow (no full planning needed)

## Definition of Done

A story/feature is DONE when:
1. ✅ Meets Product Owner acceptance criteria
2. ✅ Respects architecture guidelines
3. ✅ Code is clean and tested
4. ✅ QA validated — no critical bugs
5. ✅ Ready for deployment
