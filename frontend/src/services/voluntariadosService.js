import api from './api';

export const getVoluntariados  = ()      => api.get('/voluntariados');
export const createVoluntariado = (datos) => api.post('/voluntariados', datos);