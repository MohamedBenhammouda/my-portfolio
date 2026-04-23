---
inclusion: always
---

# BMAD Workflows — Step-by-Step Execution Guide

When a workflow is invoked, follow these steps precisely. Each workflow has a defined input, process, and output.

---

## Phase 1 — Analysis

### `bmad-document-project` (DP)
**When:** Brownfield project — code exists, needs documentation  
**Steps:**
1. Scan project structure: files, folders, tech stack, entry points
2. Identify: architecture pattern, key components, data flow
3. Produce in `docs/`:
   - `project-overview.md` — purpose, stack, structure
   - `source-tree.md` — annotated file tree
   - `architecture.md` — system design summary
4. Ask user if deep-dive on any module is needed

### `bmad-generate-project-context` (GPC)
**When:** Need a lean LLM-optimized context file for implementation agents  
**Steps:**
1. Scan codebase for: stack, patterns, conventions, key files
2. Generate `_bmad-output/project-context.md` with:
   - Tech stack summary
   - File structure overview
   - Coding conventions
   - Key architectural decisions
   - Do/Don't patterns

### `bmad-product-brief` (CB)
**When:** User has a clear product idea and wants to nail it down  
**Steps:**
1. Ask guided questions: What is it? Who is it for? What problem does it solve?
2. Identify: value proposition, target users, key features, constraints
3. Draft brief → review with user → finalize
4. Save to `_bmad-output/planning-artifacts/product-brief.md`

### `bmad-prfaq` (WB)
**When:** User wants to stress-test a product concept (Working Backwards)  
**Steps:**
1. Write a mock Press Release for the product
2. Write Customer FAQ (external)
3. Write Internal FAQ (team concerns)
4. Run adversarial review — challenge assumptions
5. Save to `_bmad-output/planning-artifacts/prfaq.md`

### `bmad-domain-research` (DR)
**Steps:** Industry analysis → competitive landscape → regulatory focus → technical trends → synthesis  
**Output:** `_bmad-output/planning-artifacts/domain-research.md`

### `bmad-market-research` (MR)
**Steps:** Market sizing → customer behavior → pain points → customer decisions → competitive analysis → synthesis  
**Output:** `_bmad-output/planning-artifacts/market-research.md`

### `bmad-technical-research` (TR)
**Steps:** Technical overview → integration patterns → architectural patterns → implementation research → synthesis  
**Output:** `_bmad-output/planning-artifacts/technical-research.md`

---

## Phase 2 — Planning

### `bmad-create-prd` (CP) ⭐ Required
**When:** Ready to formalize product requirements  
**Steps:**
1. Init — confirm project type and planning track
2. Discovery — elicit goals, users, constraints via interview
3. Vision — define product vision and success metrics
4. Executive summary
5. User journeys — map key flows
6. Domain analysis
7. Innovation opportunities
8. Project type classification
9. Functional requirements
10. Non-functional requirements
11. Polish and finalize
12. Save to `_bmad-output/planning-artifacts/prd.md`

### `bmad-validate-prd` (VP)
**Input:** `[path to PRD]`  
**Steps:** Format detection → density validation → parity check → report  
**Output:** `_bmad-output/planning-artifacts/prd-validation-report.md`

### `bmad-edit-prd` (EP)
**Input:** `[path to PRD]`  
**Steps:** Discovery → review → edit → complete  
**Output:** Updated PRD

### `bmad-create-ux-design` (CU)
**When:** UI is a primary part of the product  
**Steps:**
1. Init — review PRD
2. Discovery — user research, personas
3. Core experience — key screens and flows
4. Emotional response — tone, feel
5. Inspiration — reference patterns
6. Design system — colors, typography, spacing
7. Visual foundation
8. Design directions
9. User journeys — detailed flows
10. Component strategy
11. UX patterns
12. Responsive & accessibility
13. Complete
**Output:** `_bmad-output/planning-artifacts/ux-design.md`

---

## Phase 3 — Solutioning

### `bmad-create-architecture` (CA) ⭐ Required
**Steps:**
1. Init — review PRD and UX
2. Context — understand constraints and scale
3. Starter — propose initial architecture
4. Decisions — document key ADRs (Architecture Decision Records)
5. Patterns — define coding patterns and conventions
6. Structure — finalize folder/module structure
7. Validation — check against PRD requirements
8. Complete
**Output:** `_bmad-output/planning-artifacts/architecture.md`

### `bmad-create-epics-and-stories` (CE) ⭐ Required
**Input:** PRD + Architecture  
**Steps:**
1. Validate prerequisites — PRD and architecture exist
2. Design epics — group features into logical epics
3. Create stories — break each epic into user stories with:
   - Story ID (E1-S1 format)
   - Title
   - User story statement
   - Acceptance criteria (numbered)
   - Technical notes
   - Dependencies
4. Final validation — all PRD requirements covered
**Output:** `_bmad-output/planning-artifacts/epics-and-stories.md`

### `bmad-check-implementation-readiness` (IR) ⭐ Required
**Steps:**
1. Document discovery — locate PRD, UX, Architecture, Epics
2. PRD analysis — requirements complete?
3. Epic coverage validation — all requirements have stories?
4. UX alignment — stories match UX design?
5. Epic quality review — stories well-formed?
6. Final assessment — ready or not?
**Output:** `_bmad-output/planning-artifacts/readiness-report.md`

### `bmad-generate-project-context` (GPC)
**Steps:**
1. Discover — scan codebase
2. Generate — produce lean context file
3. Complete
**Output:** `_bmad-output/project-context.md`

---

## Phase 4 — Implementation

### `bmad-sprint-planning` (SP) ⭐ Required to start implementation
**Input:** Epics and stories file  
**Steps:**
1. Load epics and stories
2. Assign story points / complexity
3. Sequence stories by dependency
4. Generate sprint plan with status tracking
**Output:** `_bmad-output/implementation-artifacts/sprint-plan.md`

### `bmad-create-story` (CS)
**Steps:**
1. Find next story marked `next` in sprint plan
2. Gather all context: PRD section, architecture notes, UX specs, dependencies
3. Write detailed story file with:
   - Full acceptance criteria
   - Technical implementation notes
   - File paths to touch
   - Test requirements
4. Validate story completeness
**Output:** `_bmad-output/implementation-artifacts/stories/[story-id].md`

### `bmad-dev-story` (DS)
**Input:** Story file path  
**Steps:**
1. Read story file completely
2. Implement all tasks in order
3. Write tests for each task
4. Verify all acceptance criteria met
5. Mark story complete in sprint plan
6. Hand off to code review

### `bmad-code-review` (CR)
**Steps:**
1. Gather context — story, implementation, tests
2. Blind review — check correctness
3. Edge case review — boundary conditions
4. Acceptance audit — all ACs met?
5. Triage — categorize findings
6. Present — report with severity levels
7. If issues → back to `bmad-dev-story`; if approved → next story or retrospective

### `bmad-quick-dev` (QQ)
**When:** Simple task, no full planning needed  
**Steps:**
1. Clarify and route — understand intent
2. Plan — outline approach
3. Implement — write code
4. Review — self-review
5. Present — show result
**Output:** Working code + spec in `_bmad-output/implementation-artifacts/`

### `bmad-sprint-status` (SS)
**Steps:** Load sprint plan → summarize completed/in-progress/blocked → surface risks → recommend next action

### `bmad-retrospective` (ER)
**When:** End of epic  
**Steps:** Review completed work → lessons learned → what worked / what didn't → next epic recommendations  
**Output:** `_bmad-output/implementation-artifacts/retrospective-[epic].md`

### `bmad-correct-course` (CC)
**When:** Significant change needed mid-sprint  
**Steps:** Assess impact → recommend: update PRD / redo architecture / sprint re-plan / correct stories  
**Output:** `_bmad-output/planning-artifacts/change-proposal.md`

---

## Anytime Workflows (Core)

### `bmad-help` (BH)
Inspect project state → identify what phase you're in → recommend next workflow → answer questions

### `bmad-brainstorming` (BSP)
Facilitate ideation using: mind mapping, SCAMPER, reverse brainstorming, "How Might We", random association

### `bmad-party-mode` (PM)
Orchestrate multi-agent discussion — each agent gives their perspective on the topic in character

### `bmad-code-review` (CR)
Adversarial review: Blind Hunter + Edge Case Hunter + Acceptance Auditor → structured triage

### `bmad-checkpoint-preview` (CK)
Human-in-the-loop review: orientation → walkthrough → detail pass → testing → wrap-up
