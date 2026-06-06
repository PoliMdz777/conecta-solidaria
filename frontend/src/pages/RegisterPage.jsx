import { useState } from 'react';
import {
  Container, Box, TextField, Button, Typography,
  Paper, Alert, CircularProgress, MenuItem
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { value: 'user',  label: 'Usuario (colaborar / publicar necesidades)' },
  { value: 'admin', label: 'Administrador' },
];

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    nombre: '', email: '', password: '', confirmar: '', rol: 'user',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.nombre || !form.email || !form.password || !form.confirmar) {
      setError('Por favor completa todos los campos.'); return;
    }
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.'); return;
    }
    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden.'); return;
    }

    setLoading(true);
    try {
      // Simulado — se conectará al backend después
      const fakeUser  = { id: '2', nombre: form.nombre, email: form.email, rol: form.rol };
      const fakeToken = 'fake-jwt-token';
      login(fakeUser, fakeToken);
      navigate('/dashboard');
    } catch {
      setError('Error al registrar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh',
               display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>

          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
            Crear cuenta
          </Typography>
          <Typography color="text.secondary" textAlign="center" mb={3}>
            Únete a ConectaSolidaria
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Nombre completo" name="nombre"
              value={form.nombre} onChange={handleChange} sx={{ mb: 2 }} required
            />
            <TextField
              fullWidth label="Correo electrónico" name="email" type="email"
              value={form.email} onChange={handleChange} sx={{ mb: 2 }} required
            />
            <TextField
              fullWidth label="Contraseña" name="password" type="password"
              value={form.password} onChange={handleChange}
              helperText="Mínimo 8 caracteres" sx={{ mb: 2 }} required
            />
            <TextField
              fullWidth label="Confirmar contraseña" name="confirmar" type="password"
              value={form.confirmar} onChange={handleChange} sx={{ mb: 2 }} required
            />
            <TextField
              select fullWidth label="Tipo de cuenta" name="rol"
              value={form.rol} onChange={handleChange} sx={{ mb: 3 }}
            >
              {ROLES.map((r) => (
                <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
              ))}
            </TextField>

            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={loading}
              sx={{ backgroundColor: '#2E7D32', mb: 2,
                    '&:hover': { backgroundColor: '#1b5e20' } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Crear cuenta'}
            </Button>
          </Box>

          <Typography textAlign="center" variant="body2">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color: '#2E7D32', fontWeight: 'bold' }}>
              Inicia sesión
            </Link>
          </Typography>

        </Paper>
      </Container>
    </Box>
  );
}