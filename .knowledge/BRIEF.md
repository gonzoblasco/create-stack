# BRIEF: @gonzoblasco/create-stack

## Qué es

Scaffolder opinado multi-stack. Un solo comando y tenés un proyecto moderno, testeado, lintado y listo para que un AI agent lo habite.

## Por qué existe

Gonzo arranca proyectos constantemente y se cansó de repetir las mismas 40 decisiones. `create-stack-next` demostró el concepto pero quedó atado a Next.js. Esta es la evolución: un CLI que permite elegir el stack como argumento posicional, con arquitectura modular para agregar stacks sin tocar el core.

## Stack inicial

- **next:** Next.js 15 + React 19 + TypeScript estricto + Biome + Vitest + Playwright + Zod + OpenSpec + AI agent config
- **api:** Next.js 15 App Router (API-only) + Drizzle ORM + SQLite + middleware Bearer + tests

## Stack futuros (en consideración)

- tanstack, astro, cli

## Diferenciador

No es solo un scaffolder de código. Es un scaffolder de **entorno de desarrollo**: tests, lint, CI, AI agent config, OpenSpec, todo desde el día 1. El proyecto generado está listo para que un agente IA lo habite productivamente.

## Público

Gonzo (uso primario), y cualquier dev que quiera arrancar proyectos rápido con buena base técnica y AI-ready.
