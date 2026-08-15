import { useState } from 'react';
import {
  Container, Box, TextField, Button, Typography,
  Paper, Alert, CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginService } from '../services/authService';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginService({
        email: form.email,
        password: form.password,
      });
      // El backend responde { token, usuario } según tu diseño técnico
      login(res.data.usuario, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh',
               display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>

          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
            Iniciar sesión
          </Typography>
          <Typography color="text.secondary" textAlign="center" mb={3}>
            Bienvenido de nuevo a ConectaSolidaria
          </Typography>
          <Typography align="center" variant="body2"></Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Correo electrónico" name="email" type="email"
              value={form.email} onChange={handleChange}
              sx={{ mb: 2 }} required
            />
            <TextField
              fullWidth label="Contraseña" name="password" type="password"
              value={form.password} onChange={handleChange}
              sx={{ mb: 3 }} required
            />
            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={loading}
              sx={{ backgroundColor: '#2E7D32', mb: 2,
                    '&:hover': { backgroundColor: '#1b5e20' } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar sesión'}
            </Button>
          </Box>

          <Typography textAlign="center" variant="body2">
            ¿No tienes cuenta?{' '}
            <Link to="/register" style={{ color: '#2E7D32', fontWeight: 'bold' }}>
              Regístrate aquí
            </Link>
          </Typography>

        </Paper>
      </Container>
    </Box>
  );
}