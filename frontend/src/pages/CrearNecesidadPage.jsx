import { useState } from 'react';
import {
  Container, Box, Typography, TextField, Button,
  MenuItem, Paper, Alert, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CATEGORIAS = ['Alimentos', 'Ropa', 'Medicinas', 'Voluntariado', 'Otros'];
const URGENCIAS  = ['alta', 'media', 'baja'];

export default function CrearNecesidadPage() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    titulo: '', descripcion: '', categoria: 'Alimentos',
    urgencia: 'media', meta: '',
  });
  const [error,   setError]   = useState('');
  const [exito,   setExito]   = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirigir si no está logueado
  if (!user) {
    return (
      <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh',
                 display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography mb={2}>Debes iniciar sesión para publicar una necesidad.</Typography>
          <Button variant="contained" onClick={() => navigate('/login')}
            sx={{ backgroundColor: '#2E7D32' }}>
            Iniciar sesión
          </Button>
        </Paper>
      </Box>
    );
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.titulo || !form.descripcion || !form.meta) {
      setError('Por favor completa todos los campos.'); return;
    }
    if (Number(form.meta) <= 0) {
      setError('La meta debe ser un número mayor a 0.'); return;
    }

    setLoading(true);
    try {
      // Simulado — se conectará a POST /api/necesidades en la siguiente etapa
      await new Promise((r) => setTimeout(r, 800));
      setExito(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch {
      setError('Error al publicar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>

          <Typography variant="h5" fontWeight="bold" mb={1}>
            Publicar necesidad
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Comparte lo que necesitas y conecta con quienes pueden ayudarte.
          </Typography>

          {error  && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}
          {exito  && <Alert severity="success" sx={{ mb: 2 }}>¡Necesidad publicada! Redirigiendo...</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Título" name="titulo"
              value={form.titulo} onChange={handleChange}
              placeholder="Ej: Despensa para familias en Guadalupe"
              sx={{ mb: 2 }} required
            />
            <TextField
              fullWidth multiline rows={4} label="Descripción" name="descripcion"
              value={form.descripcion} onChange={handleChange}
              placeholder="Describe qué necesitas, para quién y cualquier detalle relevante..."
              sx={{ mb: 2 }} required
            />
            <TextField
              select fullWidth label="Categoría" name="categoria"
              value={form.categoria} onChange={handleChange} sx={{ mb: 2 }}
            >
              {CATEGORIAS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField
              select fullWidth label="Urgencia" name="urgencia"
              value={form.urgencia} onChange={handleChange} sx={{ mb: 2 }}
            >
              {URGENCIAS.map((u) => (
                <MenuItem key={u} value={u}>
                  {u.charAt(0).toUpperCase() + u.slice(1)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth label="Meta (unidades o personas)" name="meta" type="number"
              value={form.meta} onChange={handleChange}
              helperText="Ej: 20 despensas, 15 voluntarios, 50 prendas"
              inputProps={{ min: 1 }} sx={{ mb: 3 }} required
            />
            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={loading || exito}
              sx={{ backgroundColor: '#2E7D32', '&:hover': { backgroundColor: '#1b5e20' } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Publicar necesidad'}
            </Button>
          </Box>

        </Paper>
      </Container>
    </Box>
  );
}