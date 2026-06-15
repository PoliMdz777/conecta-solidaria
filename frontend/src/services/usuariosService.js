import api from './api';

export const getMe      = ()   => api.get('/usuarios/me');
export const getUsuarios = ()  => api.get('/usuarios');
export const verificarUsuario = (id) => api.patch(`/usuarios/${id}/verificar`);