# Finanzas Mi Patito - Backend

Proyecto Spring Boot (Java 17, Spring Boot 3, Maven) con H2 en memoria.

Requisitos locales:
- Java 17+
- Maven 3.6+

Config y ejecución:

1) Compilar:

```powershell
mvn -DskipTests package
```

2) Ejecutar:

```powershell
mvn spring-boot:run
```

La consola H2 estará disponible en: http://localhost:8080/h2-console (URL JDBC: jdbc:h2:mem:finanzas_db)

Endpoints principales (base `/api`):

- Usuarios: `/api/usuarios`
  - POST crear
  - GET listar
  - GET /{id}
  - PUT /{id}
  - DELETE /{id}

- Cuentas: `/api/cuentas`
  - POST crear
  - GET listar
  - GET /{id}
  - GET /usuario/{usuarioId}
  - PUT /{id}
  - DELETE /{id}

- Categorias: `/api/categorias`
  - CRUD básico

- Transacciones: `/api/transacciones`
  - POST crear
  - GET listar
  - GET /{id}
  - GET /cuenta/{cuentaId}
  - PUT /{id}
  - DELETE /{id}

- Metas: `/api/metas`
  - POST crear
  - GET /usuario/{usuarioId}
  - GET /{id}
  - PUT /{id}
  - DELETE /{id}

- Resumen: `GET /api/resumen/{usuarioId}`
  - Retorna totalIngresos, totalGastos, balance

Ejemplos JSON (usar con curl o Postman):

- Crear usuario:

```json
{
  "nombre": "Juan Perez",
  "email": "juan@example.com",
  "password": "secret",
  "telefono": "123456789"
}
```

- Crear cuenta:

```json
{
  "usuarioId": 1,
  "nombre": "Cuenta Ahorros",
  "tipo": "Ahorros",
  "saldo": 500.00
}
```

- Crear categoria:

```json
{
  "nombre": "Sueldo",
  "tipo": "NECESIDAD"
}
```

- Crear transaccion (INGRESO):

```json
{
  "cuentaId": 1,
  "categoriaId": 1,
  "monto": 1000.00,
  "tipo": "INGRESO",
  "tipoMovimiento": "DEPOSITO",
  "descripcion": "Pago salario"
}
```

- Crear transaccion (GASTO):

```json
{
  "cuentaId": 1,
  "categoriaId": 2,
  "monto": 50.00,
  "tipo": "GASTO",
  "tipoMovimiento": "PAGO",
  "descripcion": "Compra supermercado"
}
```

- Crear meta:

```json
{
  "usuarioId": 1,
  "nombre": "Viaje",
  "montoObjetivo": 2000.00,
  "montoActual": 100.00,
  "fechaLimite": "2026-12-31"
}
```

Resumen usuario:

GET http://localhost:8080/api/resumen/1

Notas:
- Las contraseñas se guardan encriptadas con BCrypt al crear usuarios.
- Spring Security está configurado para permitir todos los endpoints (sin autenticación por ahora).
- Si no tienes Maven instalado en tu máquina, instala Maven y Java 17 y luego ejecuta los comandos de arriba.
# Finanzas Mi Patito 🐣

Aplicación web de gestión de finanzas personales con implementación automática de la regla **50/30/20** y proyecciones de ahorro.

## Integrantes

| Nombre | Rol | GitHub |
|--------|-----|--------|
| Agustín Bahamondes | Product Owner / Analista | [@AbsolucionArtistica](https://github.com/AbsolucionArtistica) |
| Joaquín Fernández | Frontend Developer (React) | [@Folaquito](https://github.com/Folaquito) |
| Diego Bahamondez | Backend Developer (Spring Boot) | [@Eth3rn4l](https://github.com/Eth3rn4l) |

**Profesor:** Diego Patricio Cares Gonzalez  
**Asignatura:** Taller Aplicado de Programación 801D — Duoc UC  
**Año:** 2026

---

## Descripción

Finanzas Mi Patito es una plataforma web que transforma la relación del usuario con su dinero mediante educación financiera activa y automatización de presupuestos.

**Funcionalidades clave:**
- Centralización de movimientos bancarios (historial consolidado)
- Presupuestado inteligente con regla 50/30/20 y Presupuesto Base Cero
- Proyecciones financieras con gráficos de crecimiento patrimonial

**Fuera de alcance:** integración real con APIs bancarias (se usan datos simulados o CSV), versión móvil nativa.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React (SPA) |
| Backend | Java 21 + Spring Boot (microservicios) |
| Base de datos | H2 (desarrollo) / PostgreSQL (producción) |
| Testing | JUnit 5 + Mockito |
| Control de versiones | Git + GitHub |

---

## Arquitectura

Arquitectura de **microservicios desacoplada** en 3 capas:

```
┌─────────────────────────────────┐
│   Capa de Presentación          │
│   React SPA  ──►  REST API      │
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│   Capa de Negocio               │
│   Spring Boot Microservicios    │
│   (lógica 50/30/20, auth JWT)   │
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│   Capa de Datos                 │
│   Spring Data JPA  ──►  H2/SQL  │
└─────────────────────────────────┘
```

---

## Estructura del Proyecto

```
finanzas-mi-patito/
├── frontend/          # React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/  # Clientes REST
│   └── package.json
├── backend/           # Spring Boot
│   ├── src/main/java/
│   │   └── cl/duoc/finanzas/
│   │       ├── auth/          # Microservicio de autenticación
│   │       ├── transactions/  # Microservicio de transacciones
│   │       └── budget/        # Microservicio de presupuestos
│   └── pom.xml
└── docs/              # Documentación y diagramas
```

---

## Metodología

**Scrum** con sprints semanales:

- Sprint Planning: inicio de cada semana
- Daily Sync: revisión breve de bloqueos
- Sprint Review: viernes, revisión de entregables
- Tablero Kanban: [Trello — Finanzas Mi Patito](#) *(link pendiente)*

---

## Planificación

| Fase | Actividad | Duración |
|------|-----------|----------|
| Análisis | Levantamiento de requerimientos y diseño de BD | 1 semana |
| Diseño | Wireframes (UI) y diagramas de arquitectura | 1 semana |
| Backend | Microservicios Spring Boot + persistencia H2 | 3 semanas |
| Frontend | Interfaz React + consumo de APIs | 3 semanas |
| Pruebas y QA | JUnit/Mockito + corrección de errores | 1 semana |
| Cierre | Documentación final + demo | 1 semana |

---

## Métricas de Calidad

- Cobertura de código: **≥ 80%** (JUnit 5)
- Precisión de cálculos presupuestarios: **100%**
- Seguridad: encriptación de contraseñas + validación de tokens JWT
