# Test Spec — create-stack-next

> Este documento define el alcance, profundidad y criterios de calidad de los tests del scaffolder.

**Estado:** 📝 Borrador inicial  
**Fecha:** 2026-06-28  
**Objetivo:** Asegurar que el scaffolder genera proyectos correctos y que el CLI funciona como se espera.

---

## 1. Alcance de los tests

### Qué se testea

- El **CLI** (`src/cli.ts`, `src/parse-args.ts`)
- La **copia de template** (`src/copy-template.ts`)
- La **generación completa** de un proyecto (integración)
- Validaciones de **entrada** (nombres de proyecto, flags)

### Qué NO se testea (por ahora)

- El template generado (eso ya se valida manualmente al generar `my-test-app`)
- Comportamiento de OpenClaw / prompts (eso es del proyecto generado)
- Performance del scaffolder

---

## 2. Niveles de testing

### 2.1 Unitarios (CLI y parse-args)

**Objetivo:** Validar la lógica de parsing de argumentos y mensajes de error.

**Casos a cubrir:**

- `create-stack-next mi-app` → usa defaults (`--git`, `--install`, `npm`)
- `create-stack-next mi-app --no-git` → no inicializa git
- `create-stack-next mi-app --no-install` → no corre npm install
- `create-stack-next mi-app --package-manager pnpm` → usa pnpm
- Nombre inválido:
  - `MiApp` (mayúsculas)
  - `mi app` (espacios)
  - `mi-app!` (caracteres especiales)
  - `node_modules` (nombre reservado)
- Sin argumento → muestra usage y sale con código 1

**Archivo:** `src/test/cli.test.ts`

---

### 2.2 Unitarios (copy-template)

**Objetivo:** Validar que los archivos se copian correctamente y que los placeholders se reemplazan.

**Casos a cubrir:**

- Copia todos los archivos del template
- Reemplaza `{{PROJECT_NAME}}` en `package.json`, `README.md`, etc.
- Reemplaza `{{PM}}` según el package manager elegido
- Maneja correctamente paths anidados
- No copia archivos que deberían ignorarse (si aplica)

**Archivo:** `src/test/copy-template.test.ts`

---

### 2.3 Integración (generación completa)

**Objetivo:** Validar que un proyecto generado pasa todos los checks de calidad.

**Flujo:**

1. Generar un proyecto en una carpeta temporal (`my-test-app`)
2. Entrar a la carpeta
3. Correr:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run test:run`
   - `npm run build`
4. Verificar que todos pasan sin errores

**Archivo:** `src/test/integration.test.ts`

---

### 2.4 Edge cases

- El directorio destino ya existe y no está vacío → debe fallar con mensaje claro
- Node.js < 20 → debe mostrar mensaje de versión mínima y salir
- Error durante `npm install` → debe reportar el error correctamente

---

## 3. Criterios de calidad

Un test suite se considera **suficiente** cuando:

- [ ] Cubre los paths principales del CLI (flags por defecto + combinaciones comunes)
- [ ] Cubre los casos de error más probables (nombre inválido, directorio existente)
- [ ] La generación completa (`integration`) pasa `lint`, `typecheck`, `test:run` y `build`
- [ ] Los tests corren en menos de 60 segundos en CI
- [ ] Los tests usan carpetas temporales y no dejan basura

---

## 4. Herramientas y convenciones

- **Runner:** Vitest (ya está como devDependency)
- **Temporales:** Usar `os.tmpdir()` + nombres únicos
- **Ejecución del CLI:** Usar `node ./dist/index.js` (después de build) o compilar en memoria
- **Assertions:** `expect` de Vitest + `fs.existsSync`, `fs.readFileSync`
- **Cleanup:** Borrar las carpetas temporales después de cada test (o usar `afterAll`)

---

## 5. Orden de implementación recomendado

1. `cli.test.ts` (parsing + validaciones)
2. `copy-template.test.ts` (reemplazo de placeholders)
3. `integration.test.ts` (generación completa + checks)
4. Edge cases (directorio existente, Node version)

---

## 6. Próximos pasos

1. Aprobar este spec
2. Implementar `cli.test.ts`
3. Implementar `copy-template.test.ts`
4. Implementar `integration.test.ts`
5. Agregar a CI (GitHub Actions)

---

**Nota:** Este spec es vivo. Se puede ajustar durante la implementación si aparecen casos que no estaban contemplados.