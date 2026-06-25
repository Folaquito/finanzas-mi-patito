export const toNumber = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

export const formatCLP = (value) => {
  const numeric = toNumber(value);
  const amount = Math.round(Math.abs(numeric));
  const sign = numeric < 0 ? '-' : '';
  return `${sign}$${amount.toLocaleString('es-CL')}`;
};

export const formatSignedCLP = (value) => {
  const amount = toNumber(value);
  const sign = amount < 0 ? '-' : '+';
  const formatted = formatCLP(Math.abs(amount));
  return `${sign}${formatted}`;
};

export const formatShortCLP = (value) => {
  const numeric = toNumber(value);
  const amount = Math.round(Math.abs(numeric) / 1000);
  const sign = numeric < 0 ? '-' : '';
  return `${sign}$${amount.toLocaleString('es-CL')}k`;
};

export const formatShortDate = (value) => {
  if (!value) {
    return '-';
  }

  const date = Array.isArray(value)
    ? new Date(value[0], (value[1] || 1) - 1, value[2] || 1)
    : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
  }).format(date);
};
