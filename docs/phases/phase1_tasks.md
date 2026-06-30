# AGENT_TASKS.md — Fase 1: Robustez Absoluta y Cobertura

> Guía de proceso para agentes de IA trabajando en la Fase 1 del roadmap (v0.4.x - v0.5.x).
>
> Este documento complementa al `AGENTS.md` del template y se enfoca exclusivamente en las tareas de robustez y cobertura del CLI scaffolder.

---

## 🎯 Objetivo de la Fase 1

**El CLI nunca debe fallar de manera inesperada ("crash") bajo ninguna condición local.**

Esto implica:
1. Testing exhaustivo de todos los flujos del scaffolder
2. Soporte confiable para `npm`, `pnpm`, `yarn` y `bun`
3. Manejo amigable de edge cases del file system
4. Inicialización Git robusta con fallbacks limpios

---

## 📋 Workflow Obligatorio por Tarea

Antes de implementar CUALQUIER tarea de esta fase, el agente DEBE seguir este ciclo:

1. **Leer contexto**: `docs/decisions.md`, `CHANGELOG.md`, `ROADMAP.md`
2. **Verificar estado actual**: Correr `npm run test:run` para confirmar que todo pasa antes de tocar código
3. **Implementar** siguiendo las convenciones del `AGENTS.md` del template
4. **Testear**: Escribir tests ANTES o JUNTO con el código (no después)
5. **Lint**: Correr `npm run lint:fix` tras cada modificación
6. **Typecheck**: Correr `npm run typecheck` para verificar tipos
7. **Documentar**: Actualizar `docs/decisions.md` (ADR) si se tomó una decisión técnica
8. **Changelog**: Registrar cambios en `CHANGELOG.md` bajo `[Unreleased]`

---

## 📐 Decisiones de Diseño Aprobadas

| # | Decisión | Resolución |
|---|----------|------------|
| D002 | Exportar funciones internas (`validateProjectName`, `execInDir`) | ✅ Aprobado — para testabilidad directa |
| D003 | Fallback Git sin `user.name`/`user.email` | ✅ Opción A — usar valores genéricos (`create-stack-next` / `noreply@create-stack-next`) con warning |
| D004 | Directorio destino existente vacío | ✅ Aceptar y continuar generación. Solo rechazar si NO está vacío |
| D005 | Tests multi-PM en CI | ⏸️ Pospuesto a fase posterior. Tests locales usan `skipIf` si el PM no está disponible |

---

## 🛠️ Épica 1: Testing Exhaustivo del Scaffolder

### Archivos involucrados
- `src/test/cli.test.ts`
- `src/test/copy-template.test.ts`
- `src/test/integration.test.ts`

### Tareas

#### 1.1 Ampliar `cli.test.ts`

**Estado actual:** 13 tests que validan parsing de args y regex de nombres (sin usar `validateProjectName` directamente).

**Tests nuevos requeridos:**
- [ ] Importar y testear `validateProjectName` directamente
- [ ] Nombre vacío (`""`) → `{ ok: false }`
- [ ] Nombre con caracteres especiales (`@scope/name`, `my-app!`, `foo/bar`) → `{ ok: false }`
- [ ] Directorio existente NO vacío → `{ ok: false, reason: "...ya existe" }`
- [ ] Directorio existente VACÍO → `{ ok: true }`
- [ ] Nombre que empieza con `-` → `{ ok: false }`
- [ ] `parseArgs` con múltiples flags combinadas (`--no-git --no-install --pm pnpm`)

**Criterio de aceptación:** Cobertura completa de `validateProjectName` y `parseArgs`.

#### 1.2 Ampliar `copy-template.test.ts`

**Estado actual:** 2 tests (nombre en package.json + PM en README).

**Tests nuevos requeridos:**
- [ ] Verificar que todos los archivos del template se copian (comparar `listFiles(templateDir)` vs `listFiles(targetDir)`)
- [ ] Verificar que dotfiles se copian (`.gitignore`, `.openclaw/`, `.agents/`, `.github/`, `.vscode/`)
- [ ] Verificar que archivos sin placeholders no se modifican (comparar contenido byte a byte)
- [ ] Verificar que paths anidados profundos existen (`docs/`, `src/app/`, `tests/e2e/`)

**Criterio de aceptación:** La copia del template es verificada exhaustivamente.

#### 1.3 Ampliar `integration.test.ts`

**Estado actual:** 1 test que genera un proyecto con `npm` y corre lint/typecheck/test/build.

**Tests nuevos requeridos (condicionales):**
- [ ] Generación con `pnpm` (skip si no está instalado)
- [ ] Generación con `yarn` (skip si no está instalado)
- [ ] Generación con `bun` (skip si no está instalado)

> **Nota:** Estos tests multi-PM se posponen a una fase posterior según decisión del usuario. En esta fase solo se deja la estructura preparada con `it.skip`.

**Criterio de aceptación:** Test de `npm` robusto + placeholders para otros PMs.

---

## 🛠️ Épica 2: Garantía Multi-Package Manager

> ⏸️ **Pospuesto a fase posterior** según decisión del usuario.
> Solo se valida que el flag `--pm` parsea correctamente y que `runInstall` construye el comando correcto.

### Tareas mínimas para esta fase
- [ ] Tests unitarios de `parseArgs` ya cubren validación de `--pm` ✅
- [ ] Agregar test que verifique que el output de "Próximos pasos" muestra el PM correcto

---

## 🛠️ Épica 3: Edge Cases de File System

### Archivos involucrados
- `src/cli.ts` (modificar `validateProjectName`)

### Tareas

#### 3.1 Directorio existente vacío → permitir

**Cambio en `validateProjectName`:**
```typescript
// Antes: rechaza si existe
if (existsSync(name)) {
  return { ok: false, reason: `El directorio "${name}" ya existe` };
}

// Después: rechaza solo si existe Y no está vacío
if (existsSync(name)) {
  const entries = readdirSync(name);
  // Permitir .DS_Store y similares
  const meaningful = entries.filter(e => !e.startsWith('.DS_'));
  if (meaningful.length > 0) {
    return { ok: false, reason: `El directorio "${name}" ya existe y no está vacío` };
  }
}
```

#### 3.2 Validación de permisos de escritura

**Nuevo chequeo antes de crear el directorio:**
```typescript
// Verificar que el directorio padre tiene permisos de escritura
try {
  accessSync(dirname(resolve(name)), constants.W_OK);
} catch {
  return { ok: false, reason: `Sin permisos de escritura en "${dirname(resolve(name))}"` };
}
```

#### 3.3 Tests para edge cases de FS

- [ ] Directorio existente no vacío → error con mensaje claro
- [ ] Directorio existente vacío → OK
- [ ] Directorio existente con solo `.DS_Store` → OK

---

## 🛠️ Épica 4: Robustez en Inicialización Git

### Archivos involucrados
- `src/cli.ts` (modificar `runGitInit`)
- `src/test/git.test.ts` (nuevo)

### Tareas

#### 4.1 Detectar si Git está instalado

```typescript
async function isGitAvailable(): Promise<boolean> {
  try {
    await execInDir("git", ["--version"], process.cwd());
    return true;
  } catch {
    return false;
  }
}
```

#### 4.2 Detectar y manejar `user.name` / `user.email`

```typescript
async function getGitConfig(key: string): Promise<string | null> {
  try {
    // Capturar stdout en vez de heredar
    const value = await execCapture("git", ["config", "--global", key]);
    return value.trim() || null;
  } catch {
    return null;
  }
}
```

#### 4.3 Fallback con valores genéricos

```typescript
async function runGitInit(projectDir: string): Promise<void> {
  // 1. Verificar que git está disponible
  if (!(await isGitAvailable())) {
    logStep("⚠️", "Git no encontrado. Saltando inicialización git.");
    logStep("💡", `Instalá Git y corré ${pc.cyan("git init")} manualmente.`);
    return;
  }

  await execInDir("git", ["init", "-b", "main"], projectDir);
  await execInDir("git", ["add", "."], projectDir);

  // 2. Verificar user.name/user.email
  const userName = await getGitConfig("user.name");
  const userEmail = await getGitConfig("user.email");

  if (!userName || !userEmail) {
    logStep("⚠️", "Git user.name/user.email no configurados. Usando valores temporales.");
    await execInDir(
      "git",
      [
        "-c", "user.name=create-stack-next",
        "-c", "user.email=noreply@create-stack-next",
        "commit", "-m", "chore: initial commit from create-stack-next",
      ],
      projectDir,
    );
    logStep("💡", `Configurá tu Git: ${pc.cyan("git config --global user.name \"Tu Nombre\"")}`);
  } else {
    await execInDir(
      "git",
      ["commit", "-m", "chore: initial commit from create-stack-next"],
      projectDir,
    );
  }
}
```

#### 4.4 Tests de Git (`src/test/git.test.ts`)

- [ ] Mock de `execInDir` para simular git no disponible → verifica warning
- [ ] Mock para simular `user.name`/`user.email` no configurados → verifica fallback
- [ ] Test de `--no-git` → verifica que `runGitInit` no se ejecuta
- [ ] Test de flujo exitoso completo

---

## 📚 Documentación Requerida

Al completar CADA épica, actualizar:

1. **`docs/decisions.md`** — Nuevo ADR para cada decisión técnica tomada
2. **`CHANGELOG.md`** — Bajo `[Unreleased]`:
   - `Added`: tests nuevos, `AGENT_TASKS.md`
   - `Changed`: validaciones mejoradas, Git robusto
   - `Fixed`: edge cases de FS
3. **`ROADMAP.md`** — Marcar tareas completadas con `[x]`

---

## ✅ Criterios de "Done" para la Fase 1

- [ ] `npm run test:run` pasa al 100%
- [ ] `npm run typecheck` sin errores
- [ ] `npm run lint` sin errores
- [ ] `validateProjectName` cubre: nombre vacío, caracteres inválidos, directorio existente vacío/no vacío, permisos
- [ ] `runGitInit` no crashea bajo ninguna condición (git no instalado, user no configurado)
- [ ] Todos los archivos del template se copian correctamente (verificado por test)
- [ ] ADRs documentados (D002, D003, D004)
- [ ] CHANGELOG actualizado
- [ ] ROADMAP Fase 1 checklist marcada como completada

---

**Última actualización:** 2026-06-30
**Fase:** 1 de 3 (Robustez Absoluta y Cobertura)
**Versión target:** v0.4.0 - v0.5.0
