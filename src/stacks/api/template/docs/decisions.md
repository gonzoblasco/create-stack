# Decisiones técnicas

> Log liviano de decisiones tomadas en el proyecto. Formato inspirado en Architecture Decision Records (ADRs).

---

## D001 — Framework: Next.js 15

**Fecha:** 2026-06-28  
**Decisión:** Usar Next.js 15 con App Router.

**Justificación:** Mayor adopción de mercado, ecosistema maduro, buen soporte de React 19 y Server Components.

---

## D002 — Linter: Biome

**Fecha:** 2026-06-28  
**Decisión:** Usar Biome en lugar de ESLint + Prettier.

**Justificación:** Un solo binario, más rápido, reemplaza dos herramientas.

---

## D003 — Testing: Vitest + Playwright

**Fecha:** 2026-06-28  
**Decisión:** Unit con Vitest, e2e con Playwright.

**Justificación:** Vitest es más rápido que Jest y soporta ESM nativo. Playwright es el estándar actual para e2e.

---

## D004 — Auto-Documentación vía IA (ROADMAP y TASK Tracker)

**Fecha:** 2026-06-30  
**Decisión:** Las IAs deben obligatoriamente guiarse y actualizar `ROADMAP.md` (visión general) y `AGENT_TASKS.md` (sprint plan). Cuando una fase de desarrollo culmina, el archivo `AGENT_TASKS.md` debe archivarse en `docs/phases/` y crearse uno nuevo.

**Justificación:** Evita la amnesia de la IA y permite orquestar múltiples modelos en sesiones distintas sobre el mismo proyecto.

---

## D005 — Registro de Cambios (CHANGELOG) y Contexto (HANDOFF)

**Fecha:** 2026-06-30  
**Decisión:** Obligar a la IA a escribir entradas detalladas en `CHANGELOG.md` antes de cualquier commit. Además, usar `HANDOFF.md` cuando la IA deba interrumpir el desarrollo o cuando un hilo de chat alcance su límite de contexto.

**Justificación:** Facilita la legibilidad para el humano y preserva detalles de implementación ("gotchas") entre agentes o IDEs de IA diferentes.

---

*(Este archivo se mantiene liviano. Usar para decisiones estructurales grandes.)*