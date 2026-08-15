import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:4000/api' });

// Agregar token JWT automáticamente a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Si el backend responde 401, la sesión ya no es válida: limpiar y redirigir
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Evita un loop de redirects si ya estás en /login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;


/*
Detalle importante: el if (window.location.pathname !== '/login')

Sin este check, si por alguna razón la ruta /login también hiciera 
alguna petición protegida por error, entrarías en un loop infinito de redirects. 
Es una salvaguarda barata pero vale la pena tenerla.
*/ 