# Tareas de Agentes IA — Fase 2: Flexibilidad Interna y DX

Este archivo es el **Sprint Plan** para los agentes de IA (OpenClaw, Cursor, Claude). Define las reglas de trabajo y las tareas específicas para la **Fase 2**.

## 🛑 Workflow Obligatorio por Tarea

Antes de escribir una sola línea de código, el agente DEBE:
1. Leer el `ROADMAP.md` y este archivo para contexto.
2. Si la tarea implica una decisión arquitectónica nueva o cambio de diseño, documentarla como ADR en `docs/decisions.md`.
3. Planificar la implementación paso a paso (en la memoria o artifacts temporales).
4. Ejecutar cambios atómicos.
5. Correr linting (`npm run lint`), typecheck (`npm run typecheck`) y tests (`npm run test:run`).
6. Actualizar `CHANGELOG.md` en la sección `[Unreleased]`.

---

## 🎯 Épicas Activas (Fase 2)

### Épica 1: Soporte Oficial para Workspaces (Monorepos)
El CLI debe funcionar de forma fluida si se lanza dentro de un monorepo (ej: carpeta `apps/`).
- [ ] Implementar función para detectar si estamos en un workspace (buscar `pnpm-workspace.yaml`, `turbo.json`, `lerna.json` o campo `workspaces` en `package.json` hacia arriba).
- [ ] Si es un workspace: saltar automáticamente el `git init` (o preguntar) para evitar repos anidados.
- [ ] Escribir tests unitarios para la detección de workspaces.

### Épica 2: Pulido Visual Extremo del CLI
La terminal debe sentirse "premium" (spinners, colores consistentes).
- [ ] Instalar `@clack/prompts` como dependencia.
- [ ] Refactorizar el flujo actual de logs para usar los componentes de Clack (intro, spinners para instalación de npm y git, outro).
- [ ] Estandarizar el uso de `picocolors` para outputs intermedios o custom.

### Épica 3: Template API (`--template api`)
Permitir generar un backend puro sin UI React.
- [ ] Agregar el flag `--template` (con valores `app` | `api`, por defecto `app`) en `parse-args.ts`.
- [ ] Crear la carpeta `template-api/` con la base (ej: un Next.js solo con Route Handlers o un setup agnóstico).
- [ ] Ajustar la lógica de copia en `cli.ts` para usar la carpeta de template correspondiente.

### Épica 4: Garantía Multi-PM en CI (De Fase 1)
- [ ] Configurar el GitHub Action (`.github/workflows/ci.yml`) para que pruebe la generación de proyecto con `npm`, `pnpm`, `yarn` y `bun`.
