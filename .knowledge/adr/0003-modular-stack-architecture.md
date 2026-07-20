# ADR 0003: Arquitectura modular de stacks

- **Fecha:** 2026-07-20
- **Contexto:** Necesitamos que agregar un nuevo stack sea trivial: crear una carpeta con template + config, sin tocar el core del CLI.
- **Decisión:** Cada stack es un módulo independiente en `src/stacks/<stack>/` con:
  - `index.ts` — configuración del stack (nombre, descripción, template dir, package.json base, prompts)
  - `template/` — archivos del template (copiados al proyecto destino)
  - El core del CLI descubre stacks por convención de directorios
- **Consecuencias:**
  - Agregar un stack = crear `src/stacks/<nombre>/` con su `index.ts` y `template/`
  - El core no necesita saber qué stacks existen
  - Los tests de cada stack pueden ser independientes
  - Los templates actuales (`template/` y `template-api/`) se migran a `src/stacks/next/template/` y `src/stacks/api/template/`
- **Estado:** Aceptado
