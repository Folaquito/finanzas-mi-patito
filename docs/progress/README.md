# `docs/progress/` — Memoria viva del proyecto

Esta carpeta es la **memoria persistente** del repo entre iteraciones, especialmente útil cuando trabajamos con Copilot en modo agente. Lee estos archivos al iniciar cualquier sesión de trabajo significativa.

| Archivo                          | Para qué sirve                                                           | Cuándo leerlo                              | Cuándo actualizarlo                                           |
| -------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------- |
| [`STATUS.md`](./STATUS.md)       | Estado actual: qué existe, qué no, gaps por capa, deuda técnica conocida | Antes de empezar cualquier feature         | En cada PR que cambie funcionalidad o estructura              |
| [`DECISIONS.md`](./DECISIONS.md) | ADRs ligeros: decisiones arquitectónicas tomadas, alternativas, razones  | Antes de proponer un cambio arquitectónico | Cuando se resuelve una decisión pendiente o aparece una nueva |
| [`CHANGELOG.md`](./CHANGELOG.md) | Registro cronológico de cambios significativos                           | Cuando necesitas contexto histórico        | Después de mergear cada PR a `master`                         |

## Flujo de trabajo recomendado con Copilot

1. **Antes de iterar:** Copilot debe leer `STATUS.md` (qué hay) y `DECISIONS.md` (qué se decidió) para no asumir cosas falsas.
2. **Durante la iteración:** seguir las guidelines del `.github/copilot-instructions.md` (Karpathy + reglas técnicas).
3. **Al cerrar la iteración:** actualizar `STATUS.md` (gaps cerrados/abiertos), `DECISIONS.md` (si se resolvió alguna decisión), y `CHANGELOG.md` (entrada nueva).

## Convención

- Sin emojis salvo los de estado en tablas (🟢 🟡 🔴 ✅ ❌).
- Fechas absolutas en formato `YYYY-MM-DD`.
- Cuando un dato se vuelve obsoleto, **edítalo en su lugar** — no acumules contradicciones.
- Si el archivo crece demasiado, considera dividirlo (ej: `STATUS-backend.md` + `STATUS-frontend.md`).
