# Decisiones técnicas y Arquitectura (Scaffolder)

> Log de decisiones técnicas (Architecture Decision Records) específicas del CLI y scaffolder `create-stack-next`.

---

## D001 — Adopción de Desarrollo Dirigido por IA (AI-Driven Development)

**Fecha:** 2026-06-30
**Decisión:** Integrar como práctica fundamental la documentación continua de decisiones y arquitectura tanto en el scaffolder como en los templates que genera.
**Justificación:** Garantizar la "persistencia de memoria" entre diferentes sesiones y diferentes agentes de IA. Un registro claro de decisiones (ADRs) evita refactorizaciones circulares, pérdida de contexto, y asegura que la evolución del código a la versión 1.0.0 sea estable y coherente.

---

## D002 — Exportación de funciones internas para testabilidad

**Fecha:** 2026-06-30
**Decisión:** Exportar `validateProjectName`, `execInDir`, `execCapture`, `isGitAvailable` y `getGitConfig` desde `cli.ts` para permitir testing directo.
**Justificación:** Los tests originales replicaban la regex de validación internamente en lugar de testear la función real. Exportar estas funciones permite tests unitarios directos, más robustos y que evolucionan junto con el código fuente. El trade-off (exponer API interna) es aceptable porque este es un CLI, no una librería pública.

---

## D003 — Fallback de Git con valores genéricos

**Fecha:** 2026-06-30
**Decisión:** Cuando `user.name`/`user.email` no están configurados globalmente en Git, usar valores temporales (`create-stack-next` / `noreply@create-stack-next`) con un `git -c` para el commit inicial, y mostrar un warning al usuario sugiriendo que configure su Git.
**Justificación:** El CLI no debe fallar con error si el usuario no configuró Git. El commit inicial es ceremonial (marca el punto de inicio del proyecto), así que usar valores genéricos es aceptable. El warning guía al usuario a configurar Git correctamente para futuros commits. La alternativa de hacer solo `git init` sin commit fue descartada porque pierde el beneficio del baseline commit.

---

## D004 — Directorio destino existente vacío: aceptar

**Fecha:** 2026-06-30
**Decisión:** Si el directorio destino ya existe pero está vacío (o solo contiene archivos del sistema como `.DS_Store`), se acepta y se continúa con la generación. Solo se rechaza si el directorio contiene archivos significativos.
**Justificación:** Es común que usuarios creen un directorio vacío antes de ejecutar el scaffolder (por ejemplo, `mkdir my-app && cd my-app && npx create-stack-next my-app`). Rechazar directorios vacíos penaliza este workflow legítimo sin beneficio. Se filtran `.DS_Store` y `Thumbs.db` porque son archivos del sistema operativo que no representan contenido del usuario.

---

## D005 — Ciclo de vida de AGENT_TASKS.md por fases

**Fecha:** 2026-06-30
**Decisión:** El archivo `AGENT_TASKS.md` en la raíz del proyecto funcionará como el "Sprint Plan" exclusivo de la fase de desarrollo actual. Al cambiar de fase, el archivo actual se archivará en `docs/phases/phaseX_tasks.md` y se creará uno nuevo en la raíz.
**Justificación:** Mantiene la raíz del proyecto y el contexto del agente enfocados únicamente en lo que es relevante *ahora*. A su vez, preservar el historial en `docs/phases/` permite la trazabilidad completa del proyecto sin ensuciar el working tree de las sesiones activas.

