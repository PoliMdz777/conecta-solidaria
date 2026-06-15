import api from './api';

export const register = (datos) => api.post('/auth/register', datos);
export const login    = (datos) => api.post('/auth/login', datos);