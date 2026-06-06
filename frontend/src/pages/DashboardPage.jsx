import { useState } from 'react';
import {
  Container, Grid, Typography, Box, TextField,
  MenuItem, InputAdornment, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import NecesidadCard from '../components/NecesidadCard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CATEGORIAS = ['Todas', 'Alimentos', 'Ropa', 'Medicinas', 'Voluntariado', 'Otros'];
const URGENCIAS  = ['Todas', 'alta', 'media', 'baja'];

// Datos de ejemplo — se reemplazarán con llamadas a la API
const NECESIDADES_DEMO = [
  {
    _id: '1', titulo: 'Despensa para familias en Guadalupe',
    descripcion: 'Necesitamos apoyo con despensas básicas para 20 familias afectadas por las inundaciones recientes en la colonia.',
    categoria: 'Alimentos', urgencia: 'alta', meta: 20, progreso: 8,
  },
  {
    _id: '2', titulo: 'Ropa de invierno para niños',
    descripcion: 'Buscamos donaciones de ropa abrigadora talla 2 a 10 para niños del albergue municipal.',
    categoria: 'Ropa', urgencia: 'media', meta: 50, progreso: 23,
  },
  {
    _id: '3', titulo: 'Voluntarios para limpieza de parque',
    descripcion: 'Necesitamos 15 voluntarios el próximo sábado para rehabilitar el parque Fundidora sector norte.',
    categoria: 'Voluntariado', urgencia: 'baja', meta: 15, progreso: 6,
  },
  {
    _id: '4', titulo: 'Medicamentos para adultos mayores',
    descripcion: 'Casa hogar solicita medicamentos básicos: paracetamol, antiácidos, vendas y gasas.',
    categoria: 'Medicinas', urgencia: 'alta', meta: 100, progreso: 40,
  },
  {
    _id: '5', titulo: 'Útiles escolares para primaria',
    descripcion: 'Colecta de cuadernos, lápices y colores para 30 niños de primaria en zona marginada.',
    categoria: 'Otros', urgencia: 'media', meta: 30, progreso: 12,
  },
  {
    _id: '6', titulo: 'Alimentos para refugio animal',
    descripcion: 'El refugio municipal necesita croquetas y alimento enlatado para más de 80 perros y gatos.',
    categoria: 'Alimentos', urgencia: 'alta', meta: 200, progreso: 75,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [busqueda,  setBusqueda]  = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [urgencia,  setUrgencia]  = useState('Todas');

  const filtradas = NECESIDADES_DEMO.filter((n) => {
    const coincideTexto    = n.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                             n.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === 'Todas' || n.categoria === categoria;
    const coincideUrgencia  = urgencia  === 'Todas' || n.urgencia  === urgencia;
    return coincideTexto && coincideCategoria && coincideUrgencia;
  });

  return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh', py: 4 }}>
      <Container>

        {/* Encabezado */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between',
                   alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Necesidades activas
            </Typography>
            <Typography color="text.secondary">
              {filtradas.length} resultado{filtradas.length !== 1 ? 's' : ''} encontrado{filtradas.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          {user && (
            <Button
              variant="contained" startIcon={<AddIcon />}
              onClick={() => navigate('/crear')}
              sx={{ backgroundColor: '#2E7D32', '&:hover': { backgroundColor: '#1b5e20' } }}
            >
              Publicar necesidad
            </Button>
          )}
        </Box>

        {/* Filtros */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Buscar necesidades..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200, backgroundColor: 'white', borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select label="Categoría" value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            sx={{ minWidth: 150, backgroundColor: 'white', borderRadius: 1 }}
          >
            {CATEGORIAS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField
            select label="Urgencia" value={urgencia}
            onChange={(e) => setUrgencia(e.target.value)}
            sx={{ minWidth: 140, backgroundColor: 'white', borderRadius: 1 }}
          >
            {URGENCIAS.map((u) => <MenuItem key={u} value={u}>{u === 'Todas' ? 'Todas' : u.charAt(0).toUpperCase() + u.slice(1)}</MenuItem>)}
          </TextField>
        </Box>

        {/* Grid de cards */}
        {filtradas.length > 0 ? (
          <Grid container spacing={3}>
            {filtradas.map((n) => (
              <Grid item xs={12} sm={6} md={4} key={n._id}>
                <NecesidadCard necesidad={n} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              No se encontraron necesidades con esos filtros.
            </Typography>
            <Button onClick={() => { setBusqueda(''); setCategoria('Todas'); setUrgencia('Todas'); }}
              sx={{ mt: 2, color: '#2E7D32' }}>
              Limpiar filtros
            </Button>
          </Box>
        )}

      </Container>
    </Box>
  );
}