# @gonzoblasco/create-stack

> Scaffolder opinado multi-stack. Un solo comando y tenés un proyecto moderno, testeado, lintado y listo para que un AI agent lo habite.

[![npm version](https://img.shields.io/npm/v/@gonzoblasco/create-stack.svg)](https://www.npmjs.com/package/@gonzoblasco/create-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Instalación

```bash
# Stack Next.js full (app + API routes + tests + AI agent)
npx @gonzoblasco/create-stack next my-app

# Stack Next.js API-only (Drizzle ORM + SQLite + middleware)
npx @gonzoblasco/create-stack api my-api
```

Eso es todo. El comando genera un proyecto listo para empezar a desarrollar.

---

## Stacks disponibles

| Stack | Descripción |
|-------|-------------|
| `next` | Next.js 15 + React 19 + TypeScript estricto + Biome + Vitest + Playwright + Zod + OpenSpec + AI agent config |
| `api` | Next.js 15 App Router (API-only) + Drizzle ORM + SQLite + middleware Bearer + tests con `node-mocks-http` |

### Stack Next.js Full (`next`)

El proyecto generado viene con todo preconfigurado:

- **Next.js 15** + React 19 + TypeScript estricto
- **Biome** (lint + format en un solo comando)
- **Vitest** (tests unitarios) + **Playwright** (tests e2e)
- **Zod** para validación runtime
- **GitHub Actions** (CI + e2e)
- **OpenSpec** — Spec-Driven Development integrado (specs + slash commands para IA)
- **AGENTS.md** + workflow de IA inyectado para desarrollo asistido
- `docs/` con arquitectura, decisiones y guía de contribución

### Stack API-only (`api`)

Si preferís generar un backend puramente funcional sin React components:
- **Next.js 15 App Router** (Rutas de API).
- **Drizzle ORM** + SQLite pre-configurado para base de datos.
- Utilidades estandarizadas de Error Handling y Respuestas API.
- Middleware base con validación de Bearer Token.
- **node-mocks-http** + Vitest para probar endpoints velozmente.

---

## ¿Por qué este y no create-next-app?

| Aspecto | create-next-app | @gonzoblasco/create-stack |
|---------|-----------------|---------------------------|
| Testing | Ninguno | Vitest + Playwright configurados |
| Linter | ESLint + Prettier | Biome (un solo binario) |
| TypeScript | Básico | Estricto + `noUncheckedIndexedAccess` |
| AI agents | Ninguno | `AGENTS.md` + prompts listos para usar |
| Spec-Driven Development | Ninguno | OpenSpec integrado (specs + slash commands) |
| CI | Ninguno | GitHub Actions incluido |
| Filosofía | Mínimo | Opinado con defaults 2026 |
| Multi-stack | Solo Next.js | `next`, `api`, y más por venir |

**Ideal si:** arrancás proyectos con frecuencia y no querés repetir las mismas 40 decisiones cada vez.

---

## Opciones

```bash
npx @gonzoblasco/create-stack <stack> [nombre] [opciones]

Opciones:
  --no-git          No inicializa git ni hace commit inicial
  --no-install      No corre npm install después de generar
  --no-openspec     No inicializa OpenSpec (Spec-Driven Development)
  --pm <nombre>     Package manager: npm, pnpm, yarn, bun (default: npm)

Ejemplos:
  npx @gonzoblasco/create-stack next my-app
  npx @gonzoblasco/create-stack api my-api
  npx @gonzoblasco/create-stack next my-app --pm pnpm --no-git
```

### Compatibilidad hacia atrás

El formato legacy `npx create-stack-next my-app` sigue funcionando (asume stack `next`).
El flag `--template api` también funciona, mapeado al stack `api`.

---

## AI agents integrados

El proyecto incluye:

- `AGENTS.md` — instrucciones agnósticas (funciona con OpenClaw, Claude Code, Cursor, etc.)
- `.openclaw/` — config y prompts específicos de OpenClaw
- `.agents/` — config genérica + prompts compartidos
- `openspec/` — Spec-Driven Development con OpenSpec (specs, changes, slash commands)
- `npm run agent` — abre sesión con el agente ya contextualizado

### Spec-Driven Development con OpenSpec

Todos los proyectos generados incluyen [OpenSpec](https://github.com/Fission-AI/OpenSpec) pre-configurado. Esto significa que tu IA trabaja con especificaciones en vez de prompts vagos:

```bash
/opsx:propose "agregar autenticación"   # la IA crea propuesta + specs + tasks
/opsx:apply                              # la IA implementa
/opsx:archive                            # specs actualizadas, cambio archivado
```

Durante el scaffolding, el CLI te pregunta qué herramientas de IA usás (Claude Code, Cursor, etc.) e instala los skills y slash commands correspondientes.

---

## Comandos del proyecto generado

```bash
npm run dev          # servidor de desarrollo
npm run build        # build de producción
npm run lint         # Biome (check)
npm run lint:fix     # Biome con --write
npm run typecheck    # verificación de tipos
npm run test:run     # tests unitarios
npm run test:e2e     # tests e2e
npm run agent        # sesión con OpenClaw
```

---

## Arquitectura del CLI

```
src/
├── index.ts              # Entrypoint
├── cli.ts                # Lógica principal del CLI
├── parse-args.ts         # Parser de argumentos
├── copy-template.ts      # Copia y personaliza templates
├── openspec-init.ts      # Inicialización de OpenSpec
├── workspace.ts          # Detección de workspaces
└── stacks/
    ├── types.ts          # Tipos de StackConfig
    ├── index.ts          # Registry de stacks
    ├── next/
    │   ├── index.ts      # Config del stack next
    │   └── template/     # Template Next.js full
    └── api/
        ├── index.ts      # Config del stack api
        └── template/     # Template Next.js API-only
```

Cada stack es un módulo independiente. Para agregar uno nuevo, creá `src/stacks/<id>/` con su `index.ts` y `template/`, y registralo en `src/stacks/index.ts`.

---

## Roadmap

Ver [`ROADMAP.md`](ROADMAP.md) y [`FUTURE.md`](FUTURE.md).

---

## Licencia

MIT

---

**Creado con ❤️ por Gonzo y Kanam (OpenClaw)**
