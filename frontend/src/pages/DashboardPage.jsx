import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, TextField, MenuItem, InputAdornment, Button, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon    from '@mui/icons-material/Add';
import NecesidadCard from '../components/NecesidadCard';
import { useAuth }   from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getNecesidades } from '../services/necesidadesService';

const CATEGORIAS = ['Todas', 'Alimentos', 'Ropa', 'Medicinas', 'Voluntariado', 'Otros'];
const URGENCIAS  = ['Todas', 'alta', 'media', 'baja'];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [necesidades, setNecesidades] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [busqueda,    setBusqueda]    = useState('');
  const [categoria,   setCategoria]   = useState('Todas');
  const [urgencia,    setUrgencia]    = useState('Todas');

  useEffect(() => {
    const cargar = async () => {
      try {
        const params = {};
        if (categoria !== 'Todas') params.categoria = categoria;
        if (urgencia  !== 'Todas') params.urgencia  = urgencia;
        const { data } = await getNecesidades(params);
        setNecesidades(data);
      } catch {
        setNecesidades([]);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [categoria, urgencia]);

  const filtradas = necesidades.filter((n) =>
    n.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    n.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh', py: 4 }}>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">Necesidades activas</Typography>
            <Typography color="text.secondary">{filtradas.length} resultado{filtradas.length !== 1 ? 's' : ''} encontrado{filtradas.length !== 1 ? 's' : ''}</Typography>
          </Box>
          {user && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/crear')}
              sx={{ backgroundColor: '#2E7D32', '&:hover': { backgroundColor: '#1b5e20' } }}>
              Publicar necesidad
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <TextField placeholder="Buscar necesidades..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200, backgroundColor: 'white', borderRadius: 1 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }} />
          <TextField select label="Categoría" value={categoria} onChange={(e) => { setCategoria(e.target.value); setLoading(true); }}
            sx={{ minWidth: 150, backgroundColor: 'white' }}>
            {CATEGORIAS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField select label="Urgencia" value={urgencia} onChange={(e) => { setUrgencia(e.target.value); setLoading(true); }}
            sx={{ minWidth: 140, backgroundColor: 'white' }}>
            {URGENCIAS.map((u) => <MenuItem key={u} value={u}>{u === 'Todas' ? 'Todas' : u.charAt(0).toUpperCase() + u.slice(1)}</MenuItem>)}
          </TextField>
        </Box>

        {loading ? (
          <Box textAlign="center" py={8}><CircularProgress sx={{ color: '#2E7D32' }} /></Box>
        ) : filtradas.length > 0 ? (
          <Grid container spacing={3}>
            {filtradas.map((n) => (
              <Grid item xs={12} sm={6} md={4} key={n._id}>
                <NecesidadCard necesidad={n} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">No se encontraron necesidades.</Typography>
            <Button onClick={() => { setBusqueda(''); setCategoria('Todas'); setUrgencia('Todas'); }} sx={{ mt: 2, color: '#2E7D32' }}>
              Limpiar filtros
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}