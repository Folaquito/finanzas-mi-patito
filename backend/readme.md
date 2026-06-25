# Finanzas Mi Patito - Backend

Proyecto Spring Boot (Java 17, Spring Boot 3, Maven) con H2 en memoria.

Requisitos locales:

- Java 17+
- Maven 3.6+

Config y ejecución:

1. Compilar:

```powershell
mvn -DskipTests package
```

2. Ejecutar:

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

Resumen usuario:

GET http://localhost:8080/api/resumen/1

Notas:

- Las contraseñas se guardan encriptadas con BCrypt al crear usuarios.
- Spring Security está configurado para permitir todos los endpoints (sin autenticación por ahora).
- Si no tienes Maven instalado en tu máquina, instala Maven y Java 17 y luego ejecuta los comandos de arriba.
