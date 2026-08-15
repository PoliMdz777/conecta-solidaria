import { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, TextField, Alert,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  getOrganizaciones, createOrganizacion, desactivarOrganizacion
} from '../services/organizacionesService';

export default function OrganizacionesPage() {
  const { user, cargando } = useAuth();
  const navigate = useNavigate();

  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ nombre: '', direccion: '', telefono: '' });

  const cargar = () => {
    getOrganizaciones()
      .then(({ data }) => setOrgs(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (cargando) return;
    if (!user) { setLoading(false); return; }
    cargar();
  }, [cargando, user]);

  if (cargando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
        <CircularProgress sx={{ color: '#2E7D32' }} />
      </Box>
    );
  }

  if (!user) return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Typography mb={2}>Debes iniciar sesión.</Typography>
        <Button variant="contained" onClick={() => navigate('/login')} sx={{ backgroundColor: '#2E7D32' }}>
          Iniciar sesión
        </Button>
      </Paper>
    </Box>
  );

  const accion = (texto) => { setMensaje(texto); setTimeout(() => setMensaje(''), 3000); };

  const handleCrear = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createOrganizacion(form);
      setForm({ nombre: '', direccion: '', telefono: '' });
      setOpenDialog(false);
      accion('Organización creada exitosamente');
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear organización');
    }
  };

  const handleDesactivar = async (id, nombre) => {
    try {
      await desactivarOrganizacion(id);
      setOrgs(orgs.filter((o) => o._id !== id));
      accion(`Organización "${nombre}" desactivada`);
    } catch {
      accion('Error al desactivar');
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">Organizaciones</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}
            sx={{ backgroundColor: '#2E7D32', '&:hover': { backgroundColor: '#1b5e20' } }}>
            Nueva organización
          </Button>
        </Box>

        {mensaje && <Alert severity="success" sx={{ mb: 2 }}>{mensaje}</Alert>}

        <Paper elevation={2} sx={{ borderRadius: 3, p: 3 }}>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress sx={{ color: '#2E7D32' }} /></Box>
          ) : orgs.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No hay organizaciones registradas.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Dirección</TableCell>
                    <TableCell>Teléfono</TableCell>
                    <TableCell>Responsable</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orgs.map((o) => (
                    <TableRow key={o._id} hover>
                      <TableCell>{o.nombre}</TableCell>
                      <TableCell>{o.direccion}</TableCell>
                      <TableCell>{o.telefono}</TableCell>
                      <TableCell>{o.responsable?.nombre || '-'}</TableCell>
                      <TableCell>
                        <Button size="small" startIcon={<BlockIcon />} color="error"
                          onClick={() => handleDesactivar(o._id, o.nombre)}>
                          Desactivar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>Nueva organización</DialogTitle>
          <Box component="form" onSubmit={handleCrear}>
            <DialogContent>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <TextField fullWidth label="Nombre" value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })} sx={{ mb: 2 }} required />
              <TextField fullWidth label="Dirección" value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })} sx={{ mb: 2 }} required />
              <TextField fullWidth label="Teléfono" value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })} required />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
              <Button type="submit" variant="contained" sx={{ backgroundColor: '#2E7D32' }}>
                Crear
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
}