# Linear Task Creator — Claude Code Skill

> 🇬🇧 [English](#english) · 🇧🇷 [Português](#português)

---

## English

Turn any input — free-form text, screenshots, mockups, conversation snippets, technical plans — into well-structured Linear issues, via the Linear MCP.

The skill always structures issues using the template **Context / Expected Outcome / Technical Notes / Acceptance Criteria**, and confirms `state` and `priority` before creating.

The issue body and title can be written in **any language** — by default it follows the input language, but you can override it any time ("write it in English", "em português", etc.).

### Requirements

- [Claude Code](https://claude.com/claude-code) installed
- Linear MCP connected: [linear.app/mcp](https://linear.app/mcp)
- Node.js ≥ 16 (only for the installer)

### Installation

#### Via npx (recommended)

```bash
npx github:dihsantanna/linear-task-creator
```

The installer asks for scope:

- **User (global)** → `~/.claude/skills/linear-task-creator/`
- **Current project** → `./.claude/skills/linear-task-creator/`

#### Non-interactive flags

```bash
# Global install, no prompts
npx github:dihsantanna/linear-task-creator --user --force

# Install into current project
npx github:dihsantanna/linear-task-creator --project
```

#### Manual install

```bash
mkdir -p ~/.claude/skills/linear-task-creator
curl -fsSL https://raw.githubusercontent.com/dihsantanna/linear-task-creator/main/SKILL.md \
  -o ~/.claude/skills/linear-task-creator/SKILL.md
```

### Usage

After installing, restart your Claude Code session (or run `/skills`) and use natural phrases:

- `create a task for this on Linear`
- `throw this conversation on Linear as a bug`
- `open an issue from this screenshot`
- `cria uma task pra isso no linear` (mixed languages work fine)

The skill will:

1. Extract problem, expected outcome, technical details, and criteria from the input
2. Resolve the output language (explicit request → session preference → detected from input → English default)
3. List available teams (asks which to use if more than one)
4. Show a summary and confirm `state` + `priority`
5. Create the issue and return ID + link

#### Choosing the output language

The skill writes the **issue itself** (title + body) in:
- The language you explicitly request, OR
- A preference you mentioned earlier in the session, OR
- The dominant language of your input, OR
- English as a fallback (with a one-time notice)

You can override at any time, even mid-draft: `"actually, switch to Portuguese"` and it will rewrite the issue before creating.

### Uninstall

```bash
# Global
rm -rf ~/.claude/skills/linear-task-creator

# Project
rm -rf ./.claude/skills/linear-task-creator
```

### License

MIT

---

## Português

Transforma qualquer input — texto solto, screenshots, mockups, trechos de conversa, planos técnicos — em issues bem estruturadas no Linear, via MCP do Linear.

O skill sempre estrutura as issues no template **Contexto / Resultado Esperado / Notas Técnicas / Critérios de Aceite**, e confirma `state` e `priority` antes de criar.

O corpo e o título da issue podem ser escritos em **qualquer idioma** — por padrão segue o idioma do input, mas você pode sobrescrever a qualquer momento ("escreve em português", "in English", etc.).

### Pré-requisitos

- [Claude Code](https://claude.com/claude-code) instalado
- MCP do Linear conectado: [linear.app/mcp](https://linear.app/mcp)
- Node.js ≥ 16 (apenas para o instalador)

### Instalação

#### Via npx (recomendado)

```bash
npx github:dihsantanna/linear-task-creator
```

O instalador pergunta o escopo:

- **Usuário (global)** → `~/.claude/skills/linear-task-creator/`
- **Projeto atual** → `./.claude/skills/linear-task-creator/`

#### Flags não-interativas

```bash
# Instalação global, sem prompts
npx github:dihsantanna/linear-task-creator --user --force

# Instalação no projeto atual
npx github:dihsantanna/linear-task-creator --project
```

#### Instalação manual

```bash
mkdir -p ~/.claude/skills/linear-task-creator
curl -fsSL https://raw.githubusercontent.com/dihsantanna/linear-task-creator/main/SKILL.md \
  -o ~/.claude/skills/linear-task-creator/SKILL.md
```

### Uso

Depois de instalar, reinicie a sessão Claude Code (ou rode `/skills`) e use frases naturais:

- `cria uma task pra isso no linear`
- `joga essa conversa no linear como bug`
- `abre uma issue sobre esse screenshot`
- `create a task for this on Linear` (línguas misturadas funcionam)

O skill vai:

1. Extrair problema, resultado esperado, detalhes técnicos e critérios do input
2. Resolver o idioma de saída (pedido explícito → preferência na sessão → detectado do input → inglês como padrão)
3. Listar times disponíveis (pergunta qual usar se houver mais de um)
4. Mostrar resumo e confirmar `state` + `priority`
5. Criar a issue e devolver ID + link

#### Escolhendo o idioma da issue

O skill escreve a **issue propriamente dita** (título + corpo) em:
- O idioma que você pedir explicitamente, OU
- Uma preferência já mencionada na sessão, OU
- O idioma dominante do seu input, OU
- Inglês como fallback (com aviso único)

Você pode sobrescrever a qualquer momento, mesmo no meio do rascunho: `"na verdade, escreve em português"` e ele reescreve a issue antes de criar.

### Desinstalação

```bash
# Global
rm -rf ~/.claude/skills/linear-task-creator

# Projeto
rm -rf ./.claude/skills/linear-task-creator
```

### Licença

MIT
