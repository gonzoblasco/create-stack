# Roadmap: Camino a la v1.0.0 🚀

Este documento detalla el plan de acción estratégico para llevar `create-stack-next` desde su estado actual de MVP hacia su primera versión estable (v1.0.0) lista para la adopción masiva.

---

## 📍 Estado Actual (v0.3.x)
- ✅ **M1 (MVP):** Scaffolder base funcional (Next.js 15, Biome, Vitest, Playwright).
- ✅ **M2 (AI-Native):** Integración nativa para agentes IA (`AGENTS.md`, `.openclaw/`).
- ✅ **M4 Lite:** Documentación básica de README y decisiones (ADRs) persistentes.

---

## 🎯 Definición de "Estabilidad v1.0.0"
La versión 1.0.0 significa que el CLI es **robusto, a prueba de balas en cualquier entorno local**, la API de comandos está congelada (sin breaking changes previstos), y el ecosistema documental permite la adopción orgánica sin intervención nuestra.

Para alcanzar esto, dividiremos el trabajo en las siguientes tres fases:

### 🛠️ Fase 1: Robustez Absoluta y Cobertura (v0.4.x - v0.5.x)
*El objetivo es que el CLI nunca falle de manera inesperada ("crash") bajo ninguna condición local.*

- [x] **Testing Exhaustivo del Scaffolder:** Llevar la cobertura de `cli.test.ts` e `integration.test.ts` para abarcar todos los flujos críticos.
- [ ] **Garantía Multi-Package Manager:** Validar y soportar oficialmente la generación de proyectos usando `npm`, `pnpm`, `yarn` y `bun`. *(Parsing de flags OK; tests de integración multi-PM pospuestos)*
- [x] **Edge Cases de File System:** Manejo amigable y validación temprana si el directorio destino ya existe, no está vacío, o carece de permisos.
- [x] **Robustez en Inicialización Git:** Fallbacks limpios para `--git` cuando el usuario no tiene configurado su entorno global de Git (`user.name` / `user.email`).

### ✨ Fase 2: Flexibilidad Interna y DX (v0.6.x - v0.8.x)
*El objetivo es refinar la Experiencia del Desarrollador (DX) al usar el comando y dar soporte a estructuras más complejas.*

- [ ] **Soporte Oficial para Workspaces:** Detección automática y configuración sin fricción si el CLI se ejecuta dentro de un monorepo (Turborepo, pnpm workspaces, etc.).
- [ ] **Pulido Visual del CLI:** Mejorar la salida en terminal (spinners atractivos, colores semánticos, mensajes de progreso claros, y un bloque de "Próximos pasos" impecable).
- [ ] *(Opcional)* **Templates Internos M5:** Introducción del flag `--template api` para generar un proyecto exclusivamente backend sin React.

### 📚 Fase 3: Adopción y Documentación (v0.9.x)
*El objetivo es preparar el proyecto para el mundo exterior y escalar su uso.*

- [ ] **Sitio Web de Documentación:** Migrar de un simple README a una web de docs interactiva (usando VitePress o Nextra).
- [ ] **Material de Onboarding:** Grabación y publicación de un video demo (2-4 min) mostrando la integración perfecta entre el scaffolder y OpenClaw.
- [ ] **Release Candidate (v1.0.0-rc):** Congelamiento de nuevas features. Llamado a beta testers para probar la herramienta en la vida real.

---

## 🏁 Lanzamiento v1.0.0
- Publicación oficial de la versión estable en npm.
- Release Notes detalladas.
- Distribución comunitaria (sumisión a "Awesome Next.js", "Awesome AI", posts en redes).

---

## 🔮 Futuro (Post v1.0.0)
*(Ver `FUTURE.md` para más detalles)*
Una vez alcanzada la estabilidad v1.0.0, se desbloquearán iniciativas mayores como la creación de la familia de scaffolders (`create-stack-remix`, `create-stack-astro`) y la delegación de tareas automatizadas a sub-agentes de OpenClaw.
