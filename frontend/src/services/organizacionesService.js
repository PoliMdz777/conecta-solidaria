import api from './api';

export const getOrganizaciones  = ()      => api.get('/organizaciones');
export const getOrganizacion    = (id)    => api.get(`/organizaciones/${id}`);
export const createOrganizacion = (datos) => api.post('/organizaciones', datos);
export const updateOrganizacion = (id, datos) => api.put(`/organizaciones/${id}`, datos);
export const desactivarOrganizacion = (id) => api.patch(`/organizaciones/${id}/desactivar`);