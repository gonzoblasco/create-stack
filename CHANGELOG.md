# Changelog

## [Unreleased] — v0.8.0 (Reidentificación)

### 🚀 Cambios mayores

- **Renombre:** `create-stack-next` → `@gonzoblasco/create-stack`
- **Nuevo CLI:** `npx @gonzoblasco/create-stack <stack> [nombre]`
- **Arquitectura modular:** cada stack es un módulo independiente en `src/stacks/<id>/`
- **Compatibilidad hacia atrás:** `npx create-stack-next my-app` y `--template api` siguen funcionando

### ✨ Nuevas features

- Stack posicional como primer argumento (`next`, `api`)
- Help dinámico que lista stacks disponibles
- Stacks `next` (full app) y `api` (API-only) como módulos

### 🔧 Internals

- `src/stacks/` con registry, types y módulos por stack
- Templates movidos a `src/stacks/*/template/`
- `parse-args.ts` refactorizado para nueva API
- `cli.ts` refactorizado para usar `getStack()` y `listStacks()`
- ADRs documentados en `.knowledge/adr/`
- OpenSpec specs en `.knowledge/specs/`

### 📚 Documentación

- README actualizado con nueva API y arquitectura
- ROADMAP actualizado
- BRIEF, STATUS, ADRs y specs agregados

## [0.7.2] — 2026-07-15

### Fixed
- Templates actualizados para Biome 2.5.4, Vitest 4, TS 5.x compat
- Agregado `src/global.d.ts` con declaraciones de módulos
- `@types/react` y `@types/react-dom` actualizados a ^19.0.0 en template-api

## [0.7.1] — 2026-07-14

### Added
- Opción "Todas las herramientas (30+)" en el select de IA
- Limpieza de docs

## [0.7.0] — 2026-07-13

### Added
- Spec-Driven Development integrado con OpenSpec
- Select interactivo para elegir herramientas IA
- Flag `--no-openspec`
- Próximos pasos incluye `/opsx:propose`
