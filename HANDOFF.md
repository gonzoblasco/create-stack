# Handover — create-stack-next

**Fecha:** 2026-07-15
**Última versión:** `0.7.1`

---

## Últimos cambios (2026-07-15)

### Templates actualizados para compatibilidad con versiones modernas

Se actualizaron los templates (`template/` y `template-api/`) para resolver los pitfalls encontrados al scaffoldear SoporteML v2:

- **Biome 1.9 → 2.5.4:**
  - Schema URL actualizada
  - `organizeImports.enabled` → `assist.actions.source.organizeImports.level: "on"`
  - `linter.rules.recommended: true` → `linter.rules.preset: "recommended"`
  - `files.ignore` → `files.includes` (formato Biome 2.5+)
  - Agregado `css.parser.tailwindDirectives: true` para Tailwind v4
- **TypeScript:** templates mantienen `^5.6.x` (Next.js 15 no es compatible con TS 7)
- **Vitest:** bump de `^2.1.0` a `^4.0.0`
- **Agregado `src/global.d.ts`** con declaraciones de módulos para CSS/imágenes
- **`@types/react` y `@types/react-dom`** actualizados a `^19.0.0` en template-api

### Proyecto CSN actualizado

- `@biomejs/biome` bump a `^2.5.0`, `typescript` a `^7.0.0`, `vitest` a `^4.0.0`
- Agregado `"types": ["node"]` en tsconfig para compatibilidad con TS 7
- Todos los 64 tests pasando ✅

### Nota importante

Los templates usan TypeScript 5.x porque Next.js 15 no es compatible con TS 7 (falla `next build` con `Cannot read properties of undefined (reading 'fileExists')`). El proyecto CSN en sí usa TS 7 sin problemas porque no depende de Next.js.

---

## Estado actual del proyecto

### Versiones cerradas
- **Fase 1 (Robustez Absoluta):** ✅ Completada en v0.5.x
- **Fase 2 (Flexibilidad Interna y DX):** ✅ Completada en v0.6.x
- **Fase 3 (Adopción y Documentación):** ⏳ En progreso (SDD integrado)

### Entregables de v0.7.0 completados
- ✅ **Spec-Driven Development integrado con OpenSpec**: todos los proyectos generados incluyen OpenSpec pre-configurado.
- ✅ Select interactivo para elegir herramientas IA (Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Codex) con Claude y Cursor pre-seleccionados.
- ✅ `openspec init --tools <seleccionadas> --force` se ejecuta post-install, antes de `git init`.
- ✅ Estructura `openspec/` pre-armada en `template/` y `template-api/` como fallback.
- ✅ `@fission-ai/openspec` agregado como `devDependency` en ambos templates.
- ✅ `AGENTS.md` de ambos templates actualizado con sección SDD.
- ✅ `README.md` de ambos templates + repo principal actualizado con sección SDD.
- ✅ Nuevo flag `--no-openspec` para saltear la inicialización.
- ✅ Próximos pasos del CLI incluye `/opsx:propose "tu primera feature"`.
- ✅ Fix de v0.6.2: `dotfiles: true` en `copy-template.ts` para copiar archivos ocultos.

### Entregables de v0.6.x completados
- ✅ Template `--template api` (backend puro Next.js App Router, Drizzle ORM + SQLite, Zod, middleware Bearer/API Key, tests con `node-mocks-http`).
- ✅ AI-Native workflow: `AGENTS.md`, `ROADMAP.md`, `AGENT_TASKS.md`, `HANDOFF.md` y ADRs semilla inyectados en ambos templates.
- ✅ Soporte de workspaces con detección automática y desactivación inteligente de `git init`.
- ✅ Pulido visual del CLI con `@clack/prompts`.
- ✅ CI/CD de GitHub Actions en el repositorio central.

### Tests del scaffolder
- 64 tests pasando con `npm run test:run`.
- 9 tests nuevos de OpenSpec (estructura, config, devDeps, runOpenSpecInit).
- `vitest.config.ts` aísla estrictamente `src/` para evitar colisiones con tests anidados en `template/`.

---

## Dónde retomar

Cuando se retome el proyecto, se recomienda revisar:

1. `ROADMAP.md` — estado actual de fases y épicas pendientes.
2. `AGENT_TASKS.md` — sprint plan para la Fase 3.
3. `CHANGELOG.md` — historial de versiones.
4. `FUTURE.md` — ideas post-v1.0.0.

### Pendientes de la Fase 3
- [ ] Publicar v0.7.0 en npm (requiere `npm login` de Gonzo)
- [ ] Sitio Web de Documentación (VitePress o Nextra)
- [ ] Material de Onboarding (video demo de 2-4 min)
- [ ] Tests de integración multi-package manager (`pnpm`, `yarn`, `bun`)
- [ ] Polish de Release Candidate: beta testing comunitario

---

## Notas

- OpenSpec se ejecuta con `OPENSPEC_TELEMETRY=0` para desactivar telemetría.
- El flujo es: copiar template → personalizar → select herramientas IA → npm install → openspec init → git init.
- Si `openspec init` falla (sin internet, npm caído), la estructura base ya está copiada del template como fallback.
- Los prompts de agentes están en español (`.openclaw/prompts/` y `.agents/prompts/`).
- CSN es 100% en español — release notes, docs, todo.

---

**Última actualización:** 2026-07-14