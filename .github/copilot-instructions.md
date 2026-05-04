# GitHub Copilot — Finanzas Mi Patito 🐣

## Contexto del proyecto

**Asignatura:** Taller Aplicado de Programación 801D — Duoc UC, 2026
**Profesor:** Diego Patricio Cares Gonzalez
**Metodología:** Scrum con sprints semanales

### Equipo y roles

| Nombre             | Rol                      | GitHub                                                         | Responsabilidad técnica                                          |
| ------------------ | ------------------------ | -------------------------------------------------------------- | ---------------------------------------------------------------- |
| Agustín Bahamondes | Product Owner / Analista | [@AbsolucionArtistica](https://github.com/AbsolucionArtistica) | Requerimientos, modelo de datos, validación de reglas de negocio |
| Joaquín Fernández  | Frontend Developer       | [@Folaquito](https://github.com/Folaquito)                     | React SPA, consumo de APIs, UX                                   |
| Diego Bahamondez   | Backend Developer        | [@Eth3rn4l](https://github.com/Eth3rn4l)                       | Microservicios Spring Boot, persistencia, seguridad JWT          |

Cuando el código toque responsabilidad de otro miembro, Copilot debe sugerir **comentar el cambio en el PR** para review explícita del owner correspondiente.

### Dominio del problema

Finanzas Mi Patito es una plataforma web de **finanzas personales con educación financiera activa**:

- **Regla 50/30/20:** 50% necesidades, 30% deseos, 20% ahorro/inversión.
- **Presupuesto Base Cero (PBZ):** cada peso del ingreso debe tener un destino asignado.
- **Proyecciones de ahorro:** gráficos de crecimiento patrimonial basados en histórico.
- **Centralización de movimientos:** historial consolidado de transacciones (datos simulados o CSV, **NO integración bancaria real**).

**Fuera de alcance del proyecto:** integración con APIs bancarias reales, app móvil nativa, multi-moneda, multi-idioma.

---

## Stack tecnológico (decidido)

| Capa         | Tecnología                                     | Versión esperada             |
| ------------ | ---------------------------------------------- | ---------------------------- |
| Frontend     | React (SPA) + Vite                             | React 18.x, Vite 5.x         |
| Backend      | Java + Spring Boot (microservicios)            | Java 21 LTS, Spring Boot 3.x |
| Persistencia | Spring Data JPA + H2 (dev) / PostgreSQL (prod) | H2 2.x, PostgreSQL 16        |
| Seguridad    | Spring Security + JWT                          | jjwt 0.12.x                  |
| Testing      | JUnit 5 + Mockito (backend)                    | JUnit Jupiter 5.x            |
| Build        | Maven con wrapper (`./mvnw`)                   | Maven 3.9+                   |
| Versionado   | Git + GitHub                                   | —                            |

**Dependencias prohibidas sin acuerdo de equipo:**

- Lombok (decisión a discutir: simplifica POJOs pero oculta lógica generada).
- Bibliotecas de gráficos pesadas en frontend antes de prototipar con CSS/SVG nativo.
- ORMs alternativos a JPA (MyBatis, jOOQ).

---

## Arquitectura objetivo (3 microservicios)

Según el README, el backend se divide en tres microservicios:

```
backend/src/main/java/cl/duoc/finanzas/
├── auth/          → Autenticación, gestión de usuarios, JWT
├── transactions/  → CRUD de movimientos, importación CSV
└── budget/        → Reglas 50/30/20, PBZ, proyecciones
```

**Decisiones arquitectónicas pendientes** (NO las asumas, Copilot debe preguntar):

- ¿Un único `pom.xml` parent o tres `pom.xml` independientes?
- ¿Cada microservicio en su propio puerto local (8081, 8082, 8083) o un API Gateway delante?
- ¿Cada microservicio con su propia base de datos H2/PostgreSQL o una BD compartida?
- ¿Comunicación inter-servicios via REST síncrono o eventos asíncronos?
- ¿Service Discovery (Eureka, Consul) o configuración estática de URLs?

Si Copilot detecta que se le pide código que requiere alguna de estas decisiones y el repo no las refleja aún, debe preguntar antes de generar.

### Capa de presentación (React SPA)

```
frontend/src/
├── components/    → Componentes UI reutilizables (sin lógica de negocio)
├── pages/         → Componentes de ruta (Dashboard, Login, Budget, etc.)
├── services/      → Clientes REST (uno por microservicio)
├── hooks/         → Custom hooks (useAuth, useTransactions, etc.)
├── context/       → React Context providers (AuthContext)
└── utils/         → Helpers puros (formato de moneda CLP, fechas, cálculos)
```

---

## Reglas técnicas estrictas

### Backend (Java + Spring Boot)

- **Arquitectura por capas:** `controller → service → repository → model`. Las capas no se saltan.
- **Entidades JPA NO se exponen en respuestas REST.** Siempre via DTOs en `dto/request/` y `dto/response/`.
- **Inyección por constructor con `final`**, nunca `@Autowired` en campos.
- **Validación con `jakarta.validation`** (`@NotNull`, `@Positive`, `@Email`) en DTOs, no en lógica de servicio.
- **Excepciones de negocio:** clases custom extendiendo `RuntimeException` con `@ResponseStatus`. Manejadas centralmente con `@RestControllerAdvice`.
- **Paquete base:** `cl.duoc.finanzas.<microservicio>` (auth, transactions, budget).
- **Logger:** SLF4J/Logback. **Nunca `System.out.println`** en código de producción.

### Frontend (React)

- **Functional components con hooks**, sin class components bajo ninguna circunstancia.
- **Estado local:** `useState`. **Estado compartido:** Context API (no Redux para este proyecto).
- **Llamadas a API en `services/` o custom hooks**, nunca en componentes directamente.
- **Loading y error states explícitos** en cada llamada async. Nunca asumir que la red funciona.
- **Comillas simples en JS, dobles en JSX** (regla Prettier).
- **CSS:** módulos CSS o estilos vanilla. Tailwind requiere acuerdo de equipo antes de adoptar.

### Dominio financiero (reglas no negociables)

- **Moneda:** Pesos chilenos (CLP). **Sin decimales** (Chile no usa centavos en transacciones cotidianas).
- **Tipo de dato monetario:** `BigDecimal` en Java, `number` con redondeo controlado en JS. **Nunca `double` o `float`** para dinero.
- **Cálculos 50/30/20:** suman exactamente al 100% del ingreso. Test obligatorio que verifique esto.
- **Categorización:** enum cerrado en backend (`NEEDS`, `WANTS`, `SAVINGS`), traducido a español solo en la capa de presentación.
- **Fechas:** UTC en backend (`Instant` o `OffsetDateTime`), zona horaria America/Santiago en frontend.

---

## Naming conventions

### Java / Spring Boot

- Clases en `PascalCase`. Sufijo claro: `UserService`, `TransactionRepository`, `BudgetController`, `LoginRequest`, `BalanceResponse`.
- Métodos en `camelCase`, verbo en imperativo: `findUserById`, `calculateBudgetDistribution`, `validateTransaction`.
- Tests: `should_<resultadoEsperado>_when_<condición>()`.
  - Ejemplo: `should_throwInsufficientBalance_when_amountExceedsAvailable()`.
- Constantes en `UPPER_SNAKE_CASE`: `MAX_TRANSACTION_AMOUNT`, `DEFAULT_BUDGET_RULE`.
- Excepciones terminan en `Exception`: `InsufficientBalanceException`, `InvalidBudgetRuleException`.

### React / JavaScript

- Componentes en `PascalCase`: `TransactionList`, `BudgetChart`, `LoginForm`.
- Hooks empiezan con `use`: `useAuth`, `useTransactions`, `useBudgetCalculator`.
- Servicios REST en `camelCase`: `authService`, `transactionService`, `budgetService`.
- Variables booleanas: `isAuthenticated`, `hasTransactions`, `canEditBudget`.

### Git

- Branches: `feature/<descripción-corta>`, `fix/<descripción-corta>`, `docs/<descripción-corta>`.
  - Ejemplo: `feature/jwt-authentication`, `fix/budget-calculation-rounding`.
- Commits: Conventional Commits en español (ver sección dedicada abajo).

---

## Conventional Commits en español

```
feat: agregar autenticación JWT al microservicio auth
fix: corregir redondeo en cálculo del 50/30/20 cuando ingreso es impar
docs: documentar endpoints del microservicio transactions con OpenAPI
refactor: extraer cálculo de proyección a BudgetProjectionService
test: agregar pruebas de integración para flujo de login completo
chore: actualizar Spring Boot de 3.3.5 a 3.4.1
perf: agregar índice compuesto (user_id, date) en tabla transactions
build: configurar Dockerfile multi-stage para microservicio auth
```

- Imperativo, presente, sin punto final, máximo 72 caracteres.
- Si hay breaking change, agregar `BREAKING CHANGE:` en el body.
- **Un commit, un cambio coherente.** Si describes con "y", probablemente son dos commits.

---

## Testing

**Cobertura objetivo declarada en README: 80% mínimo (JUnit 5).**

- Tests unitarios con Mockito para services y controllers.
- Tests de integración con `@SpringBootTest` para flujos críticos:
  - Login completo (POST /auth/login → JWT válido).
  - Crear transacción autenticada (con JWT en header).
  - Cálculo de presupuesto 50/30/20 con datos reales.
- Tests de matemática financiera **obligatorios**: redondeo, sumas exactas, edge cases (ingreso $0, ingreso negativo, montos enormes).
- Frontend: tests de comportamiento (qué ve el usuario), no de implementación interna.
- Nunca commitear tests con `@Disabled` o `xit()` sin un comentario `TODO` con razón y fecha.

---

## Seguridad

- **Contraseñas:** BCrypt con cost factor 12 mínimo. Nunca SHA, nunca texto plano.
- **JWT:** firmado con HS256 o superior. Secret en variable de entorno, **nunca hardcoded**.
- **Endpoints públicos:** solo `/auth/login`, `/auth/register`, `/swagger-ui/**`, `/v3/api-docs/**`. Todo lo demás requiere JWT válido.
- **CORS:** configurado solo para el origin del frontend en cada ambiente. Sin `allowedOrigins("*")`.
- **Validación de input:** todo DTO request validado con `@Valid` en el controller.
- **Logs:** **nunca loguear** contraseñas, tokens JWT, datos personales sensibles.

---

## Secretos y configuración

- **Nunca commitear** `.env`, `application-prod.yml` con credenciales, ni archivos sensibles.
- Cada microservicio incluye `.env.example` documentando variables requeridas con valores vacíos.
- Variables de entorno se cargan vía `@Value("${variable.name}")` en Spring o `import.meta.env.VITE_*` en Vite.
- Si descubres un secreto commiteado por error: avisa **inmediatamente** al equipo, rota la credencial, limpia el historial con `git filter-repo`. **Cambiar el secreto compromete la app comprometida.**

El `.gitignore` actual ya excluye `.env` y archivos `.env.local`, mantenerlo así.

---

## Comandos del proyecto

> **Nota:** estos comandos asumen la estructura final del proyecto. Hoy las carpetas
> backend/ y frontend/ están vacías. Cuando Diego inicialice el proyecto Spring Boot
> y Joaquín el proyecto Vite, ajustar esta sección.

```bash
# Backend (desde backend/)
./mvnw clean install                    # Build completo con tests
./mvnw spring-boot:run                  # Levantar microservicio (dev)
./mvnw test                             # Solo tests
./mvnw test -Dtest=BudgetServiceTest    # Test de una clase específica

# Frontend (desde frontend/)
npm install                             # Instalar dependencias
npm run dev                             # Dev server con hot reload (Vite)
npm run build                           # Build de producción
npm run preview                         # Preview del build de producción
npm test                                # Tests con Vitest

# Stack completo (cuando exista docker-compose.yml)
docker-compose up -d                    # Levantar todo en background
docker-compose logs -f auth             # Ver logs del microservicio auth
docker-compose down                     # Detener todo
```

---

## Pull Requests

- **Una sola responsabilidad por PR.** Si toca más de 10 archivos, evalúa dividirlo.
- **Descripción obligatoria:** qué cambió, por qué, cómo probarlo, capturas si aplica al frontend.
- **Tests obligatorios** para nueva lógica de negocio (especialmente cálculos financieros).
- **No mergear sin al menos una review aprobada** del owner técnico de la capa afectada.
  - Cambios en `auth/`, `transactions/`, `budget/` → review de Diego.
  - Cambios en `frontend/` → review de Joaquín.
  - Cambios en modelo de datos o reglas de negocio → review de Agustín.
- **Squash & merge** para mantener historial limpio en `main`.

---

## Métricas de calidad declaradas (del README)

- Cobertura de código: **≥ 80%** (JUnit 5).
- Precisión de cálculos presupuestarios: **100%** (sin tolerancia a errores de redondeo).
- Seguridad: encriptación de contraseñas + validación de tokens JWT.

Cuando Copilot sugiera código que pueda comprometer estas métricas (ej: lógica financiera sin test, endpoint sin validación de JWT), debe **señalarlo explícitamente** en la respuesta.

---

## Documentación de APIs

- **OpenAPI/Swagger** configurado en `/swagger-ui.html` en cada microservicio.
- Endpoints documentados con `@Operation` y `@ApiResponse` de springdoc.
- El `openapi.json` generado se commitea en `docs/openapi-<microservicio>.json` para consumo del frontend.

---

## Estado actual del repositorio (snapshot mayo 2026)

> Esta sección se actualiza cuando el estado cambia significativamente.
> Hoy describe un repo en fase de inicialización.

**Lo que existe:**

- README.md con descripción y planificación.
- `.gitignore` configurado para Java/Spring Boot, Node/React, IDEs, H2.
- Estructura de carpetas: `backend/`, `frontend/`, `docs/` (todas con `.gitkeep`, vacías).

**Lo que aún NO existe (y por tanto Copilot no debe asumir):**

- Proyecto Spring Boot generado (no hay `pom.xml`, ni `Application.java`, ni paquetes).
- Proyecto React/Vite generado (no hay `package.json`, ni `vite.config.js`).
- Modelo de datos implementado (existe diagrama en README pero no entidades JPA).
- Decisiones de arquitectura mencionadas en sección "decisiones pendientes".

**Cuando Copilot reciba pedidos de generación de código que requieran estas piezas faltantes:**

1. Pregúntar al usuario sobre las decisiones pendientes antes de generar.
2. No asumir estructura de paquetes, dependencias específicas, o configuración de microservicios.
3. Si genera código de scaffolding (primer commit de un microservicio), confirmar que el usuario quiere ese scaffolding específico.
