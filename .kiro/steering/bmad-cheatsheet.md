---
inclusion: manual
---

# BMAD Quick Reference Cheatsheet

## Invoke an Agent
| Say | Agent | Role |
|-----|-------|------|
| "talk to Mary" | 📊 Mary | Business Analyst |
| "talk to John" | 📋 John | Product Manager |
| "talk to Sally" | 🎨 Sally | UX Designer |
| "talk to Winston" | 🏗 Winston | Architect |
| "talk to Amelia" | 💻 Amelia | Developer |
| "talk to Paige" | 📚 Paige | Tech Writer |
| "act as scrum master" | 🧭 SM | Scrum Master |

## Run a Workflow
| Command | Code | Phase | Required? |
|---------|------|-------|-----------|
| `bmad-help` | BH | any | — |
| `bmad-document-project` | DP | 1 | — |
| `bmad-generate-project-context` | GPC | any | — |
| `bmad-product-brief` | CB | 1 | — |
| `bmad-prfaq` | WB | 1 | — |
| `bmad-domain-research` | DR | 1 | — |
| `bmad-market-research` | MR | 1 | — |
| `bmad-technical-research` | TR | 1 | — |
| `bmad-create-prd` | CP | 2 | ⭐ |
| `bmad-validate-prd` | VP | 2 | — |
| `bmad-edit-prd` | EP | 2 | — |
| `bmad-create-ux-design` | CU | 2 | — |
| `bmad-create-architecture` | CA | 3 | ⭐ |
| `bmad-create-epics-and-stories` | CE | 3 | ⭐ |
| `bmad-check-implementation-readiness` | IR | 3 | ⭐ |
| `bmad-sprint-planning` | SP | 4 | ⭐ |
| `bmad-create-story` | CS | 4 | ⭐ |
| `bmad-dev-story` | DS | 4 | ⭐ |
| `bmad-code-review` | CR | 4 | — |
| `bmad-quick-dev` | QQ | any | — |
| `bmad-sprint-status` | SS | 4 | — |
| `bmad-retrospective` | ER | 4 | — |
| `bmad-correct-course` | CC | any | — |
| `bmad-checkpoint-preview` | CK | any | — |
| `bmad-brainstorming` | BSP | any | — |
| `bmad-party-mode` | PM | any | — |

## Recommended Flow (This Project)

Since this is a **brownfield project** (code already exists):

```
1. bmad-document-project       → docs/ (understand what exists)
2. bmad-generate-project-context → _bmad-output/project-context.md
3. bmad-create-prd             → _bmad-output/planning-artifacts/prd.md
4. bmad-create-ux-design       → _bmad-output/planning-artifacts/ux-design.md
5. bmad-create-architecture    → _bmad-output/planning-artifacts/architecture.md
6. bmad-create-epics-and-stories → _bmad-output/planning-artifacts/epics-and-stories.md
7. bmad-check-implementation-readiness → readiness-report.md
8. bmad-sprint-planning        → _bmad-output/implementation-artifacts/sprint-plan.md
9. bmad-create-story           → stories/[id].md
10. bmad-dev-story             → implement
11. bmad-code-review           → validate
12. repeat 9-11 until epic done
13. bmad-retrospective         → lessons learned
```

## Output Locations
| Artifact | Location |
|----------|----------|
| PRD | `_bmad-output/planning-artifacts/prd.md` |
| Architecture | `_bmad-output/planning-artifacts/architecture.md` |
| UX Design | `_bmad-output/planning-artifacts/ux-design.md` |
| Epics & Stories | `_bmad-output/planning-artifacts/epics-and-stories.md` |
| Readiness Report | `_bmad-output/planning-artifacts/readiness-report.md` |
| Sprint Plan | `_bmad-output/implementation-artifacts/sprint-plan.md` |
| Stories | `_bmad-output/implementation-artifacts/stories/` |
| Project Context | `_bmad-output/project-context.md` |
| Docs | `docs/` |

## Story Status Symbols
| Symbol | Meaning |
|--------|---------|
| `[ ]` | backlog |
| `[>]` | next — ready to start |
| `[~]` | in progress |
| `[r]` | in review |
| `[x]` | done |
| `[!]` | blocked |

## Definition of Done
1. ✅ Meets PO acceptance criteria
2. ✅ Respects architecture guidelines
3. ✅ Code is clean and tested
4. ✅ QA validated — no critical bugs
5. ✅ Ready for deployment
