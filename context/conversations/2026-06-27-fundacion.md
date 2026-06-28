# Bitácora de conversaciones — create-stack-next

Esta carpeta guarda las conversaciones que definieron/definirán el proyecto. La idea: si en 6 meses querés recordar *"¿por qué elegimos Biome y no ESLint?"*, lo encontrás acá.

---

## 2026-06-27 — Fundación del proyecto

**Origen:** Gonzo le preguntó a su asistente OpenClaw sobre armar un "ejército de devs" para construir herramientas. Empezó como charla abstracta sobre equipos de sub-agentes y terminó en un proyecto concreto.

### Turno 1 — La pregunta inicial
> *"Sos el team leader de mi ejército de devs, precisamos más que devs... diseñadores, contenido, QA, PO, usuarios reales... tiene pinta de agente con muchos sub-agentes."*

**Lo que Gonzo definió acá:** quiere construir un equipo de agentes especializados, no solo devs. Esto define el estilo del proyecto: **AI-native desde el diseño**.

### Turno 2 — El producto
> *"No tengo proyecto específico, quería que armemos algo juntos... una herramienta para el repositorio... JS o TS."*

**Decisión implícita:** el target es devs. Lenguaje: JS/TS.

**Asistente ofreció 3 lecturas de "para el repositorio":**
- A. Repo-as-product (herramienta que opera *sobre* un repo)
- B. Repo-as-code (infra/herramienta que *es* un repo)
- C. Repo-as-graph (analítica/conocimiento de un repo)

**3 lugares donde un tool nuevo tiene chance real:**
1. PR reviewer local con feedback accionable
2. Doc linter que entiende código
3. Scaffolder opinado

### Turno 3 — La elección
> *"a3"* (scaffolder opinado)

**Decisión:** A3 — scaffolder.

**Justificación registrada:**
- Ratio de uso: scaffolder se usa cada vez que arrancás un proyecto
- PR reviewer compite con Copilot (70% coverage)
- Doc linter es nicho chico

### Turno 4 — Definición del producto
> *"1) App Web, 2) create-stack-next, 3) npm"*

**Decisiones finales de este turno:**
- **Scope:** scaffolder de app web full-stack (no API, no librería, no CLI — al menos no en MVP)
- **Nombre tentativo:** `create-stack-next`
- **Distribución:** npm package (`npx create-stack-next`)

### Estructura creada
```
projects/
  create-stack-next/
    README.md                                  ← estado actual del proyecto
    context/
      decisions.md                             ← log de decisiones
      conversations/
        2026-06-27-fundacion.md                ← este archivo
```

---

## Pendientes para próximas conversaciones

- Decidir stack concreto (Next.js vs Astro vs Remix vs SvelteKit)
- Confirmar nombre y disponibilidad en npm
- Escribir MVP spec (qué archivos genera, qué comandos expone, qué defaults asume)
- Spawnear equipo de sub-agentes (Tech Lead ya existe — Gonzo; falta PO, Frontend, Backend, QA, Designer, Content, Beta)
