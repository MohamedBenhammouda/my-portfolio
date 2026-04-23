---
inclusion: always
---

# BMAD Scrum Process — Rules & Ceremonies

## Core Rules

1. **Role boundaries are strict.** No agent takes over another's responsibilities.
2. **No implementation without a story.** Every code change traces to a story in the sprint plan.
3. **No story without acceptance criteria.** Every story must have numbered, testable ACs.
4. **Definition of Done is non-negotiable.** A story is not done until all 5 DoD criteria are met.
5. **PO owns WHAT. Architect owns HOW. Dev owns BUILD. QA owns VALIDATE.**

## Sprint Ceremonies

### Sprint Planning
- Input: Epics & Stories + Readiness Report
- Output: `sprint-plan.md` with sequenced stories, estimates, and status
- Run: `bmad-sprint-planning`

### Daily Standup (when requested)
Format per agent:
- ✅ What did I complete?
- 🔄 What am I working on?
- 🚧 Any blockers?

### Sprint Review
- Demo completed stories against acceptance criteria
- PO confirms acceptance or raises issues

### Retrospective
- Run: `bmad-retrospective`
- Output: lessons learned, process improvements

## Story Lifecycle

```
BACKLOG → NEXT → IN PROGRESS → REVIEW → DONE
```

Status tracking in `sprint-plan.md`:
- `[ ]` — backlog
- `[>]` — next (ready to start)
- `[~]` — in progress
- `[r]` — in review
- `[x]` — done
- `[!]` — blocked

## Story Format

Every story file must contain:

```markdown
# Story [E#-S#]: [Title]

## Status: [backlog|next|in-progress|review|done]

## User Story
As a [user type], I want [action] so that [benefit].

## Acceptance Criteria
1. AC1: [specific, testable criterion]
2. AC2: [specific, testable criterion]
3. AC3: [specific, testable criterion]

## Technical Notes
- Files to modify: [list]
- Dependencies: [list]
- Architecture reference: [section]

## Test Requirements
- Unit tests: [what to test]
- Integration tests: [what to test]
```

## Escalation Path

| Situation | Action |
|-----------|--------|
| Requirement unclear | PO clarifies → update story |
| Technical blocker | Architect proposes solution → update architecture notes |
| Scope creep discovered | Scrum Master flags → `bmad-correct-course` |
| Critical bug found | QA raises → new story or hotfix story |
| Architecture conflict | Architect + Dev align → document ADR |

## Sprint Plan Format

```markdown
# Sprint Plan — [Project Name]

## Sprint Goal
[One sentence describing what this sprint delivers]

## Stories

### Epic 1: [Epic Name]
| ID | Story | Points | Status | Owner |
|----|-------|--------|--------|-------|
| E1-S1 | [title] | 3 | [x] done | Amelia |
| E1-S2 | [title] | 5 | [~] in progress | Amelia |
| E1-S3 | [title] | 2 | [>] next | - |

## Velocity
- Completed: X points
- In Progress: X points
- Remaining: X points
```
