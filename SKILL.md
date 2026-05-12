---
name: linear-task-creator
description: >
  Creates Linear issues from abstract inputs: free-form text, images (screenshots, mockups),
  conversation snippets, technical plans, or any combination of these. Automatically structures
  the issue using the standard template (Context / Expected Outcome / Technical Notes /
  Acceptance Criteria) and creates it in the correct workspace/team via the Linear MCP.

  Use this skill whenever the user wants to create a Linear task, even when the request is vague
  like "create a task for this", "put this on Linear" or "open an issue for this bug". Also use it
  when the user shares an image or conversation and asks to turn it into a task.
compatibility: "Requires Linear MCP connected (linear.app/mcp)"
---

# Linear Task Creator

Turns any input — abstract text, image, Slack/WhatsApp conversation, technical plan — into a
well-structured Linear issue.

---

## Flow

### 1. Understand the input

Accept any combination of:
- **Free-form text / draft**: loose idea, bug description, conversation
- **Image**: bug screenshot, mockup, diagram
- **Structured document**: technical plan, spec, PRD
- **Conversation**: chat snippet with a client or between devs

Extract from the input:
- The **central problem or opportunity**
- The **desired outcome** (what must be true when done)
- Relevant **technical details** (if any)
- **Verifiable completion criteria**

### 2. Decide the output language

The issue body and title must be written in a specific language. Resolve this in order:

1. **If the user explicitly states a language** ("write it in English", "escreve em português", "em inglês mesmo", "in Spanish") → use that language for the issue.
2. **If the user has stated a preference earlier in this session** → reuse it. Don't ask again.
3. **Otherwise** → detect the dominant language of the input itself and use it. If the input is mixed or ambiguous, default to **English** and tell the user once:
   > "I'll write the issue in English. Want a different language? Just say so (e.g. 'em português')."

Always honor explicit overrides immediately, even mid-flow. If the user says "actually, switch to Portuguese" before confirming creation, rewrite the draft and re-show it.

> Note: this language choice applies only to the **issue content**. Communication with the user
> follows whatever language they're chatting in.

### 3. Confirm workspace / team

Before creating, list available teams with `Linear:list_teams`.

If there's only 1 team, use it directly.
If there's more than 1, ask the user which one to use — **don't assume**.

> ⚠️ If the user says they need to connect to a different workspace, tell them to update the
> Linear connection in Settings → Connections on Claude.ai.

### 4. Format the issue

Always use this template. Translate the section headings to match the chosen output language
(examples below).

**English (default):**
```markdown
## Context
[Why this matters — 2-3 sentences. Don't name competitors.]

## Expected Outcome
[What must be true when this is done. Be specific and measurable.]

## Technical Notes
[Optional: implementation hints, constraints, relevant files, API refs, delivery phases.]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

**Portuguese:**
```markdown
## Contexto
## Resultado Esperado
## Notas Técnicas
## Critérios de Aceite
```

**Spanish:**
```markdown
## Contexto
## Resultado Esperado
## Notas Técnicas
## Criterios de Aceptación
```

For any other language, translate the four section headings naturally and keep the same order
and meaning.

**Content rules:**
- Never name competitors in the task body
- Be technical when the input is technical; be plain when the input is plain
- Technical Notes: include only when there's actual technical info in the input
- Acceptance Criteria: minimum 2, reasonable maximum (~8-12); must be verifiable
- Title: **no prefixes** (`[Bug]`, `[UI]`, etc.) — use Linear labels for that
- Title and body must be in the resolved output language (step 2)

### 5. Confirm with the user before creating

Before creating, list in parallel:
- Available labels: `Linear:list_issue_labels` (team)
- Available states: `Linear:list_issue_statuses` (team)

Then show a summary of the formatted issue and **ask the user**:

1. **State** (always ask): show available states and ask which to use.
2. **Priority** (suggest and confirm): infer priority from context, present your suggestion, and ask for confirmation or adjustment.

Example:
> Before creating, two quick confirmations:
> - **State**: which status should I use? Available: Backlog, Todo, In Progress…
> - **Priority**: I'd suggest **Medium** based on context. Sound right, or different?

Only create the issue after the user confirms.

**Priority inference** (use as suggestion, not as a fixed value):
- Production bug affecting users → `Urgent`
- Important feature / blocker → `High`
- Planned improvement → `Medium`
- Chore / refactor / nice-to-have → `Low`

Use `Linear:save_issue` with:
- `title`: clear, concise title, **no prefixes** like `[UI]`, `[Bug]`, `[Feature]` — use labels for that
- `description`: body formatted with the template above, in the resolved output language
- `team`: selected team
- `labels`: array of existing label names that apply (can be more than one)
- `state`: as confirmed by the user
- `priority`: as confirmed by the user

**Typical label mapping** (adapt to the workspace's actual labels):
- Visual / UX / component issue → `Frontend`
- Server logic / API / database → `Backend`
- New functionality → `Feature`
- Something broken → `Bug`
- Improvement on something existing → `Improvement`
- Multiple can apply (e.g. frontend bug → `Bug` + `Frontend`)

### 6. Confirm to the user

After creating, respond with:
- Issue ID and title (e.g. `CON-42 — Task name`)
- Status and priority
- Direct link to the issue on Linear

---

## Input examples and how to handle them

### Bug via screenshot + vague text
> "it denies permission and gets stuck on this message"
> [image showing screen stuck on "Preparing microphone…"]

→ Interpret the image visually. Extract the problematic behavior, the stuck state, and the
context from the conversation. Apply `Bug` and/or `Frontend` labels depending on nature.

### Long technical plan
> [document with architecture, phases, TS types, ASCII mockups]

→ Condense to essentials: central problem in Context, deliverables in Expected Outcome,
phases + critical files + mandatory fixes in Technical Notes, criteria per phase in Acceptance
Criteria. Don't copy the whole document.

### Slack/WhatsApp conversation
> chat snippet between devs discussing a problem

→ Extract the identified problem, the proposed solution, and any technical detail mentioned.
Ignore social context (jokes, "lol", emojis, etc.).

---

## Post-creation edits

If the user asks to edit an already-created issue, use `Linear:save_issue` with the issue's `id`.
Common examples:
- Remove competitor mention → rewrite the passage and update
- Adjust priority or status → pass only the changed fields
- Fix an acceptance criterion → update the full `description` field
- Switch the issue's language → translate the full body and title, then update

---

## What NOT to do

- Never name competitors in the task body
- Never create in a team without confirming when there are multiple teams
- Never invent technical details that aren't in the input
- Never use Technical Notes to repeat what's already in Context
- Never write the issue in a different language than the one resolved in step 2
