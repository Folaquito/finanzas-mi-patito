# Changelog — Finanzas Mi Patito

> Registro cronológico de cambios significativos. Una entrada por PR mergeado o por iteración importante.
>
> **Formato:** fecha, autor, PR (si aplica), resumen, archivos clave tocados, gaps cerrados o abiertos.
>
> **Cuándo escribir aquí:** después de mergear un PR a `master`, o después de una iteración con Copilot que haya cambiado estructura/funcionalidad. Si el cambio fue solo cosmético o de documentación trivial, no hace falta entrada.

---

## [Sin liberar] — En curso

### En desarrollo

(Listar PRs abiertas o trabajo en progreso aquí. Mover a una sección con fecha cuando se mergee.)

---

## 2026-05-07 — Reescritura de copilot-instructions, docs/progress y reorganización a backend/

- **Autor:** Joaquín (@Folaquito)
- **PR:** _(pendiente)_
- **Resumen:** Tres cambios coordinados en un solo PR de documentación e infraestructura:
  1. Reescrito `.github/copilot-instructions.md` para reflejar el estado real del repo y agregar guidelines de Karpathy.
  2. Creada carpeta `docs/progress/` con `STATUS.md`, `DECISIONS.md` y `CHANGELOG.md` como memoria viva del proyecto entre iteraciones.
  3. **Movido el código backend de la raíz a `backend/`** (ver ADR-008): `src/` → `backend/src/`, `pom.xml` → `backend/pom.xml`. Las carpetas declaradas en el README ahora coinciden con la estructura real.
- **Archivos clave:**
  - `.github/copilot-instructions.md` (reescrito completo, refleja `backend/`)
  - `docs/progress/STATUS.md`, `DECISIONS.md`, `CHANGELOG.md`, `README.md` (nuevos)
  - `backend/` (movimiento con `git mv`, preserva historial)
- **Gaps cerrados:**
  - Inconsistencia README ↔ realidad sobre ubicación del backend.
- **Gaps abiertos (registrados, no cerrados):**
  - ADR-003: microservicios pendiente
  - ADR-004: JWT pendiente
  - ADR-005: Lombok pendiente
  - ADR-006: stack frontend pendiente
  - ADR-007: PostgreSQL prod pendiente
  - `docker-compose.yml` sigue apuntando a microservicios inexistentes (problema separado).
- **Decisiones registradas:** ADR-008 (mover backend a `backend/`).

---

## 2026-05-04 — Documentación de lineamientos del proyecto

- **Autor:** Joaquín (@Folaquito)
- **PR:** [#2 Main](https://github.com/Folaquito/finanzas-mi-patito/pull/2)
- **Commit:** `3464d99f`
- **Resumen:** Documenta lineamientos iniciales del proyecto y mejora configuración inicial. Sincroniza `master` con `main`.
- **Archivos clave:** `.github/copilot-instructions.md` (versión inicial — luego reescrita), README, configs.

---

## 2026-05-01 — Modelo de datos al README

- **Autor:** Agustín (@AbsolucionArtistica)
- **Commit:** `779150fd`
- **Resumen:** Agrega imagen del modelo de base de datos al README.
- **Archivos clave:** `README.md`, attachment de GitHub.

---

## 2026-04-30 — Scaffold completo del backend

- **Autor:** Diego (@Eth3rn4l)
- **Commits:** `e3870043` (chore: add backend), `3f175ad9` (docs: update README), `2e369747`, `a600c812`, `8d94e505`
- **PR:** [#1 Update GitHub link Diego](https://github.com/Folaquito/finanzas-mi-patito/pull/1)
- **Resumen:** Scaffold inicial del backend Spring Boot completo en `src/main/java/com/finanzas/`.
- **Archivos clave:**
  - `pom.xml` (Java 21, Spring Boot 3.5.14, dependencias web/data-jpa/h2/validation/security/lombok)
  - `FinanzasMiPatitoApplication.java`
  - `config/`: `DataLoader`, `SecurityConfig`
  - `model/`: 5 entidades (`Usuario`, `Cuenta`, `Categoria`, `Transaccion`, `Meta`) + 3 enums
  - `dto/`: 5 DTOs
  - `repository/`: 5 `JpaRepository<>`
  - `service/` + `service/impl/`: 6 services con interface + impl
  - `controller/`: 6 controllers con CRUD
  - `exception/`: `GlobalExceptionHandler` + `ResourceNotFoundException`
  - `application.properties`: H2 in-memory
- **Gaps abiertos:** sin tests, sin JWT, sin frontend, sin OpenAPI, sin migraciones, sin perfil prod (todos heredados a este punto).

---

## 2026-04-10 — Estructura inicial del repo

- **Autor:** Joaquín (@Folaquito)
- **Commit:** `3c0923c7`
- **Resumen:** Estructura inicial del proyecto. Carpetas `backend/`, `frontend/`, `docs/` con `.gitkeep`. `.gitignore` para Java/Node/IDEs.
- **Archivos clave:** `.gitignore`, `README.md`, `docker-compose.yml`, estructura de carpetas.

---

## Plantilla para nuevas entradas

```markdown
## YYYY-MM-DD — [Título corto descriptivo]

- **Autor:** Nombre (@github)
- **PR:** [#NN título](url)
- **Commit:** `<sha>` _(opcional si fue squash)_
- **Resumen:** [1-2 frases sobre qué cambió y por qué]
- **Archivos clave:** [lista corta de paths]
- **Gaps cerrados:** [items de STATUS.md que ya no aplican]
- **Gaps abiertos:** [items nuevos descubiertos]
- **Decisiones registradas:** [ADRs nuevos o actualizados]
```
