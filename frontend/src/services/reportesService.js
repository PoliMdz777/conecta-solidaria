import api from './api';

export const getDonacionesPorCategoria = () => api.get('/reportes/donaciones-por-categoria');
export const getTopColaboradores       = () => api.get('/reportes/top-colaboradores');
export const getNecesidadesUrgentes    = () => api.get('/reportes/necesidades-urgentes');
export const getUsuariosPorRol         = () => api.get('/reportes/usuarios-por-rol'); 