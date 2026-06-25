# Estado del proyecto — Finanzas Mi Patito

> **Archivo vivo.** Actualizar después de cada PR que cambie funcionalidad, estructura o deuda técnica. Última verificación contra `master`: **2026-05-07**.
>
> **Cómo usar este archivo:**
>
> - Copilot debe leerlo al inicio de cada sesión para no asumir cosas falsas.
> - Cualquier integrante puede editarlo en su PR si descubre que el estado cambió.
> - Si una sección queda obsoleta, actualízala en el mismo PR.

---

## 1. Resumen ejecutivo

| Aspecto                          | Estado                                                               |
| -------------------------------- | -------------------------------------------------------------------- |
| **Arquitectura**                 | Monolito Spring Boot (objetivo: microservicios — ver `DECISIONS.md`) |
| **Backend**                      | 🟡 Scaffold + CRUD básico funcionando                                |
| **Frontend**                     | 🟡 Dashboard inicial conectado a backend                             |
| **Tests**                        | 🔴 0% cobertura                                                      |
| **Seguridad**                    | 🟡 BCrypt sí, JWT no, ownership check no                             |
| **CI/CD**                        | 🔴 Sin GitHub Actions                                                |
| **Docs API**                     | 🔴 Sin OpenAPI/Swagger                                               |
| **Lógica de dominio (50/30/20)** | 🔴 No implementada                                                   |

---

## 2. Backend (`backend/src/main/java/com/finanzas/`)

### Implementado ✅

- Spring Boot 3.5.14, Java 21, Maven (sin wrapper).
- Package base `com.finanzas`.
- Entidades JPA: `Usuario`, `Cuenta`, `Categoria`, `Transaccion`, `Meta`.
- Enums: `TipoCategoria` (NECESIDAD/DESEO/AHORRO), `TipoTransaccion` (INGRESO/GASTO), `TipoMovimiento` (TRANSFERENCIA/PAGO/DEPOSITO).
- DTOs: `UsuarioDTO`, `CuentaDTO`, `MetaDTO`, `TransaccionDTO`, `ResumenDTO`.
- Controllers con CRUD completo (ver tabla de endpoints abajo).
- Services con interfaces + implementaciones (`*ServiceImpl`).
- Repositories: `JpaRepository<>` con queries derivadas (`findByCuentaId`, `findByUsuarioId`, `findByEmail`).
- Exception handler global (`GlobalExceptionHandler` con `@RestControllerAdvice`).
- BCrypt para passwords (cost factor default).
- Inyección por constructor con `final`.
- Validación con `jakarta.validation` en DTOs.
- `DataLoader` para seed inicial en startup.

### Pendiente ❌

| Item                                                          | Por qué importa                                             | Owner sugerido                   |
| ------------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------- |
| **JWT funcional**                                             | README/copilot lo declaran obligatorio. Hoy `permitAll()`   | Diego                            |
| **Ownership check en endpoints**                              | Cualquier llamada lee/escribe datos de cualquier usuario    | Diego                            |
| **`BudgetService` o `PresupuestoService` con regla 50/30/20** | Es el corazón del producto                                  | Agustín diseña, Diego implementa |
| **Importación CSV de cartolas**                               | Campos preparados en `Transaccion`, sin endpoint            | Diego                            |
| **Proyecciones de ahorro**                                    | Funcionalidad declarada en README                           | Diego                            |
| **Tests JUnit + Mockito**                                     | Meta 80%, actual 0%                                         | Todos                            |
| **OpenAPI/Swagger (springdoc)**                               | Para que el frontend consuma con contrato                   | Diego                            |
| **Maven wrapper (`./mvnw`)**                                  | Estándar declarado en docs                                  | Diego                            |
| **PostgreSQL para perfil `prod`**                             | Sin esto, no se cumple IL2.2 (ambiente prueba ≈ producción) | Diego                            |
| **Migraciones (Flyway/Liquibase)**                            | Hoy `ddl-auto=update` solo sirve en H2 dev                  | Diego                            |
| **Logger SLF4J consistente**                                  | Verificar que ningún `System.out.println` se cuele          | Todos                            |

### Bugs / observaciones técnicas

| ID  | Descripción                                                                                                                                           | Severidad                         |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| B1  | `DataLoader` crea categoría "Sueldo" con tipo `NECESIDAD`. Sueldo es un **ingreso**, no debería tener tipo de la regla 50/30/20 (que aplica a gastos) | Media — ensucia datos demo        |
| B2  | `findByEmail` existe en `UsuarioRepository` pero nunca se usa (preparado para login no implementado)                                                  | Baja — dead code informativo      |
| B3  | `ResumenServiceImpl` itera todas las cuentas y transacciones en memoria; debería ser JPQL `@Query` con `SUM` por tipo                                 | Media — escalabilidad             |
| B4  | Endpoints `GET` sin paginación (riesgo en `/api/transacciones`)                                                                                       | Media — escalabilidad             |
| B5  | `application.properties` con `spring.jpa.show-sql=true` — quitar en `prod`                                                                            | Baja — ruido en logs              |
| B6  | Lombok declarado en `pom.xml` sin uso real. Decidir: quitar o adoptar consistentemente                                                                | Baja — coherencia                 |
| B7  | `CategoriaController` recibe `Categoria` directo (no DTO) — viola la regla declarada                                                                  | Media — incoherencia con el resto |
| B8  | Sin perfil `prod` en `application.properties` ni `application-prod.yml`                                                                               | Alta para EP2 — IL2.2 lo exige    |

### Endpoints implementados

Todos en `master`, base `/api`, sin autenticación efectiva.

| Recurso                    | Verbos                                                               | Notas                                                                                                                |
| -------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `/api/usuarios`            | POST, GET, GET/{id}, PUT/{id}, DELETE/{id}                           | Password hasheado en create/update con BCrypt                                                                        |
| `/api/cuentas`             | POST, GET, GET/{id}, GET /usuario/{usuarioId}, PUT/{id}, DELETE/{id} |                                                                                                                      |
| `/api/categorias`          | POST, GET, GET/{id}, PUT/{id}, DELETE/{id}                           | ⚠️ Recibe `Categoria` directo (B7)                                                                                   |
| `/api/transacciones`       | POST, GET, GET/{id}, GET /cuenta/{cuentaId}, PUT/{id}, DELETE/{id}   | Saldo de cuenta se ajusta automáticamente: INGRESO suma, GASTO resta. UPDATE revierte saldo previo y aplica el nuevo |
| `/api/metas`               | POST, GET/{id}, GET /usuario/{usuarioId}, PUT/{id}, DELETE/{id}      | NO tiene `GET all`                                                                                                   |
| `/api/resumen/{usuarioId}` | GET                                                                  | Devuelve `{totalIngresos, totalGastos, balance}` agregado de todas las cuentas del usuario                           |

### Configuración actual

- `backend/src/main/resources/application.properties`: H2 in-memory, `ddl-auto=update`, console habilitada en `/h2-console`, `show-sql=true`, `server.error.include-message=always`.
- `backend/src/main/java/com/finanzas/config/SecurityConfig.java`: `csrf.disable()` + `anyRequest().permitAll()`.
- `backend/pom.xml`: web, data-jpa, h2, validation, security, security-crypto, lombok (optional), jackson-jsr310, starter-test.
- **No hay** `application-test.properties` ni perfiles separados.

---

## 3. Frontend (`frontend/`)

### Estado: 🟡 React + Vite (JavaScript)

Implementado dashboard inicial con estilo HiFi (sidebar, hero 50/30/20, resumen, movimientos recientes). Conectado a backend via `/api` con proxy en Vite.

**Incluye:**

1. Shell con sidebar/topbar y responsive mobile nav.
2. Flow bar 50/30/20 y tarjetas de resumen.
3. Movimientos recientes desde `/api/transacciones/cuenta/{cuentaId}`.
4. Cliente HTTP simple en `frontend/src/api/`.

**Proximos pasos sugeridos:**

1. Login/registro (cuando se defina auth).
2. Pantalla de movimientos con filtros y detalle.
3. Pantalla de metas con progreso y CTA.
4. Presupuesto (cuando exista endpoint 50/30/20).

---

## 4. Tests

### Estado: 🔴 0% cobertura

No existe `src/test/java/`. `spring-boot-starter-test` está en `pom.xml`.

**Prioridad cuando se empiece:**

1. `ResumenServiceImplTest` — verificar suma correcta de ingresos/gastos.
2. `TransaccionServiceImplTest` — verificar `applySaldo` y `revertSaldo` (lógica financiera crítica).
3. `UsuarioServiceImplTest` — verificar BCrypt en create/update.
4. Test de integración: `POST /api/usuarios` → `POST /api/cuentas` → `POST /api/transacciones` → verificar saldo.
5. Cuando exista 50/30/20: tests obligatorios de redondeo y suma exacta al 100%.

---

## 5. Infraestructura

### `docker-compose.yml` — DESALINEADO

Define servicios `auth-service`, `transactions-service`, `budget-service` y `postgres`. Pero:

- No existen los Dockerfiles (`./auth-service`, `./transactions-service`, `./budget-service`).
- El código real es un monolito en la raíz del repo.
- No funciona si se ejecuta hoy.

**Acción pendiente:** decidir si rehacer compose para reflejar monolito actual, o mantenerlo como referencia para cuando migremos a microservicios. Registrar en `DECISIONS.md`.

### Carpetas estructurales

| Carpeta     | Estado                                                                                                                 |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| `backend/`  | Contiene el código Spring Boot. Movido desde la raíz el 2026-05-07 (ver ADR-008 y CHANGELOG)                           |
| `frontend/` | React + Vite (JavaScript). Dashboard inicial conectado a backend                                                       |
| `docs/`     | Documentación del proyecto. `docs/progress/` contiene los archivos vivos (`STATUS.md`, `DECISIONS.md`, `CHANGELOG.md`) |

---

## 6. Mapeo a indicadores de logro de la asignatura (EP2 — RA2)

| IL        | Descripción                                      | Estado       | Gap                                                                                                                             |
| --------- | ------------------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **IL2.1** | Documentos de diseño con técnicas y herramientas | 🟡 Parcial   | README + imagen modelo BD existen. Falta: diagrama de clases UML, diagrama de secuencia para flujos críticos, mockups frontend  |
| **IL2.2** | Ambiente de prueba que replique producción       | 🔴 No cumple | H2 in-memory ≠ producción PostgreSQL. Falta: perfil `prod` con PostgreSQL, perfil `test` separado, migraciones Flyway/Liquibase |
| **IL2.3** | Producto funcional, de calidad y seguro          | 🟡 Parcial   | CRUD funciona, BCrypt sí. Falta: JWT, ownership check, lógica 50/30/20, frontend, tests                                         |

---

## 7. Branches activas

| Branch   | Estado       | Notas                                                    |
| -------- | ------------ | -------------------------------------------------------- |
| `master` | default      | Commit más reciente: 8a3b6c8f (Merge PR #2) — 2026-05-04 |
| `main`   | sincronizada | Mergeada con `master` vía PR #2                          |

---

## 8. Cambios recientes (resumen rápido)

Para detalles completos ver `CHANGELOG.md`.

- **2026-05-04** — Merge PR #2: documentación de lineamientos del proyecto.
- **2026-04-30** — Diego (@Eth3rn4l) agrega scaffold completo del backend (entidades, services, controllers, DTOs).
- **2026-04-10** — Folaquito crea estructura inicial del repo.
