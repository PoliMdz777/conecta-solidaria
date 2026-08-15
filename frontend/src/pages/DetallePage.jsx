import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Button, Chip, LinearProgress,
  Paper, Divider, TextField, MenuItem, Alert, CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import GroupsIcon    from '@mui/icons-material/Groups';
import { useAuth }   from '../context/AuthContext';
import { getNecesidad } from '../services/necesidadesService';
import { createDonacion } from '../services/donacionesService';
import { createVoluntariado } from '../services/voluntariadosService';

const COLORES = { alta: '#d32f2f', media: '#f57c00', baja: '#388e3c' };

export default function DetallePage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [necesidad,   setNecesidad]   = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [tipo,        setTipo]        = useState('articulo');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad,    setCantidad]    = useState('');
  const [horas,       setHoras]       = useState('');
  const [exito,       setExito]       = useState('');
  const [error,       setError]       = useState('');
  const [enviando,    setEnviando]    = useState(false);

  useEffect(() => {
    getNecesidad(id)
      .then(({ data }) => setNecesidad(data))
      .catch(() => setNecesidad(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
      <CircularProgress sx={{ color: '#2E7D32' }} />
    </Box>
  );

  if (!necesidad) return (
    <Container sx={{ py: 6, textAlign: 'center' }}>
      <Typography variant="h5" color="text.secondary">Necesidad no encontrada.</Typography>
      <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>Volver</Button>
    </Container>
  );

  const porcentaje = Math.min((necesidad.progreso / necesidad.meta) * 100, 100);

  const handleContribuir = async (e) => {
    e.preventDefault();
    setError(''); setExito(''); setEnviando(true);
    try {
      if (tipo === 'articulo') {
        await createDonacion({ necesidad: id, descripcionArticulo: descripcion, cantidad: Number(cantidad) });
        setExito('¡Donación registrada exitosamente!');
      } else {
        await createVoluntariado({ necesidad: id, horasOfrecidas: Number(horas), fechaInicio: new Date().toISOString() });
        setExito('¡Te registraste como voluntario exitosamente!');
      }
      setDescripcion(''); setCantidad(''); setHoras('');
      // Recargar la necesidad para ver el progreso actualizado
      const { data } = await getNecesidad(id);
      setNecesidad(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')} sx={{ mb: 2, color: '#2E7D32' }}>
          Volver
        </Button>

        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label={necesidad.categoria} sx={{ backgroundColor: '#e8f5e9' }} />
            <Chip label={necesidad.urgencia.toUpperCase()}
              sx={{ backgroundColor: COLORES[necesidad.urgencia], color: 'white' }} />
          </Box>
          <Typography variant="h4" fontWeight="bold" mb={1}>{necesidad.titulo}</Typography>
          <Typography color="text.secondary" mb={1}>
            Publicado por <strong>{necesidad.solicitante?.nombre || 'Usuario'}</strong> · {new Date(necesidad.createdAt).toLocaleDateString()}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" mb={3} sx={{ lineHeight: 1.8 }}>{necesidad.descripcion}</Typography>
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" fontWeight="bold">Progreso</Typography>
            <Typography variant="body2" color="text.secondary">
              {necesidad.progreso} / {necesidad.meta} ({Math.round(porcentaje)}%)
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={porcentaje}
            sx={{ height: 12, borderRadius: 6, '& .MuiLinearProgress-bar': { backgroundColor: '#2E7D32' } }} />
        </Paper>

        {user ? (
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>¿Cómo quieres ayudar?</Typography>
            {exito && <Alert severity="success" sx={{ mb: 2 }}>{exito}</Alert>}
            {error && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleContribuir}>
              <TextField select fullWidth label="Tipo de contribución" value={tipo}
                onChange={(e) => { setTipo(e.target.value); setExito(''); setError(''); }} sx={{ mb: 2 }}>
                <MenuItem value="articulo"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><VolunteerActivismIcon fontSize="small" /> Donar artículos</Box></MenuItem>
                <MenuItem value="voluntariado"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><GroupsIcon fontSize="small" /> Ser voluntario</Box></MenuItem>
              </TextField>
              {tipo === 'articulo' && <>
                <TextField fullWidth label="¿Qué artículo donas?" value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)} sx={{ mb: 2 }} required />
                  <TextField fullWidth label="Cantidad" type="number" value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)} sx={{ mb: 2 }} required
                    slotProps={{ htmlInput: { min: 1 } }} />
              </>}
              {tipo === 'voluntariado' && (
                <TextField fullWidth label="Horas que puedes ofrecer" type="number" value={horas}
                    onChange={(e) => setHoras(e.target.value)} sx={{ mb: 2 }} required
                    slotProps={{ htmlInput: { min: 1 } }} />
              )}
              <Button type="submit" variant="contained" size="large" fullWidth disabled={enviando}
                sx={{ backgroundColor: '#2E7D32', '&:hover': { backgroundColor: '#1b5e20' } }}>
                {enviando ? <CircularProgress size={24} color="inherit" /> : 'Confirmar contribución'}
              </Button>
            </Box>
          </Paper>
        ) : (
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
            <Typography mb={2} color="text.secondary">Inicia sesión para contribuir.</Typography>
            <Button variant="contained" onClick={() => navigate('/login')} sx={{ backgroundColor: '#2E7D32' }}>
              Iniciar sesión
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
}