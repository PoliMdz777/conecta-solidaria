import api from './api';

export const getNecesidades  = (params) => api.get('/necesidades', { params });
export const getNecesidad    = (id)     => api.get(`/necesidades/${id}`);
export const createNecesidad = (datos)  => api.post('/necesidades', datos);
export const deleteNecesidad = (id)     => api.delete(`/necesidades/${id}`);