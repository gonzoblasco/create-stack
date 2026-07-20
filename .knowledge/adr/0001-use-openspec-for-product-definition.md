# ADR 0001: Usar OpenSpec para definición de producto

- **Fecha:** 2026-07-20
- **Contexto:** Reidentificación de `create-stack-next` → `@gonzoblasco/create-stack`. Necesitamos documentar decisiones de producto y especificaciones de manera estructurada y ejecutable por IA.
- **Decisión:** Usar OpenSpec como formato de especificación. Las specs viven en `.knowledge/specs/` y se sincronizan con el workspace git (no con el repo del proyecto). Los ADRs documentan decisiones arquitectónicas.
- **Consecuencias:**
  - Las features se definen como OpenSpec specs antes de implementar
  - Los ADRs capturan el "por qué" de cada decisión
  - El workflow es: spec → implementación → spec actualizada
- **Estado:** Aceptado
