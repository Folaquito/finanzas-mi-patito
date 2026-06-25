import { request } from './client';

export const getResumen = (usuarioId) => request(`/resumen/${usuarioId}`);

export const getCuentasByUsuario = (usuarioId) => request(`/cuentas/usuario/${usuarioId}`);

export const getTransaccionesByCuenta = (cuentaId) => request(`/transacciones/cuenta/${cuentaId}`);
