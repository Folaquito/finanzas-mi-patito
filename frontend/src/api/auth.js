import { request } from './client';

export const login = (email, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const registrar = ({ nombre, email, password, telefono }) =>
  request('/usuarios', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, password, telefono }),
  });

export const recuperarClave = (email) =>
  request('/auth/recuperar', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

export const resetClave = (token, nuevaClave) =>
  request('/auth/reset-clave', {
    method: 'POST',
    body: JSON.stringify({ token, nuevaClave }),
  });

export const cambiarPassword = (email, claveActual, nuevaClave) =>
  request('/auth/cambiar-password', {
    method: 'POST',
    body: JSON.stringify({ email, claveActual, nuevaClave }),
  });
