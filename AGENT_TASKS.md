# Tareas de Agentes IA — Fase 3: Adopción y Documentación

Este archivo es el **Sprint Plan** para los agentes de IA (OpenClaw, Cursor, Claude). Define las reglas de trabajo y las tareas específicas para la **Fase 3**.

## 🛑 Workflow Obligatorio por Tarea

Antes de escribir una sola línea de código, el agente DEBE:
1. Leer el `ROADMAP.md` y este archivo para contexto.
2. Si la tarea implica una decisión arquitectónica nueva o cambio de diseño, documentarla como ADR en `docs/decisions.md`.
3. Planificar la implementación paso a paso (en la memoria o artifacts temporales).
4. Ejecutar cambios atómicos.
5. Correr linting (`npm run lint`), typecheck (`npm run typecheck`) y tests (`npm run test:run`).
6. Actualizar `CHANGELOG.md` en la sección `[Unreleased]`.

---

## 🎯 Épicas Activas (Fase 3)

### Épica 1: Sitio Web de Documentación
Migrar de un simple README a una web de docs interactiva.
- [ ] Elegir herramienta (VitePress, Nextra, etc.) y dejar registro en ADR.
- [ ] Migrar contenido del README.

### Épica 2: Material de Onboarding
- [ ] Preparar guion para video demo de 2-4 min.

### Épica 3: Release Candidate (v1.0.0-rc)
- [ ] Congelar features.
- [ ] Solicitar a beta testers que prueben la herramienta.
