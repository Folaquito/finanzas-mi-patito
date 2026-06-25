// Mock data for HiFi prototype — DB-shaped (usuarios, cuentas, categorias, transacciones, metas)

const USUARIO = {
  id: 1,
  nombre: 'Joaquín Fernández',
  email: 'jfernandez@duocuc.cl',
  telefono: '+56 9 1234 5678',
  fecha_creacion: '2026-01-15',
  // computed
  initials: 'JF',
  duck_stage: 3, // 1-egg, 2-chick, 3-duck, 4-king
  duck_progress: 34, // % to next stage
  racha_meses: 3,
};

const CUENTAS = [
  { id: 1, usuario_id: 1, nombre: 'Cuenta Corriente', tipo: 'CORRIENTE', saldo: 845230, banco: 'Banco Estado' },
  { id: 2, usuario_id: 1, nombre: 'Cuenta Vista',     tipo: 'VISTA',     saldo: 230000, banco: 'Banco Falabella' },
  { id: 3, usuario_id: 1, nombre: 'Patito Ahorro',    tipo: 'AHORRO',    saldo: 170000, banco: 'Banco Estado' },
];

const CATEGORIAS = [
  { id: 1,  nombre: 'Arriendo',       tipo: 'NECESIDAD', icon: '🏠' },
  { id: 2,  nombre: 'Supermercado',   tipo: 'NECESIDAD', icon: '🛒' },
  { id: 3,  nombre: 'Servicios',      tipo: 'NECESIDAD', icon: '💡' },
  { id: 4,  nombre: 'Transporte',     tipo: 'NECESIDAD', icon: '🚇' },
  { id: 5,  nombre: 'Salud',          tipo: 'NECESIDAD', icon: '💊' },
  { id: 6,  nombre: 'Restaurantes',   tipo: 'DESEO',     icon: '🍔' },
  { id: 7,  nombre: 'Entretenimiento',tipo: 'DESEO',     icon: '🎬' },
  { id: 8,  nombre: 'Compras',        tipo: 'DESEO',     icon: '🛍️' },
  { id: 9,  nombre: 'Suscripciones',  tipo: 'DESEO',     icon: '📺' },
  { id: 10, nombre: 'Ahorro',         tipo: 'AHORRO',    icon: '🐣' },
  { id: 11, nombre: 'Inversión',      tipo: 'AHORRO',    icon: '📈' },
  { id: 12, nombre: 'Ingreso',        tipo: 'INGRESO',   icon: '💵' },
];

// helper to find category
const cat = (id) => CATEGORIAS.find(c => c.id === id);

const TRANSACCIONES = [
  { id: 1,  cuenta_id: 1, categoria_id: 12, monto:  850000, tipo: 'INGRESO', tipo_movimiento: 'DEPOSITO',     descripcion: 'Sueldo abril 2026',     fecha: '2026-04-13', banco_origen: 'DuocUC',         nombre_origen: 'Duoc UC' },
  { id: 2,  cuenta_id: 1, categoria_id: 1,  monto: -220000, tipo: 'GASTO',   tipo_movimiento: 'TRANSFERENCIA',descripcion: 'Arriendo abril',         fecha: '2026-04-05', banco_destino: 'Banco BCI',     nombre_destino: 'Inmobiliaria Sur' },
  { id: 3,  cuenta_id: 1, categoria_id: 3,  monto: -28400,  tipo: 'GASTO',   tipo_movimiento: 'PAGO',         descripcion: 'Enel · cuenta luz',      fecha: '2026-04-08', nombre_destino: 'Enel Distribución' },
  { id: 4,  cuenta_id: 1, categoria_id: 3,  monto: -16800,  tipo: 'GASTO',   tipo_movimiento: 'PAGO',         descripcion: 'Aguas Andinas',          fecha: '2026-04-09', nombre_destino: 'Aguas Andinas' },
  { id: 5,  cuenta_id: 1, categoria_id: 2,  monto: -68500,  tipo: 'GASTO',   tipo_movimiento: 'PAGO',         descripcion: 'Líder · compra mensual', fecha: '2026-04-10', nombre_destino: 'Walmart Chile' },
  { id: 6,  cuenta_id: 1, categoria_id: 5,  monto: -12300,  tipo: 'GASTO',   tipo_movimiento: 'PAGO',         descripcion: 'Farmacia Cruz Verde',    fecha: '2026-04-10', nombre_destino: 'Cruz Verde' },
  { id: 7,  cuenta_id: 1, categoria_id: 4,  monto: -34000,  tipo: 'GASTO',   tipo_movimiento: 'PAGO',         descripcion: 'Bip! recarga',           fecha: '2026-04-11', nombre_destino: 'Metro Santiago' },
  { id: 8,  cuenta_id: 1, categoria_id: 7,  monto: -4200,   tipo: 'GASTO',   tipo_movimiento: 'PAGO',         descripcion: 'Uber a Las Condes',      fecha: '2026-04-11', nombre_destino: 'Uber BV' },
  { id: 9,  cuenta_id: 1, categoria_id: 10, monto: -170000, tipo: 'GASTO',   tipo_movimiento: 'TRANSFERENCIA',descripcion: 'Transf. a Patito Ahorro',fecha: '2026-04-12', cuenta_destino: 'Patito Ahorro', banco_destino: 'Banco Estado' },
  { id: 10, cuenta_id: 1, categoria_id: 9,  monto: -8990,   tipo: 'GASTO',   tipo_movimiento: 'PAGO',         descripcion: 'Netflix',                fecha: '2026-04-14', nombre_destino: 'Netflix Chile' },
  { id: 11, cuenta_id: 1, categoria_id: 6,  monto: -16500,  tipo: 'GASTO',   tipo_movimiento: 'PAGO',         descripcion: 'Pedidos Ya · Doggis',    fecha: '2026-04-14', nombre_destino: 'Pedidos Ya' },
  { id: 12, cuenta_id: 1, categoria_id: 2,  monto: -24500,  tipo: 'GASTO',   tipo_movimiento: 'PAGO',         descripcion: 'Líder · compra',          fecha: '2026-04-15', nombre_destino: 'Walmart Chile' },
  { id: 13, cuenta_id: 1, categoria_id: 8,  monto: -32990,  tipo: 'GASTO',   tipo_movimiento: 'PAGO',         descripcion: 'H&M · jeans',            fecha: '2026-04-07', nombre_destino: 'H&M' },
  { id: 14, cuenta_id: 1, categoria_id: 9,  monto: -5990,   tipo: 'GASTO',   tipo_movimiento: 'PAGO',         descripcion: 'Spotify Premium',        fecha: '2026-04-03', nombre_destino: 'Spotify' },
];

const METAS = [
  { id: 1, usuario_id: 1, nombre: 'Vacaciones al sur',      monto_objetivo: 800000,  monto_actual: 320000, fecha_limite: '2026-12-15', fecha_creacion: '2026-02-01', icon: '🏖️' },
  { id: 2, usuario_id: 1, nombre: 'Notebook nuevo',         monto_objetivo: 600000,  monto_actual: 180000, fecha_limite: '2026-08-30', fecha_creacion: '2026-03-10', icon: '💻' },
  { id: 3, usuario_id: 1, nombre: 'Fondo de emergencia',    monto_objetivo: 2000000, monto_actual: 450000, fecha_limite: null,         fecha_creacion: '2026-01-15', icon: '🛟' },
  { id: 4, usuario_id: 1, nombre: 'Curso de inglés',         monto_objetivo: 350000,  monto_actual: 350000, fecha_limite: '2026-05-01', fecha_creacion: '2026-02-20', icon: '📚', completada: true },
];

// Computed budget breakdown for the month
const PRESUPUESTO = {
  mes: 'Abril 2026',
  ingreso_total: 850000,
  // 50/30/20 targets (user can adjust)
  pct: { necesidad: 50, deseo: 30, ahorro: 20 },
  // computed gastado por tipo (April actual)
  gastado: {
    necesidad: 380000, // arriendo + enel + agua + lider*2 + farmacia + bip
    deseo:     78670,  // uber + netflix + doggis + h&m + spotify
    ahorro:    170000, // transf
  },
  presupuestado: {
    necesidad: 425000, // 50% of 850k
    deseo:     255000, // 30%
    ahorro:    170000, // 20%
  },
};

// Tips por contexto (curated)
const TIPS = [
  { id: 1, titulo: 'La regla 50/30/20 explicada', resumen: 'Cómo dividir tu sueldo en 3 mochilas y vivir tranquilo.', tag: 'Básico', mins: 3, icon: '🐣' },
  { id: 2, titulo: 'Tu primer fondo de emergencia', resumen: '3 meses de gastos en una cuenta separada — el seguro más barato.', tag: 'Ahorro', mins: 4, icon: '🛟' },
  { id: 3, titulo: '¿Necesidad o deseo?', resumen: 'La pregunta de un peso (literal) que ordena tus compras.', tag: 'Mindset', mins: 2, icon: '🤔' },
  { id: 4, titulo: 'Suscripciones zombi', resumen: 'Las cobranzas que olvidaste y te roban $30k al mes.', tag: 'Hack', mins: 3, icon: '🧟' },
  { id: 5, titulo: 'Presupuesto Base Cero', resumen: 'Asigna cada peso a un trabajo. Avanzado, pero potente.', tag: 'Avanzado', mins: 6, icon: '🎯' },
];

Object.assign(window, { USUARIO, CUENTAS, CATEGORIAS, TRANSACCIONES, METAS, PRESUPUESTO, TIPS, cat });
