# Proyectos futuros

Este documento lista ideas y posibles expansiones del ecosistema `create-stack-*` que **no están en el alcance actual**.

---

## Familia de scaffolders

### `create-stack-remix`

- Framework: Remix (React Router v7)
- Estado: Pendiente
- Notas: Gonzo mencionó interés en Remix. Se evaluó en M0 pero se descartó por adopción de mercado.

### `create-stack-astro`

- Framework: Astro
- Estado: Pendiente
- Notas: Ideal para sitios content-heavy. Menos prioridad que Remix.

### `create-stack-sveltekit`

- Framework: SvelteKit
- Estado: Pendiente
- Notas: Comunidad más chica, pero DX muy buena.

### Criterios para arrancar uno nuevo

Antes de crear un nuevo scaffolder de la familia, se recomienda:

1. Que `create-stack-next@1.0.0` esté estable y bien testeado.
2. Que haya demanda real (usuarios pidiendo la variante).
3. Que el código del scaffolder original esté lo suficientemente modularizado (o que estemos dispuestos a duplicar código en la primera iteración).

---

## Otras ideas

- `--template api` (Next.js API only, sin frontend)
- `--template cli` (scaffolder de CLIs en Node.js)
- Soporte oficial para pnpm/yarn/bun workspaces desde el primer momento
- Integración más profunda con OpenClaw (sub-agentes que ejecuten tareas)

---

**Última actualización:** 2026-06-28

Este documento es vivo. Se actualiza cuando surge una idea que no entra en el roadmap inmediato.