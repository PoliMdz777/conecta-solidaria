import api from './api';

export const getNotificaciones  = ()      => api.get('/notificaciones');
export const createNotificacion = (datos) => api.post('/notificaciones', datos);
export const marcarLeida        = (id)    => api.patch(`/notificaciones/${id}/leida`);
export const desactivarNotificacion = (id) => api.patch(`/notificaciones/${id}/desactivar`);