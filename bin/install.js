#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");

const SKILL_NAME = "linear-task-creator";

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(msg) {
  process.stdout.write(msg + "\n");
}

function err(msg) {
  process.stderr.write(`${c.red}✗${c.reset} ${msg}\n`);
}

function ok(msg) {
  log(`${c.green}✓${c.reset} ${msg}`);
}

function info(msg) {
  log(`${c.cyan}→${c.reset} ${msg}`);
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

function findSkillSource() {
  const candidates = [
    path.resolve(__dirname, "..", "SKILL.md"),
    path.resolve(process.cwd(), "SKILL.md"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function pickScope(argv) {
  if (argv.includes("--project")) {
    return { scope: "project", dir: path.resolve(process.cwd(), ".claude", "skills") };
  }
  if (argv.includes("--user") || argv.includes("--global")) {
    return { scope: "user", dir: path.resolve(os.homedir(), ".claude", "skills") };
  }
  return null;
}

async function promptScope() {
  log("");
  log(`${c.bold}Onde instalar o skill?${c.reset}`);
  log(`  ${c.cyan}1${c.reset}) Usuário (global) — ${c.dim}~/.claude/skills/${SKILL_NAME}${c.reset}`);
  log(`  ${c.cyan}2${c.reset}) Projeto atual    — ${c.dim}./.claude/skills/${SKILL_NAME}${c.reset}`);
  const answer = await ask(`\nEscolha [1/2] (padrão: 1): `);
  if (answer === "2" || answer === "project" || answer === "p") {
    return { scope: "project", dir: path.resolve(process.cwd(), ".claude", "skills") };
  }
  return { scope: "user", dir: path.resolve(os.homedir(), ".claude", "skills") };
}

async function main() {
  const argv = process.argv.slice(2);

  if (argv.includes("-h") || argv.includes("--help")) {
    log(`
${c.bold}linear-task-creator${c.reset} — instalador do skill Claude Code

${c.bold}Uso:${c.reset}
  npx github:<owner>/linear-task-creator [opções]

${c.bold}Opções:${c.reset}
  --user, --global   Instala em ~/.claude/skills/ (padrão se interativo)
  --project          Instala em ./.claude/skills/ no diretório atual
  --force            Sobrescreve instalação existente sem perguntar
  -h, --help         Mostra essa ajuda
`);
    return;
  }

  log(`\n${c.bold}${c.blue}Linear Task Creator${c.reset} ${c.dim}— instalador${c.reset}\n`);

  const src = findSkillSource();
  if (!src) {
    err("SKILL.md não encontrado no pacote.");
    process.exit(1);
  }

  let target = pickScope(argv);
  if (!target) {
    target = await promptScope();
  }

  const skillDir = path.join(target.dir, SKILL_NAME);
  const destFile = path.join(skillDir, "SKILL.md");

  if (fs.existsSync(destFile) && !argv.includes("--force")) {
    const answer = await ask(`\n${c.yellow}⚠${c.reset} Já existe em ${c.dim}${destFile}${c.reset}\nSobrescrever? [y/N]: `);
    if (answer !== "y" && answer !== "yes" && answer !== "s" && answer !== "sim") {
      info("Cancelado.");
      process.exit(0);
    }
  }

  fs.mkdirSync(skillDir, { recursive: true });
  fs.copyFileSync(src, destFile);

  log("");
  ok(`Skill instalado em ${c.dim}${destFile}${c.reset}`);
  log("");
  log(`${c.bold}Próximos passos:${c.reset}`);
  log(`  1. Conecte o MCP do Linear: ${c.cyan}linear.app/mcp${c.reset}`);
  log(`  2. Reinicie a sessão Claude Code (ou execute ${c.cyan}/skills${c.reset})`);
  log(`  3. Use: "${c.dim}cria uma task no linear sobre...${c.reset}"`);
  log("");
}

main().catch((e) => {
  err(e.message || String(e));
  process.exit(1);
});
