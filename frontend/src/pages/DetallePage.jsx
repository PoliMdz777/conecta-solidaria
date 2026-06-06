import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Button, Chip,
  LinearProgress, Paper, Divider, TextField,
  MenuItem, Alert
} from '@mui/material';
import ArrowBackIcon  from '@mui/icons-material/ArrowBack';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import GroupsIcon     from '@mui/icons-material/Groups';
import { useAuth }    from '../context/AuthContext';

// Mismos datos demo del dashboard
const NECESIDADES_DEMO = [
  {
    _id: '1', titulo: 'Despensa para familias en Guadalupe',
    descripcion: 'Necesitamos apoyo con despensas básicas para 20 familias afectadas por las inundaciones recientes en la colonia. Cada despensa incluye arroz, frijol, aceite, atún y leche en polvo.',
    categoria: 'Alimentos', urgencia: 'alta', meta: 20, progreso: 8,
    solicitante: { nombre: 'Cruz Roja Guadalupe' },
    fechaCreacion: '2026-05-10',
  },
  {
    _id: '2', titulo: 'Ropa de invierno para niños',
    descripcion: 'Buscamos donaciones de ropa abrigadora talla 2 a 10 para niños del albergue municipal. Se aceptan suéteres, chamarras y pantalones en buen estado.',
    categoria: 'Ropa', urgencia: 'media', meta: 50, progreso: 23,
    solicitante: { nombre: 'Albergue Esperanza' },
    fechaCreacion: '2026-05-15',
  },
  {
    _id: '3', titulo: 'Voluntarios para limpieza de parque',
    descripcion: 'Necesitamos 15 voluntarios el próximo sábado para rehabilitar el parque. Actividades: pintura de bancas, recolección de basura y siembra de plantas.',
    categoria: 'Voluntariado', urgencia: 'baja', meta: 15, progreso: 6,
    solicitante: { nombre: 'Vecinos Unidos NL' },
    fechaCreacion: '2026-05-20',
  },
  {
    _id: '4', titulo: 'Medicamentos para adultos mayores',
    descripcion: 'Casa hogar solicita medicamentos básicos: paracetamol, antiácidos, vendas y gasas para atender a 30 adultos mayores residentes.',
    categoria: 'Medicinas', urgencia: 'alta', meta: 100, progreso: 40,
    solicitante: { nombre: 'Casa Hogar San José' },
    fechaCreacion: '2026-05-18',
  },
  {
    _id: '5', titulo: 'Útiles escolares para primaria',
    descripcion: 'Colecta de cuadernos, lápices y colores para 30 niños de primaria en zona marginada del municipio de García.',
    categoria: 'Otros', urgencia: 'media', meta: 30, progreso: 12,
    solicitante: { nombre: 'Fundación Educando' },
    fechaCreacion: '2026-05-22',
  },
  {
    _id: '6', titulo: 'Alimentos para refugio animal',
    descripcion: 'El refugio municipal necesita croquetas y alimento enlatado para más de 80 perros y gatos rescatados. Cualquier marca es bienvenida.',
    categoria: 'Alimentos', urgencia: 'alta', meta: 200, progreso: 75,
    solicitante: { nombre: 'Refugio Animal MTY' },
    fechaCreacion: '2026-05-25',
  },
];

const COLORES_URGENCIA = { alta: '#d32f2f', media: '#f57c00', baja: '#388e3c' };

export default function DetallePage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const necesidad  = NECESIDADES_DEMO.find((n) => n._id === id);

  const [tipo,        setTipo]        = useState('articulo');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad,    setCantidad]    = useState('');
  const [horas,       setHoras]       = useState('');
  const [exito,       setExito]       = useState('');

  if (!necesidad) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          Necesidad no encontrada.
        </Typography>
        <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Volver al dashboard
        </Button>
      </Container>
    );
  }

  const porcentaje = Math.min((necesidad.progreso / necesidad.meta) * 100, 100);

  const handleContribuir = (e) => {
    e.preventDefault();
    // Se conectará a la API en la siguiente etapa
    setExito(
      tipo === 'voluntariado'
        ? '¡Te registraste como voluntario exitosamente!'
        : '¡Tu donación fue registrada exitosamente!'
    );
    setDescripcion(''); setCantidad(''); setHoras('');
  };

  return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">

        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')}
          sx={{ mb: 2, color: '#2E7D32' }}>
          Volver
        </Button>

        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, mb: 3 }}>

          {/* Chips de categoría y urgencia */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label={necesidad.categoria} sx={{ backgroundColor: '#e8f5e9' }} />
            <Chip
              label={necesidad.urgencia.toUpperCase()}
              sx={{ backgroundColor: COLORES_URGENCIA[necesidad.urgencia], color: 'white' }}
            />
          </Box>

          <Typography variant="h4" fontWeight="bold" mb={1}>
            {necesidad.titulo}
          </Typography>

          <Typography color="text.secondary" mb={1}>
            Publicado por <strong>{necesidad.solicitante.nombre}</strong> · {necesidad.fechaCreacion}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" mb={3} sx={{ lineHeight: 1.8 }}>
            {necesidad.descripcion}
          </Typography>

          {/* Barra de progreso */}
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" fontWeight="bold">Progreso</Typography>
            <Typography variant="body2" color="text.secondary">
              {necesidad.progreso} / {necesidad.meta} unidades ({Math.round(porcentaje)}%)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate" value={porcentaje}
            sx={{ height: 12, borderRadius: 6, mb: 3,
                  '& .MuiLinearProgress-bar': { backgroundColor: '#2E7D32' } }}
          />
        </Paper>

        {/* Formulario de contribución */}
        {user ? (
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              ¿Cómo quieres ayudar?
            </Typography>

            {exito && <Alert severity="success" sx={{ mb: 2 }}>{exito}</Alert>}

            <Box component="form" onSubmit={handleContribuir}>
              <TextField
                select fullWidth label="Tipo de contribución" value={tipo}
                onChange={(e) => { setTipo(e.target.value); setExito(''); }}
                sx={{ mb: 2 }}
              >
                <MenuItem value="articulo">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VolunteerActivismIcon fontSize="small" /> Donar artículos
                  </Box>
                </MenuItem>
                <MenuItem value="voluntariado">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupsIcon fontSize="small" /> Ser voluntario
                  </Box>
                </MenuItem>
              </TextField>

              {tipo === 'articulo' && (
                <>
                  <TextField
                    fullWidth label="¿Qué artículo donas?" value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    sx={{ mb: 2 }} required
                  />
                  <TextField
                    fullWidth label="Cantidad" type="number" value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    sx={{ mb: 2 }} required inputProps={{ min: 1 }}
                  />
                </>
              )}

              {tipo === 'voluntariado' && (
                <TextField
                  fullWidth label="Horas que puedes ofrecer" type="number"
                  value={horas} onChange={(e) => setHoras(e.target.value)}
                  sx={{ mb: 2 }} required inputProps={{ min: 1 }}
                />
              )}

              <Button type="submit" variant="contained" size="large" fullWidth
                sx={{ backgroundColor: '#2E7D32', '&:hover': { backgroundColor: '#1b5e20' } }}>
                Confirmar contribución
              </Button>
            </Box>
          </Paper>
        ) : (
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
            <Typography mb={2} color="text.secondary">
              Inicia sesión para poder contribuir a esta necesidad.
            </Typography>
            <Button variant="contained"
              onClick={() => navigate('/login')}
              sx={{ backgroundColor: '#2E7D32' }}>
              Iniciar sesión
            </Button>
          </Paper>
        )}

      </Container>
    </Box>
  );
}