# Handover — @gonzoblasco/create-stack

**Fecha:** 2026-07-20
**Última versión:** `0.8.0` (v2-rebrand)
**Branch:** `v2-rebrand`

---

## Resumen de la reidentificación

`create-stack-next` → `@gonzoblasco/create-stack`. Se refactorizó la arquitectura a stacks modulares, se renombró el paquete, y se documentó con ADRs + OpenSpec specs.

### Cambios principales

1. **Nombre npm:** `@gonzoblasco/create-stack` (scoped package público)
2. **CLI:** `npx @gonzoblasco/create-stack <stack> [nombre]`
3. **Arquitectura:** cada stack es un módulo en `src/stacks/<id>/`
4. **Stacks:** `next` (full app) y `api` (API-only)
5. **Compatibilidad:** `npx create-stack-next my-app` y `--template api` siguen funcionando

### Archivos modificados/creados

- `package.json` — renombrado, bin actualizado
- `src/parse-args.ts` — nueva API con stack posicional
- `src/cli.ts` — refactorizado para usar registry de stacks
- `src/stacks/` — nuevo: types, registry, next, api
- `src/stacks/next/template/` — template Next.js full (movido de `template/`)
- `src/stacks/api/template/` — template API-only (movido de `template-api/`)
- `src/test/*.test.ts` — tests actualizados para nueva API
- `vitest.config.ts` — exclude templates del runner
- `tsconfig.json` — exclude templates del build
- `README.md`, `ROADMAP.md`, `CHANGELOG.md`, `FUTURE.md` — actualizados
- `.knowledge/` — nuevo: ADRs, specs, BRIEF, STATUS

### Tests

- 67 tests pasando (5 test files)
- Build compila sin errores
- Lint: Biome check

### Pendientes

- [ ] Publicar v0.8.0 en npm (`npm login` + `npm publish`)
- [ ] Renombrar repo en GitHub a `create-stack`
- [ ] Mergear `v2-rebrand` a `main` cuando esté estable
- [ ] Sitio de documentación
- [ ] Video demo

### Notas

- Los templates usan TypeScript 5.x (Next.js 15 no es compatible con TS 7)
- El proyecto CSN en sí usa TS 7 sin problemas
- OpenSpec se ejecuta con `OPENSPEC_TELEMETRY=0`
- El flag `--template` legacy se mapea: `app → next`, `api → api`
- Si se pasa `--template` y también un stack posicional, gana `--template`
