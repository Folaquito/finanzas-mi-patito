import { useEffect, useState } from 'react';
import { getPresupuesto } from '../api/finanzas';
import Shell from '../components/Shell';
import { Card, Pill } from '../components/ui';
import { useAuth } from '../context/auth-context';
import { formatCLP, toNumber } from '../utils/format';
import { toShellUser } from '../utils/user';
import './presupuesto.css';

const CATEGORIA_LABEL = {
  NECESIDAD: 'Necesidades',
  DESEO: 'Deseos',
  AHORRO: 'Ahorro',
};

function BudgetLine({ linea }) {
  const presupuestado = toNumber(linea.presupuestado);
  const gastado = toNumber(linea.gastado);
  const disponible = toNumber(linea.disponible);
  const usado = presupuestado > 0 ? (gastado / presupuestado) * 100 : 0;
  const sobregiro = disponible < 0;
  const key = linea.categoria.toLowerCase();

  return (
    <Card className="budget-line">
      <div className="budget-line__head">
        <div className="budget-line__title">
          <span className={`legend__dot legend__dot--${key}`} />
          {CATEGORIA_LABEL[linea.categoria] || linea.categoria}
          <span className="budget-line__pct">{linea.porcentajeObjetivo}%</span>
        </div>
        <Pill variant={sobregiro ? 'danger' : 'success'} size="sm">
          {sobregiro ? 'Excedido' : 'En rango'}
        </Pill>
      </div>

      <div className="budget-line__bar">
        <div
          className={`budget-line__fill budget-line__fill--${key} ${sobregiro ? 'is-over' : ''}`}
          style={{ width: `${Math.min(usado, 100)}%` }}
        />
      </div>

      <div className="budget-line__foot">
        <span>
          Gastado <strong>{formatCLP(gastado)}</strong> de {formatCLP(presupuestado)}
        </span>
        <span className={`budget-line__avail ${sobregiro ? 'is-over' : ''}`}>
          {sobregiro ? 'Te pasaste por ' : 'Disponible '}
          <strong>{formatCLP(Math.abs(disponible))}</strong>
        </span>
      </div>
    </Card>
  );
}

export default function Presupuesto({ onNavigate }) {
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    let mounted = true;

    getPresupuesto(user.id)
      .then((data) => {
        if (mounted) setState({ loading: false, error: null, data });
      })
      .catch((err) => {
        if (mounted) {
          setState({
            loading: false,
            error: err?.message || 'No se pudo cargar el presupuesto.',
            data: null,
          });
        }
      });

    return () => {
      mounted = false;
    };
  }, [user.id]);

  const { loading, error, data } = state;

  return (
    <Shell
      active="presupuesto"
      user={toShellUser(user)}
      title="Presupuesto"
      subtitle="Regla 50/30/20 sobre tus ingresos"
      onNavigate={onNavigate}
    >
      <div className="presupuesto">
        {loading && <div className="state">Cargando presupuesto…</div>}
        {error && <div className="state state--error">{error}</div>}

        {!loading && !error && data && (
          <>
            <Card className="presupuesto__total">
              <div className="presupuesto__total-label">Ingresos del período</div>
              <div className="presupuesto__total-value">{formatCLP(data.totalIngresos)}</div>
              <p className="presupuesto__total-hint">
                Distribuimos tus ingresos en 50% necesidades, 30% deseos y 20% ahorro.
              </p>
            </Card>

            <div className="presupuesto__lines">
              {data.lineas.map((linea) => (
                <BudgetLine key={linea.categoria} linea={linea} />
              ))}
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}
