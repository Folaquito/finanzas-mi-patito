# Decisiones arquitectónicas — Finanzas Mi Patito

> ADRs ligeros (Architecture Decision Records). Una entrada por decisión.
>
> **Cómo escribir un ADR aquí:** título, fecha, estado (pendiente / decidida / revisada), contexto, opciones consideradas, decisión, consecuencias.
>
> **Cuándo agregar uno:** cuando una discusión llegue a una decisión que afectará al código futuro. No es para cada cambio menor — es para decisiones que un nuevo integrante (o Copilot) necesitaría conocer para no romper invariantes.

---

## ADR-001 — Package base `com.finanzas` (no `cl.duoc.finanzas`)

- **Fecha:** 2026-04-30 (de facto cuando se generó el scaffold)
- **Estado:** decidida (implícita, formalizada aquí)
- **Contexto:** El `copilot-instructions.md` original decía `cl.duoc.finanzas.<microservicio>`, pero el código generado usó `com.finanzas`.
- **Decisión:** Mantener `com.finanzas`.
- **Razón:** Refactorizar todos los imports tendría costo alto sin beneficio funcional. `com.<empresa>` es convención válida.
- **Consecuencias:** Toda referencia futura usa `com.finanzas`. Cuando migremos a microservicios, cada uno será `com.finanzas.<bounded-context>` (ej: `com.finanzas.auth`, `com.finanzas.transactions`).

---

## ADR-002 — Idioma de identificadores: español

- **Fecha:** 2026-04-30 (de facto)
- **Estado:** decidida
- **Contexto:** Las clases, métodos y enums están todos en español (`Usuario`, `Cuenta`, `TipoCategoria.NECESIDAD`, etc.). El `copilot-instructions.md` original mezclaba ejemplos en inglés (`UserService`, `NEEDS/WANTS/SAVINGS`).
- **Decisión:** Identificadores de dominio en **español**. Identificadores técnicos de framework/librería en **inglés** cuando se mapean a anotaciones (`@Entity`, `@RestController`, etc.) — esto no es opcional, es Spring.
- **Razón:** Coherencia con todo el código existente. El dominio es financiero chileno, en español.
- **Consecuencias:** Tests en español también: `should_calcularDistribucion50_30_20_when_ingresoEsValido()`. Los enums de dominio se nombran en español.

---

## ADR-003 — Migración a microservicios: PENDIENTE

- **Fecha:** —
- **Estado:** 🟡 PENDIENTE de discusión grupal
- **Contexto:** El profesor pidió arquitectura de **microservicios**. El estado actual es un **monolito** porque empezamos a generar con Copilot sin instructions. El README declara 3 microservicios (`auth`, `transactions`, `budget`) que no existen.

### Opciones

**A) Migrar a microservicios reales antes de EP3 (semana 15).**

- ✅ Cumple lo pedido por el profesor.
- ✅ IL3.1 e IL3.2 más fuertes (validación, calidad).
- ❌ Costo alto: Spring Cloud, configuración inter-servicios, posibles problemas de transacciones distribuidas.
- ❌ Riesgo de no terminar a tiempo y entregar algo peor que el monolito actual.

**B) Mantener monolito y documentarlo como "monolito modular" con bounded contexts.**

- ✅ Bajo riesgo, podemos pulir tests/seguridad/frontend.
- ✅ Patrón legítimo en industria (modular monolith).
- ❌ Puede no cumplir lo que pidió el profesor literalmente.
- ❌ Necesita justificación clara en el informe.

**C) Híbrido: mantener monolito pero estructurar el código en paquetes por bounded context** (`com.finanzas.auth`, `com.finanzas.transactions`, `com.finanzas.budget`) **y exponer cada uno con su propio prefix de API**, sin separar JVM.

- ✅ Da apariencia/preparación para microservicios sin el costo total.
- ✅ Si después se decide separar, el refactor es factible.
- ❌ Al profesor podría no parecerle suficiente.

### Decisión

(Pendiente.)

### Consecuencias

(Pendiente — depende de la opción.)

---

## ADR-004 — Autenticación: JWT vs estado actual

- **Fecha:** —
- **Estado:** 🟡 PENDIENTE
- **Contexto:** README dice JWT obligatorio. `SecurityConfig` actual hace `permitAll()`. No se cumple ni IL2.3 (seguridad) ni la promesa al profesor.

### Opciones

**A) Implementar JWT completo (jjwt) antes de EP2.**

- ✅ Cumple seguridad declarada.
- ❌ Trabajo significativo: filter, generación, validación, refresh token, integración frontend.

**B) Implementar Spring Security básico con sesiones para EP2, JWT para EP3.**

- ✅ Más simple, suficiente para demostrar autenticación funcional.
- ❌ Hay que rehacer en EP3.

**C) Postergar a EP3 y declarar el gap explícitamente en el informe EP2.**

- ✅ Permite enfocar esfuerzo en lógica de dominio (50/30/20) que es más visible.
- ❌ El profesor puede penalizar.

### Decisión

(Pendiente.)

---

## ADR-005 — Lombok: usar o quitar

- **Fecha:** —
- **Estado:** 🟡 PENDIENTE
- **Contexto:** Lombok está declarado en `pom.xml` con `<optional>true</optional>` pero ninguna clase lo usa. Todas tienen getters/setters manuales.

### Opciones

**A) Adoptar Lombok consistentemente.** Reescribir POJOs con `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`.

- ✅ Reduce ~50% del código de modelos/DTOs.
- ❌ Requiere plugin en cada IDE de cada miembro.
- ❌ Oculta lógica generada (algunos seniors lo evitan por eso).

**B) Quitar Lombok del `pom.xml`.**

- ✅ Sin dependencias mágicas.
- ✅ Coherente con el código existente.
- ❌ Más boilerplate al agregar entidades.

### Decisión

(Pendiente. Sugerencia: opción B para EP2, evaluar A si el equipo quiere reducir boilerplate después.)

---

## ADR-006 — Stack frontend

- **Fecha:** 2026-05-31
- **Estado:** decidida
- **Contexto:** README declara React + Vite. Se inicializo el frontend para implementar el dashboard inicial.

### Opciones

**A) React + Vite + JavaScript (sin TypeScript).**

- ✅ Más rápido de empezar.
- ❌ Sin tipos, errores en runtime.

**B) React + Vite + TypeScript.**

- ✅ Tipos = menos bugs, mejor DX con Copilot.
- ❌ Curva de aprendizaje si alguien del equipo no sabe TS.

**C) Next.js.**

- ✅ Más estructurado, soporta SSR si se necesita.
- ❌ Overkill para una SPA simple.

### Decisión

Se adopta React + Vite + JavaScript (sin TypeScript) para la primera iteracion del frontend.

### Razón

- Menor friccion para partir rapido el dashboard.
- Alineado con el mockup y la necesidad de integracion inmediata con backend.

### Consecuencias

- Sin chequeo de tipos en build; se prioriza velocidad de iteracion.
- Si el equipo decide migrar a TypeScript, se tendra que planificar la conversion de archivos y tooling.

---

## ADR-007 — Persistencia: H2 dev vs PostgreSQL prod

- **Fecha:** —
- **Estado:** 🟡 PENDIENTE
- **Contexto:** Hoy solo hay H2 in-memory. IL2.2 del PA exige que el ambiente de prueba replique producción. Si producción no está definida, no se puede cumplir.

### Opciones

**A) Definir PostgreSQL como producción + perfil `prod` en `application-prod.yml` + Flyway/Liquibase para migraciones + perfil `test` con Testcontainers (PostgreSQL real en container).**

- ✅ Cumple IL2.2 al 100%.
- ❌ Más infraestructura (Docker en CI, etc.).

**B) Mantener H2 para todo, pero con archivo persistente (no in-memory) en producción.**

- ✅ Más simple.
- ❌ H2 no es realista como BD productiva. IL2.2 dudoso.

**C) PostgreSQL en `prod`, H2 en `dev` (estado actual + perfil prod).**

- ✅ Pragmático.
- ⚠️ Riesgo de que algo funcione en H2 y falle en PostgreSQL (queries, tipos).

### Decisión

(Pendiente. Sugerencia: opción A.)

---

## ADR-008 — Mover backend de la raíz a `backend/`

- **Fecha:** 2026-05-07
- **Estado:** decidida
- **Contexto:** El scaffold inicial (commit `e3870043`, 2026-04-30) generó el código Spring Boot directamente en la raíz del repo (`src/main/java/...`, `pom.xml` en raíz). Pero el README declara una estructura con `backend/` y `frontend/` como carpetas hermanas. Las carpetas `backend/` y `frontend/` quedaron vacías con `.gitkeep`. `docker-compose.yml` también asume `./auth-service`, `./transactions-service`, etc. — todo desalineado.
- **Decisión:** Mover el código backend (`src/`, `pom.xml`) a `backend/`. Mantener `frontend/` vacía hasta que se decida ADR-006 (stack frontend).

### Razón

- Coherencia con la estructura declarada en README.
- Permite que `frontend/` (cuando exista) sea un módulo hermano sin colisiones.
- Necesario antes de migrar a microservicios reales (ADR-003) — sin separación clara, no se puede.
- El movimiento es de bajo riesgo: `git mv` preserva el historial.

### Consecuencias

- Comandos Maven se ejecutan desde `backend/` (`cd backend && mvn ...`).
- `application.properties` queda en `backend/src/main/resources/`.
- Si alguien tenía un IDE configurado apuntando a la raíz, debe reabrir el proyecto desde `backend/pom.xml`.
- `docker-compose.yml` sigue desalineado por otra razón (apunta a microservicios inexistentes) — eso es problema separado, no se resuelve aquí.
- En `copilot-instructions.md` y `STATUS.md`, todas las referencias a `src/main/java/com/finanzas/` se actualizan a `backend/src/main/java/com/finanzas/`.

---

## Plantilla para nuevos ADRs

```markdown
## ADR-NNN — [Título corto]

- **Fecha:** YYYY-MM-DD
- **Estado:** pendiente | decidida | revisada
- **Contexto:** [Qué problema o pregunta motiva esta decisión]

### Opciones

**A) [Opción]**

- ✅ [Pro]
- ❌ [Contra]

**B) [Opción]**

- ✅ [Pro]
- ❌ [Contra]

### Decisión

[Cuál se eligió y por qué]

### Consecuencias

[Qué cambia en el código/proceso a partir de ahora]
```
