# STATUS: @gonzoblasco/create-stack

**Fecha:** 2026-07-20
**Fase:** Reidentificación (v2-rebrand)
**Última versión publicada:** 0.7.2 (como create-stack-next)

## Estado actual

En plena reidentificación de `create-stack-next` → `@gonzoblasco/create-stack`. Se está refactorizando la arquitectura a stacks modulares, renombrando el paquete, y documentando con ADRs + OpenSpec specs.

## Lo que está pasando ahora

- [x] ADRs de decisiones arquitectónicas (3/3)
- [x] OpenSpec specs del producto (7 specs)
- [x] BRIEF definido
- [ ] Refactor de `src/` a arquitectura modular
- [ ] Migración de templates a `src/stacks/`
- [ ] Renombre de package.json y bin
- [ ] Tests actualizados
- [ ] Documentación actualizada

## Próximos pasos inmediatos

1. Refactorizar `src/` (parse-args, cli, index)
2. Mover templates a `src/stacks/next/template/` y `src/stacks/api/template/`
3. Renombrar package.json
4. Actualizar tests
5. Verificar build + lint + typecheck + tests
