import { useEffect, useMemo, useState } from 'react';
import { getCuentasByUsuario, getResumen, getTransaccionesByCuenta } from '../api/finanzas';
import Icon from '../components/Icon';
import Shell from '../components/Shell';
import { Button, Card, Pill } from '../components/ui';
import { useAuth } from '../context/auth-context';
import { formatCLP, formatShortCLP, formatShortDate, toNumber } from '../utils/format';
import { toShellUser } from '../utils/user';

const CATEGORY_LABELS = {
  NECESIDAD: 'Necesidades',
  DESEO: 'Deseos',
  AHORRO: 'Ahorro',
};

const CATEGORY_BADGES = {
  NECESIDAD: 'N',
  DESEO: 'D',
  AHORRO: 'A',
};

function parseTotal(value) {
  return toNumber(value);
}

function sumByTipo(transacciones, tipo) {
  return transacciones
    .filter((t) => t?.tipo === tipo)
    .reduce((acc, t) => acc + parseTotal(t.monto), 0);
}

function buildBreakdown(transacciones) {
  return transacciones.reduce(
    (acc, t) => {
      if (t?.tipo !== 'GASTO') {
        return acc;
      }
      const categoriaTipo = t?.categoria?.tipo;
      if (!categoriaTipo || !acc[categoriaTipo]) {
        return acc;
      }
      return {
        ...acc,
        [categoriaTipo]: acc[categoriaTipo] + parseTotal(t.monto),
      };
    },
    { NECESIDAD: 0, DESEO: 0, AHORRO: 0 }
  );
}

function sortByFechaDesc(transacciones) {
  return [...transacciones].sort((a, b) => {
    const aTime = a?.fecha ? new Date(a.fecha).getTime() : 0;
    const bTime = b?.fecha ? new Date(b.fecha).getTime() : 0;
    return bTime - aTime;
  });
}

export default function Dashboard({ onNavigate }) {
  const { user } = useAuth();
  const [state, setState] = useState({
    loading: true,
    error: null,
    resumen: null,
    cuentas: [],
    transacciones: [],
  });

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const resumen = await getResumen(user.id).catch(() => null);
        const cuentas = await getCuentasByUsuario(user.id).catch(() => []);
        const transaccionesByCuenta = await Promise.all(
          cuentas.map((cuenta) => getTransaccionesByCuenta(cuenta.id).catch(() => []))
        );
        const transacciones = transaccionesByCuenta.flat();

        if (isMounted) {
          setState({
            loading: false,
            error: null,
            resumen,
            cuentas,
            transacciones,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error?.message || 'No se pudo cargar el dashboard.',
          }));
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [user.id]);

  const computed = useMemo(() => {
    const ingresos =
      state.resumen?.totalIngresos != null
        ? parseTotal(state.resumen.totalIngresos)
        : sumByTipo(state.transacciones, 'INGRESO');

    const gastos =
      state.resumen?.totalGastos != null
        ? parseTotal(state.resumen.totalGastos)
        : sumByTipo(state.transacciones, 'GASTO');

    const balance =
      state.resumen?.balance != null ? parseTotal(state.resumen.balance) : ingresos - gastos;

    const breakdown = buildBreakdown(state.transacciones);
    const totalIngresoBase = ingresos || gastos || 1;
    const recent = sortByFechaDesc(state.transacciones).slice(0, 5);
    const targets = {
      NECESIDAD: ingresos * 0.5,
      DESEO: ingresos * 0.3,
      AHORRO: ingresos * 0.2,
    };

    return {
      ingresos,
      gastos,
      balance,
      breakdown,
      totalIngresoBase,
      recent,
      targets,
    };
  }, [state.resumen, state.transacciones]);

  const safePercent = (value) => (Math.max(value, 0) / computed.totalIngresoBase) * 100;

  return (
    <Shell
      active="dashboard"
      user={toShellUser(user)}
      title={`Hola, ${user.nombre?.split(' ')[0] || ''}`}
      subtitle="Resumen del mes"
      onNavigate={onNavigate}
      action={
        <Button variant="dark" size="sm" icon={<Icon name="plus" size={16} />}>
          Movimiento
        </Button>
      }
    >
      <div className="dashboard">
        <Card className="hero">
          <div className="hero__header">
            <div>
              <div className="hero__eyebrow">Flujo del mes</div>
              <div className="hero__value">
                {formatCLP(computed.balance)}
                <span>de balance</span>
              </div>
            </div>
            <div className="hero__totals">
              <div>
                <div className="hero__label">Gastado</div>
                <div className="hero__amount">{formatCLP(computed.gastos)}</div>
              </div>
              <div>
                <div className="hero__label">Ingreso</div>
                <div className="hero__amount">{formatCLP(computed.ingresos)}</div>
              </div>
            </div>
          </div>

          <div className="flow-bar">
            {[
              {
                key: 'necesidad',
                value: computed.targets.NECESIDAD,
                label: formatShortCLP(computed.targets.NECESIDAD),
                className: 'flow-bar__segment--ink',
              },
              {
                key: 'deseo',
                value: computed.targets.DESEO,
                label: formatShortCLP(computed.targets.DESEO),
                className: 'flow-bar__segment--orange',
              },
              {
                key: 'ahorro',
                value: computed.targets.AHORRO,
                label: formatShortCLP(computed.targets.AHORRO),
                className: 'flow-bar__segment--duck',
              },
            ].map((segment) => (
              <div
                key={segment.key}
                className={`flow-bar__segment ${segment.className}`}
                style={{ flexBasis: `${safePercent(segment.value)}%` }}
              >
                {segment.label}
              </div>
            ))}
          </div>

          <div className="legend">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <div key={key} className="legend__item">
                <span className={`legend__dot legend__dot--${key.toLowerCase()}`} />
                <span>
                  {label} · <strong>{safePercent(computed.targets[key]).toFixed(0)}%</strong>
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div className="summary">
          <Card className="summary__card">
            <div className="summary__label">Ingresos</div>
            <div className="summary__value">{formatCLP(computed.ingresos)}</div>
            <Pill variant="success" size="sm">
              {formatShortCLP(computed.ingresos)}
            </Pill>
          </Card>
          <Card className="summary__card">
            <div className="summary__label">Gastos</div>
            <div className="summary__value">{formatCLP(computed.gastos)}</div>
            <Pill variant="danger" size="sm">
              {formatShortCLP(computed.gastos)}
            </Pill>
          </Card>
          <Card className="summary__card">
            <div className="summary__label">Balance</div>
            <div className="summary__value">{formatCLP(computed.balance)}</div>
            <Pill variant="duck" size="sm">
              {formatShortCLP(computed.balance)}
            </Pill>
          </Card>
        </div>

        <Card className="recent">
          <div className="recent__header">
            <div>
              <div className="recent__title">Movimientos recientes</div>
              <div className="recent__subtitle">Últimas 5 transacciones registradas</div>
            </div>
            <button type="button" className="link">
              ver todos
            </button>
          </div>

          {state.loading && <div className="state">Cargando dashboard...</div>}
          {state.error && <div className="state state--error">{state.error}</div>}
          {!state.loading && !state.error && computed.recent.length === 0 && (
            <div className="state">
              Aun no hay movimientos. Crea una transaccion para ver tu resumen.
            </div>
          )}

          {!state.loading && !state.error && computed.recent.length > 0 && (
            <div className="recent__list">
              {computed.recent.map((txn) => {
                const categoriaTipo = txn?.categoria?.tipo;
                const badge = CATEGORY_BADGES[categoriaTipo] || '?';
                const isIngreso = txn?.tipo === 'INGRESO';
                const monto = isIngreso ? parseTotal(txn.monto) : -parseTotal(txn.monto);
                return (
                  <div key={txn.id} className="recent__item">
                    <div className="recent__date">{formatShortDate(txn.fecha)}</div>
                    <div className="recent__desc">
                      <div>{txn.descripcion || 'Movimiento sin descripcion'}</div>
                      <span>
                        {categoriaTipo ? CATEGORY_LABELS[categoriaTipo] : 'Sin categoria'}
                      </span>
                    </div>
                    <div
                      className={`recent__badge ${categoriaTipo ? `recent__badge--${categoriaTipo.toLowerCase()}` : ''}`}
                    >
                      {badge}
                    </div>
                    <div className={`recent__amount ${isIngreso ? 'is-positive' : ''}`}>
                      {monto < 0 ? '-' : '+'}
                      {formatCLP(Math.abs(monto))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </Shell>
  );
}
