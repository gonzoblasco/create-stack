# Handoff Log

> **Agentes de IA:** Usen este archivo para dejar un resumen conciso antes de cerrar sesión o cuando la ventana de contexto de la conversación actual se acerque a su límite. Es vital para que el próximo agente retome el trabajo sin amnesia.

---

## [Fecha/Hora o ID de Sesión] - *[Agente que escribe]*

### Estado Actual
- ¿Qué estábamos haciendo justo antes de detenernos?
- *Ejemplo: Implementando la autenticación con NextAuth en `src/lib/auth.ts`.*

### Qué Falta Hacer Inmediatamente
- ¿Cuáles son los próximos 2 o 3 pasos técnicos concretos?
- *Ejemplo: 1) Agregar el Provider en `layout.tsx`. 2) Testear el login social.*

### Contexto Crítico / "Gotchas"
- Decisiones silenciosas, bugs misteriosos o problemas de dependencias en los que se gastó tiempo.
- *Ejemplo: "Ojo: NextAuth en v5 requiere que pongamos `AUTH_SECRET` explícito, sino falla en Vercel."*

---
*(Los agentes deben ir agregando entradas arriba de esta línea)*
