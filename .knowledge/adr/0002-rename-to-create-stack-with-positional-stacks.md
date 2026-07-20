# ADR 0002: Renombrar a `@gonzoblasco/create-stack` con stacks posicionales

- **Fecha:** 2026-07-20
- **Contexto:** `create-stack-next` está atado semánticamente a Next.js, pero ya tiene `--template api` y se planean más stacks (TanStack, Astro). El nombre actual es engañoso y no escala.
- **Decisión:**
  1. **Nombre npm:** `@gonzoblasco/create-stack` (scoped package público)
  2. **Nombre repo:** `create-stack` (se renombrará en GitHub al estabilizar)
  3. **CLI:** `npx @gonzoblasco/create-stack <stack> [nombre]` donde `<stack>` es el primer argumento posicional
  4. **Stacks iniciales:** `next` (full app), `api` (Next.js API-only)
  5. **Stacks futuros:** `tanstack`, `astro`, `cli`
- **Consecuencias:**
  - Breaking change en la interfaz CLI (de `npx create-stack-next nombre` a `npx @gonzoblasco/create-stack next nombre`)
  - El comando es más verboso pero más explícito y extensible
  - El flag `--template` se depreca; el stack se pasa como argumento
  - Se mantiene compatibilidad hacia atrás con `--template` por un tiempo
- **Estado:** Aceptado
