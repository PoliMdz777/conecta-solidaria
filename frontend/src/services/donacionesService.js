import api from './api';

export const getDonaciones  = ()      => api.get('/donaciones');
export const createDonacion = (datos) => api.post('/donaciones', datos);