# Finanzas Mi Patito — Backend

API REST en **Spring Boot 3.5.14** (Java 21, Maven) con base de datos **H2 en memoria**.
Implementa autenticación, CRUD de datos maestros y la lógica de presupuesto **50/30/20**.

## Requisitos

- Java 21+
- Maven 3.6+

## Ejecución

```bash
# Compilar
mvn -DskipTests package

# Ejecutar (puerto 8080)
mvn spring-boot:run
```

Al iniciar, un *seed* (`DataLoader`) crea un usuario de prueba si la base está vacía:

| Correo | Contraseña |
|--------|-----------|
| `admin@patito.com` | `password` |

Consola H2: http://localhost:8080/h2-console — JDBC: `jdbc:h2:mem:finanzas_db` (usuario `sa`, sin contraseña).

> **Nota:** la base es en memoria; los datos se reinician en cada arranque (el seed se vuelve a crear).

## Arquitectura

Monolito por capas dentro del paquete `com.finanzas`:

```
controller → service (interface) → service.impl → repository (Spring Data JPA) → model (entidades)
```

- `config/SecurityConfig` — Spring Security con BCrypt. Actualmente los endpoints son abiertos (`permitAll`); la autenticación es a nivel de servicio (validación de credenciales). JWT queda como evolución futura.
- `dto/` — se exponen DTOs en vez de entidades en las operaciones de escritura.
- `exception/GlobalExceptionHandler` — respuestas de error uniformes (`404` recurso no encontrado, `400` petición inválida, `400` validación de campos).

## Endpoints (base `/api`)

### Autenticación — `/api/auth`

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/login` | Inicia sesión (`email`, `password`). Devuelve el usuario sin la contraseña. |
| POST | `/auth/recuperar` | Genera un token de recuperación (`email`). En esta versión el token se devuelve en la respuesta simulando el envío por correo. |
| POST | `/auth/reset-clave` | Restablece la contraseña con el token (`token`, `nuevaClave`). |
| POST | `/auth/cambiar-password` | Cambia la contraseña validando la actual (`email`, `claveActual`, `nuevaClave`). |

### Presupuesto 50/30/20 — `/api/presupuesto`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/presupuesto/{usuarioId}` | Distribuye los ingresos del usuario en `NECESIDAD` (50%), `DESEO` (30%) y `AHORRO` (20%), con lo presupuestado, lo gastado y lo disponible por categoría. |

### Recursos

| Recurso | Rutas |
|---------|-------|
| Usuarios | `POST /usuarios` · `GET /usuarios` · `GET /usuarios/{id}` · `PUT /usuarios/{id}` · `DELETE /usuarios/{id}` |
| Cuentas | `POST /cuentas` · `GET /cuentas` · `GET /cuentas/{id}` · `GET /cuentas/usuario/{usuarioId}` · `PUT /cuentas/{id}` · `DELETE /cuentas/{id}` |
| Categorías | `POST /categorias` · `GET /categorias` · `GET /categorias/{id}` · `PUT /categorias/{id}` · `DELETE /categorias/{id}` |
| Transacciones | `POST /transacciones` · `GET /transacciones` · `GET /transacciones/{id}` · `GET /transacciones/cuenta/{cuentaId}` · `PUT /transacciones/{id}` · `DELETE /transacciones/{id}` |
| Metas | `POST /metas` · `GET /metas/{id}` · `GET /metas/usuario/{usuarioId}` · `PUT /metas/{id}` · `DELETE /metas/{id}` |
| Resumen | `GET /resumen/{usuarioId}` → `totalIngresos`, `totalGastos`, `balance` |

### Ejemplos rápidos

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@patito.com","password":"password"}'

# Presupuesto del usuario 1
curl http://localhost:8080/api/presupuesto/1
```

## Notas técnicas

- Las contraseñas se almacenan cifradas con **BCrypt**.
- Los montos se manejan como `BigDecimal` en **CLP sin decimales**.
- El `pom.xml` activa `-parameters` en el compilador (necesario para que Spring resuelva los `@PathVariable` al compilar con Maven).
