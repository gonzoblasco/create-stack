# OpenSpec: @gonzoblasco/create-stack

## Summary

Scaffolder opinado multi-stack. Un solo comando y tenés un proyecto moderno, testeado, lintado y listo para que un AI agent lo habite. El stack se elige como primer argumento posicional.

## Specs

### spec-001: CLI entrypoint

- **ID:** spec-001
- **Title:** CLI entrypoint con argumento posicional de stack
- **Status:** proposed
- **Priority:** P0

**Description:**
El CLI se ejecuta con `npx @gonzoblasco/create-stack <stack> [nombre]`. El stack es obligatorio. El nombre del proyecto es opcional (si no se pasa, prompt interactivo).

**Acceptance Criteria:**
- [ ] `npx @gonzoblasco/create-stack next my-app` genera un proyecto Next.js full en `./my-app`
- [ ] `npx @gonzoblasco/create-stack api my-app` genera un proyecto Next.js API-only en `./my-app`
- [ ] `npx @gonzoblasco/create-stack` sin argumentos muestra help con stacks disponibles
- [ ] `npx @gonzoblasco/create-stack --help` muestra help
- [ ] `npx @gonzoblasco/create-stack inexistente` muestra error con stacks válidos
- [ ] El flag `--template` legacy sigue funcionando (compatibilidad)

### spec-002: Stacks modulares

- **ID:** spec-002
- **Title:** Stacks como módulos independientes
- **Status:** proposed
- **Priority:** P0

**Description:**
Cada stack vive en `src/stacks/<stack>/` con su propia configuración y template. El core descubre stacks automáticamente.

**Acceptance Criteria:**
- [ ] `src/stacks/next/index.ts` exporta config del stack Next.js full
- [ ] `src/stacks/api/index.ts` exporta config del stack Next.js API-only
- [ ] El core itera `src/stacks/` para listar stacks disponibles
- [ ] Agregar un stack nuevo no requiere modificar el core

### spec-003: Template copiado con personalización

- **ID:** spec-003
- **Title:** Template copiado con personalización por stack
- **Status:** proposed
- **Priority:** P0

**Description:**
Cada stack tiene su carpeta `template/` que se copia al directorio destino. Durante la copia se personaliza el `package.json` (name, version) y se ejecutan hooks post-copia.

**Acceptance Criteria:**
- [ ] `src/stacks/next/template/` contiene el template Next.js full
- [ ] `src/stacks/api/template/` contiene el template Next.js API-only
- [ ] El `package.json` del proyecto destino tiene el nombre correcto
- [ ] Los hooks post-copia se ejecutan (OpenSpec init, etc.)

### spec-004: OpenSpec integrado

- **ID:** spec-004
- **Title:** OpenSpec init post-scaffold
- **Status:** proposed
- **Priority:** P1

**Description:**
Después de copiar el template e instalar deps, se ejecuta `openspec init` con las herramientas IA seleccionadas por el usuario.

**Acceptance Criteria:**
- [ ] Select interactivo de herramientas IA (Claude Code, Cursor, etc.)
- [ ] `openspec init` se ejecuta con las herramientas seleccionadas
- [ ] Flag `--no-openspec` para saltear
- [ ] Fallback si `openspec init` falla (estructura base ya copiada del template)

### spec-005: Git init inteligente

- **ID:** spec-005
- **Title:** Git init con detección de workspace
- **Status:** proposed
- **Priority:** P1

**Description:**
Se inicializa git automáticamente a menos que se detecte un workspace (Turborepo, pnpm workspace) o se pase `--no-git`.

**Acceptance Criteria:**
- [ ] `git init -b main` + commit inicial
- [ ] Detección de workspace salta git init
- [ ] `--no-git` salta git init
- [ ] Si falta user.name/user.email, usa valores temporales y advierte

### spec-006: Package manager selection

- **ID:** spec-006
- **Title:** Selección de package manager
- **Status:** proposed
- **Priority:** P1

**Description:**
El usuario puede elegir el package manager con `--pm`. Default: npm.

**Acceptance Criteria:**
- [ ] `--pm npm|pnpm|yarn|bun` funciona
- [ ] Default: npm
- [ ] `npm install` se ejecuta post-copia

### spec-007: Help y discoverability

- **ID:** spec-007
- **Title:** Help con stacks disponibles
- **Status:** proposed
- **Priority:** P1

**Description:**
El comando `--help` muestra todos los stacks disponibles con su descripción, y ejemplos de uso.

**Acceptance Criteria:**
- [ ] `--help` lista stacks con nombre y descripción
- [ ] `--help` muestra ejemplos de uso
- [ ] Los stacks se listan dinámicamente (no hardcodeados)
