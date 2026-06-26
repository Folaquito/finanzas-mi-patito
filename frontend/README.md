# Finanzas Mi Patito — Frontend

SPA en **React 19 + Vite 8** que consume la API REST del backend. Incluye autenticación, dashboard y la vista del presupuesto **50/30/20**.

## Requisitos

- Node.js 22+
- Backend corriendo en `http://localhost:8080` (ver [`../backend/readme.md`](../backend/readme.md))

## Ejecución

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:5173
```

El dev server hace **proxy** de las peticiones `/api` hacia el backend en `:8080` (configurado en `vite.config.js`), por lo que no hay problemas de CORS.

Credenciales de prueba (seed del backend): `admin@patito.com` / `password`.

### Otros scripts

```bash
npm run build    # build de producción en dist/
npm run preview  # sirve el build de producción
npm run lint     # ESLint
```

## Estructura

```
src/
├── api/
│   ├── client.js       # fetch base (lee VITE_API_BASE_URL, default /api)
│   ├── auth.js         # login, registro, recuperar/reset/cambiar clave
│   └── finanzas.js     # resumen, presupuesto, cuentas, transacciones
├── context/
│   ├── auth-context.js # AuthContext + hook useAuth
│   └── AuthContext.jsx # AuthProvider (sesión persistida en localStorage)
├── components/
│   ├── Shell.jsx       # layout: sidebar + topbar + navegación
│   ├── ui.jsx          # Button, Card, Pill
│   ├── Patito.jsx      # mascota (SVG por etapas)
│   └── Icon.jsx        # set de íconos SVG
├── features/
│   ├── Login.jsx       # login / registro / recuperar contraseña
│   ├── Dashboard.jsx   # balance, 50/30/20 y movimientos recientes
│   ├── Presupuesto.jsx # detalle de la regla 50/30/20 por categoría
│   ├── Perfil.jsx      # datos, cambiar contraseña y cerrar sesión
│   └── Placeholder.jsx # secciones en construcción
└── utils/
    ├── format.js       # formato CLP y fechas
    └── user.js         # helper de usuario para el Shell
```

## Decisiones técnicas

- **Estado de sesión** con Context API (`AuthContext`) persistido en `localStorage`; sin librerías externas de estado (Redux, etc.).
- **Estilos** en CSS vanilla con variables globales (`index.css`) y hojas por feature (`auth.css`, `presupuesto.css`, `perfil.css`).
- **Navegación** por estado en `App.jsx` (sin router): si no hay sesión se muestra el login; con sesión, se navega entre vistas desde el `Shell`.

## Solución de problemas

**`Cannot find module rolldown-binding.linux-x64-gnu.node` al hacer `build`/`dev`:**
ocurre si los `node_modules` se instalaron en otro sistema operativo (p. ej. Windows) y se ejecuta en Linux/WSL. Reinstala las dependencias en el sistema actual:

```bash
rm -rf node_modules package-lock.json && npm install
```
