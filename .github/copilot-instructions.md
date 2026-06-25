# Copilot — Finanzas Mi Patito 🐣

> **Cómo se usa este archivo:** Copilot lo lee automáticamente al iniciar cada sesión. Define cómo debe comportarse el agente en este repo. Para el **estado vivo** del proyecto (qué está hecho y qué no), Copilot debe consultar `docs/progress/STATUS.md`. Para decisiones arquitectónicas tomadas, `docs/progress/DECISIONS.md`. Para registrar cambios después de iterar, `docs/progress/CHANGELOG.md`.

---

## PARTE A — Guidelines de comportamiento

Reducen errores comunes de LLMs al programar. **Sesgan hacia precaución sobre velocidad.** Para tareas triviales, usa juicio.

### 1. Pensar antes de codear

**No asumas. No escondas la confusión. Saca los tradeoffs a la luz.**

Antes de implementar:

- Enuncia tus suposiciones explícitamente. Si dudas, pregunta.
- Si existen múltiples interpretaciones, preséntales — no elijas en silencio.
- Si existe un enfoque más simple, dilo. Empuja para atrás cuando corresponda.
- Si algo no está claro, detente. Nombra qué es confuso. Pregunta.

### 2. Simplicidad primero

**El mínimo de código que resuelve el problema. Nada especulativo.**

- No agregues features más allá de lo pedido.
- No crees abstracciones para código de un solo uso.
- No agregues "flexibilidad" o "configurabilidad" no solicitada.
- No manejes errores para escenarios imposibles.
- Si escribiste 200 líneas y podían ser 50, reescríbelo.

Pregúntate: _"¿Un senior diría que esto está sobrecomplicado?"_ Si sí, simplifica.

### 3. Cambios quirúrgicos

**Toca solo lo que debes. Limpia solo tu propio desorden.**

Al editar código existente:

- No "mejores" código, comentarios o formato adyacentes.
- No refactorices cosas que no están rotas.
- Iguala el estilo existente, aunque lo harías distinto.
- Si notas dead code no relacionado, menciónalo — no lo borres.

Cuando tus cambios creen huérfanos:

- Elimina imports/variables/funciones que **tus** cambios dejaron sin uso.
- No borres dead code preexistente salvo que te lo pidan.

**La prueba:** cada línea cambiada debe trazarse directamente al pedido del usuario.

### 4. Ejecución guiada por objetivo

**Define criterios de éxito. Itera hasta verificar.**

Transforma tareas en metas verificables:

- "Agrega validación" → "Escribe tests para inputs inválidos, luego hazlos pasar"
- "Arregla el bug" → "Escribe un test que lo reproduzca, luego hazlo pasar"
- "Refactoriza X" → "Asegura que los tests pasen antes y después"

Para tareas multi-paso, enuncia un plan breve:

```
1. [Paso] → verificar: [check]
2. [Paso] → verificar: [check]
3. [Paso] → verificar: [check]
```

Criterios fuertes permiten iterar de forma independiente. Criterios débiles ("que funcione") requieren clarificación constante.

**Estas guidelines funcionan si:** menos cambios innecesarios en diffs, menos rewrites por sobrecomplicación, y las preguntas aclaratorias llegan **antes** de implementar, no después de equivocarse.

---

## PARTE B — Contexto del proyecto

### Asignatura y equipo

- **Asignatura:** TPY1101 Taller Aplicado de Programación 801D, Duoc UC, 2026-1
- **Profesor:** Diego Patricio Cares Gonzalez
- **Metodología:** Scrum, sprints semanales

| Nombre             | GitHub                                                         | Rol                | Owner técnico de                                |
| ------------------ | -------------------------------------------------------------- | ------------------ | ----------------------------------------------- |
| Agustín Bahamondes | [@AbsolucionArtistica](https://github.com/AbsolucionArtistica) | PO / Analista      | Modelo de datos, reglas de negocio              |
| Joaquín Fernández  | [@Folaquito](https://github.com/Folaquito)                     | Frontend Developer | Frontend (cuando exista), UX, integraciones API |
| Diego Bahamondez   | [@Eth3rn4l](https://github.com/Eth3rn4l)                       | Backend Developer  | Spring Boot, persistencia, seguridad            |

**Regla de ownership:** si tu cambio toca responsabilidad de otro miembro, propón el cambio en el PR y pide review explícita del owner correspondiente.

### Dominio: Finanzas Mi Patito

Plataforma web de finanzas personales con educación financiera activa.

**Funcionalidades clave del producto:**

- **Regla 50/30/20** — 50% necesidades, 30% deseos, 20% ahorro/inversión. Distribución automática del ingreso.
- **Presupuesto Base Cero (PBZ)** — cada peso del ingreso debe tener un destino asignado.
- **Centralización de movimientos** — historial consolidado de transacciones (datos simulados o CSV importado, **NO integración bancaria real**).
- **Proyecciones de ahorro** — gráficos de crecimiento patrimonial basados en histórico.

**Fuera de alcance del proyecto:** APIs bancarias reales, app móvil nativa, multi-moneda, multi-idioma.

### Pedido del profesor: arquitectura de microservicios

El profesor pidió **arquitectura de microservicios**. El estado actual del código es un **monolito Spring Boot** porque empezamos a generar código con Copilot sin instructions definidas. Esta brecha es real y debe resolverse antes de EP3 (Estado de avance N°3, semana 15). Ver `docs/progress/DECISIONS.md` para el plan de migración a microservicios.

**Cuando Copilot genere código nuevo:** debe priorizar diseño que facilite la futura separación (paquetes por bounded context, no acoplamiento entre services de distintos dominios, eventos de dominio en lugar de llamadas directas cuando sea razonable).

---

## PARTE C — Estado actual del repositorio

> **Importante:** la sección detallada y viva está en `docs/progress/STATUS.md`. Esta es solo una vista resumida. Si Copilot necesita detalles, leer ese archivo.

### Lo que existe (monolito Spring Boot, branch `master`)

- **Stack:** Java 21, Spring Boot 3.5.14, Maven (sin wrapper), H2 in-memory.
- **Ubicación del código:** `backend/` (módulo Maven independiente). El frontend, cuando exista, irá en `frontend/`.
- **Package base:** `com.finanzas` (NO `cl.duoc.finanzas` como mencionaba la versión anterior de este archivo).
- **Capas:** `controller → service (interface) → service.impl → repository → model`.
- **Entidades JPA:** `Usuario`, `Cuenta`, `Categoria`, `Transaccion`, `Meta`.
- **Enums:** `TipoCategoria` (NECESIDAD, DESEO, AHORRO), `TipoTransaccion` (INGRESO, GASTO), `TipoMovimiento` (TRANSFERENCIA, PAGO, DEPOSITO).
- **DTOs en `com.finanzas.dto`:** Usuario, Cuenta, Meta, Transaccion, Resumen.
- **Endpoints (base `/api`):** CRUD de usuarios, cuentas, categorías, transacciones, metas + `GET /api/resumen/{usuarioId}`.
- **Seed inicial:** `DataLoader` crea `admin@patito.com / password`, una cuenta y una meta.
- **Manejo de errores:** `@RestControllerAdvice` global en `GlobalExceptionHandler`.

### Lo que NO existe todavía

- **Frontend** (carpeta `frontend/` vacía con `.gitkeep`).
- **Tests** (sin `src/test/`, cobertura 0%).
- **JWT / autenticación funcional** — `SecurityConfig` hace `permitAll()`, solo BCrypt para passwords.
- **Lógica regla 50/30/20** — el enum existe pero no hay servicio que calcule distribución.
- **Importación CSV** — `Transaccion` tiene campos preparados (bancoOrigen/Destino, etc.) pero no hay endpoint.
- **Proyecciones de ahorro.**
- **OpenAPI/Swagger.**
- **Microservicios** — ver decisión pendiente abajo.
- **Maven wrapper.**
- **PostgreSQL para producción** (solo H2 en `application.properties`).
- **Ownership check** — cualquier llamada puede leer/escribir datos de cualquier usuario (no hay filtro por user autenticado).

### Decisiones tomadas (no las cuestiones sin razón fuerte)

| Decisión                                         | Razón                                                                                                                       |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Package `com.finanzas` (no `cl.duoc.finanzas`)   | Ya está en todo el código, refactor sería costoso                                                                           |
| Enums en español (`NECESIDAD/DESEO/AHORRO`)      | Coherencia con resto del código y dominio                                                                                   |
| Lombok declarado en `pom.xml` pero **no se usa** | Pendiente decidir entre quitarlo o adoptarlo. Hoy todas las clases tienen getters/setters manuales. **No mezclar** estilos. |
| H2 in-memory para dev                            | Simple para iterar, pero **falla IL2.2** del PA (ambiente prueba debe replicar producción)                                  |
| Inyección por constructor con `final`            | Estándar Spring moderno, ya aplicado                                                                                        |

### Decisiones PENDIENTES (Copilot debe preguntar antes de asumir)

1. **¿Migrar a microservicios o documentar como "monolito modular"?** El profesor pidió microservicios. Ver `DECISIONS.md` para análisis.
2. **¿Implementar JWT o quedarse con permitAll por ahora?** El README declara JWT, el código no lo tiene.
3. **¿Lombok sí o no?** Está en `pom.xml` sin uso real.
4. **¿Frontend con qué stack?** El README dice React + Vite, pero la carpeta está vacía. Decidir antes de empezar.
5. **¿PostgreSQL para perfil `prod` cuándo?** Sin esto, no se cumple IL2.2.
6. **¿Comunicación inter-servicios** (si vamos a microservicios): REST síncrono / eventos asíncronos / API Gateway?

---

## PARTE D — Reglas técnicas estrictas

### Backend (Java + Spring Boot)

- **Arquitectura por capas:** `controller → service → repository → model`. Las capas no se saltan.
- **Entidades JPA NO se exponen en respuestas REST.** Siempre vía DTOs.
  - Excepción actual conocida: `CategoriaController` recibe `Categoria` directo. **No replicar este patrón** en código nuevo. Si tocas categorías, considera migrar a `CategoriaDTO` (registrarlo en `CHANGELOG.md`).
- **Inyección por constructor con `final`**, nunca `@Autowired` en campos.
- **Validación con `jakarta.validation`** (`@NotNull`, `@Positive`, `@Email`) en DTOs, no en lógica de servicio.
- **Excepciones de negocio:** clases custom extendiendo `RuntimeException`. Manejadas centralmente en `GlobalExceptionHandler`.
- **Logger:** SLF4J/Logback. **Nunca `System.out.println`** en código de producción.
- **Money:** `BigDecimal` siempre. **Nunca `double`/`float`** para dinero.
- **Fechas:** UTC en backend (`Instant` o `OffsetDateTime` para timestamps; `LocalDate` para fechas civiles), zona `America/Santiago` solo en presentación.

### Frontend (React, cuando exista)

- **Functional components con hooks**, sin class components.
- **Estado local:** `useState`. **Estado compartido:** Context API (no Redux para este proyecto).
- **Llamadas a API en `services/` o custom hooks**, nunca en componentes directamente.
- **Loading y error states explícitos** en cada llamada async.
- **Comillas simples en JS, dobles en JSX** (regla Prettier).
- **CSS:** módulos CSS o vanilla. Tailwind requiere acuerdo de equipo.

### Dominio financiero (no negociable)

- **Moneda:** Pesos chilenos (CLP), **sin decimales** (Chile no usa centavos en transacciones cotidianas).
- **Cálculos 50/30/20:** suman exactamente al 100% del ingreso. **Test obligatorio** que verifique esto cuando se implemente.
- **Categorización:** enum cerrado backend. Hoy en español: `NECESIDAD`, `DESEO`, `AHORRO`. La traducción no aplica (ya está en español).
- **Redondeo:** definir y testear edge cases (ingreso $0, ingreso impar, montos enormes) cuando se implemente la lógica.

---

## PARTE E — Naming y commits

### Java / Spring Boot

- Clases en `PascalCase` con sufijo claro: `UsuarioService`, `TransaccionRepository`, `MetaController`, `CuentaDTO`.
- Métodos en `camelCase`, verbo en imperativo: `findUsuarioByEmail`, `calcularDistribucionPresupuesto`.
- **Tests** (cuando existan): `should_<resultadoEsperado>_when_<condicion>()`.
  - Ejemplo: `should_lanzarSaldoInsuficiente_when_montoExcedeDisponible()`.
- Constantes en `UPPER_SNAKE_CASE`.
- Excepciones terminan en `Exception`.

### React / JavaScript (futuro)

- Componentes en `PascalCase`: `ListaTransacciones`, `GraficoPresupuesto`.
- Hooks empiezan con `use`: `useAuth`, `useTransacciones`.
- Servicios REST en `camelCase`: `usuarioService`, `transaccionService`.
- Booleanas: `estaAutenticado`, `tieneTransacciones`, `puedeEditarPresupuesto`.

### Git

- **Branches:** `feature/<descripcion-corta>`, `fix/<descripcion-corta>`, `docs/<descripcion-corta>`, `refactor/<descripcion-corta>`.
- **Conventional Commits en español:**

```
feat: agregar autenticación JWT al microservicio auth
fix: corregir redondeo en cálculo del 50/30/20 cuando ingreso es impar
docs: documentar endpoints de transacciones con OpenAPI
refactor: extraer cálculo de proyección a PresupuestoProyeccionService
test: agregar pruebas de integración del flujo de login
chore: actualizar Spring Boot de 3.5.14 a 3.5.15
perf: agregar índice (cuenta_id, fecha) en transacciones
build: configurar Dockerfile multi-stage para auth-service
```

- Imperativo, presente, sin punto final, máximo 72 caracteres en el subject.
- Un commit, un cambio coherente. Si describes con "y", probablemente son dos commits.
- Squash & merge en `master`.

---

## PARTE F — Testing

**Cobertura objetivo:** 80% mínimo (declarada en README, hoy 0% — gap conocido).

Cuando se agreguen tests:

- Unitarios con Mockito para services y controllers.
- Integración con `@SpringBootTest` para flujos críticos:
  - Crear usuario → verificar BCrypt aplicado.
  - Crear transacción → verificar saldo de cuenta actualizado correctamente.
  - GET resumen → verificar suma correcta de ingresos/gastos.
- **Tests de matemática financiera obligatorios** cuando se implemente 50/30/20: redondeo, sumas exactas, edge cases.
- Frontend (cuando exista): tests de comportamiento, no de implementación interna.
- Nunca commitear tests con `@Disabled` sin un `TODO` con razón y fecha.

---

## PARTE G — Seguridad

- **Contraseñas:** BCrypt con cost factor 10+ (default Spring). Nunca SHA, nunca texto plano. ✅ Ya implementado.
- **JWT (cuando se implemente):** firmado con HS256 o superior. Secret en variable de entorno, **nunca hardcoded**.
- **Endpoints públicos** (cuando JWT esté activo): solo `/auth/login`, `/auth/register`, `/swagger-ui/**`, `/v3/api-docs/**`. Todo lo demás requiere JWT válido.
- **CORS:** configurado solo para el origin del frontend en cada ambiente. Sin `allowedOrigins("*")`.
- **Ownership check:** todo endpoint que reciba `usuarioId` o `cuentaId` debe verificar que el caller tiene acceso a ese recurso. **Hoy no existe** — gap conocido, registrarlo en `STATUS.md`.
- **Validación de input:** todo DTO request validado con `@Valid` en el controller.
- **Logs:** **nunca loguear** contraseñas, tokens JWT, datos personales sensibles.
- **Secretos:** nunca commitear `.env`, `application-prod.yml` con credenciales. Usar `@Value("${var.name}")` con env vars.

---

## PARTE H — Pull Requests

- **Una sola responsabilidad por PR.** Si toca más de 10 archivos, evalúa dividirlo.
- **Descripción obligatoria:** qué cambió, por qué, cómo probarlo, capturas si aplica al frontend.
- **Tests obligatorios** para nueva lógica de negocio (especialmente cálculos financieros).
- **Review obligatoria del owner correspondiente:**
  - Cambios en backend (`backend/src/main/java/com/finanzas/`) → review de Diego.
  - Cambios en frontend (`frontend/`) → review de Joaquín.
  - Cambios en modelo de datos o reglas de negocio → review de Agustín.
- **Squash & merge** para mantener historial limpio en `master`.
- **Antes de mergear:** actualizar `docs/progress/CHANGELOG.md` con un resumen del PR.

---

## PARTE I — Carpeta `docs/progress/` (memoria viva del proyecto)

**Esto es importante para Copilot en modo agente.** Después de cada iteración significativa, actualizar:

| Archivo        | Contenido                                                                                                  | Cuándo actualizar                             |
| -------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `STATUS.md`    | Estado vivo: qué existe, qué no, gaps por capa, cobertura tests, deuda técnica conocida                    | Cada PR que cambie funcionalidad o estructura |
| `DECISIONS.md` | Decisiones arquitectónicas tomadas (ADRs ligeros): qué se decidió, alternativas consideradas, razón, fecha | Cuando se resuelve una decisión pendiente     |
| `CHANGELOG.md` | Registro cronológico: fecha, autor, PR, qué cambió                                                         | Después de cada merge a `master`              |

**Regla para Copilot:** al iniciar una nueva tarea, **leer primero `STATUS.md` y `DECISIONS.md`** para no asumir cosas falsas (ej: "ya hay JWT" cuando no lo hay). Después de implementar, **proponer al usuario actualizar los archivos correspondientes** antes de cerrar la iteración.

---

## PARTE J — Comandos del proyecto

```bash
# Backend (desde backend/)
cd backend
mvn -DskipTests package          # Build sin tests
mvn spring-boot:run              # Levantar app en localhost:8080
mvn test                         # Tests (cuando existan)
mvn test -Dtest=ResumenServiceTest  # Test de una clase específica

# H2 console (con app corriendo)
# http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:finanzas_db
# User: sa, Password: (vacío)

# Frontend (cuando exista, desde frontend/)
# Pendiente: definir comandos según stack elegido (ADR-006)

# Docker compose (actualmente desalineado con el código — ver STATUS.md)
docker compose up -d
docker compose down
```

---

## Versionado de este archivo

- **2026-05-07:** reescritura completa. Refleja estado real del repo (monolito en `com.finanzas`), agrega guidelines Karpathy, define convención `docs/progress/`, documenta decisiones pendientes incluyendo migración a microservicios pedida por el profesor. Backend reorganizado a la carpeta `backend/` (ver ADR-008).
