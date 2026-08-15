import { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Tabs, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, Alert, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon      from '@mui/icons-material/Delete';
import { useAuth }     from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUsuarios, verificarUsuario } from '../services/usuariosService';
import { getNecesidades, deleteNecesidad } from '../services/necesidadesService';

export default function AdminPage() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [tab,      setTab]      = useState(0);
  const [usuarios, setUsuarios] = useState([]);
  const [necs,     setNecs]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [mensaje,  setMensaje]  = useState('');

  useEffect(() => {
    if (!user || user.rol !== 'admin') return;
    Promise.all([getUsuarios(), getNecesidades({})])
      .then(([u, n]) => { setUsuarios(u.data); setNecs(n.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user || user.rol !== 'admin') return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Typography mb={2}>Acceso restringido a administradores.</Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ backgroundColor: '#2E7D32' }}>Volver</Button>
      </Paper>
    </Box>
  );

  const accion = (texto) => { setMensaje(texto); setTimeout(() => setMensaje(''), 3000); };

  const handleVerificar = async (id, nombre) => {
    try {
      const { data } = await verificarUsuario(id);
      setUsuarios(usuarios.map((u) => u._id === id ? data : u));
      accion(`Usuario ${nombre} verificado`);
    } catch { accion('Error al verificar'); }
  };

  const handleEliminar = async (id, titulo) => {
    try {
      await deleteNecesidad(id);
      setNecs(necs.filter((n) => n._id !== id));
      accion(`Necesidad "${titulo}" eliminada`);
    } catch { accion('Error al eliminar'); }
  };

  return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h5" fontWeight="bold" mb={3}>Panel de administración</Typography>
        {mensaje && <Alert severity="success" sx={{ mb: 2 }}>{mensaje}</Alert>}

        <Paper elevation={2} sx={{ borderRadius: 3 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}
            sx={{ borderBottom: 1, borderColor: 'divider',
                  '& .MuiTab-root.Mui-selected': { color: '#2E7D32' },
                  '& .MuiTabs-indicator': { backgroundColor: '#2E7D32' } }}>
            <Tab label={`Usuarios (${usuarios.length})`} />
            <Tab label={`Necesidades (${necs.length})`} />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {loading ? (
             <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress sx={{ color: '#2E7D32' }} /></Box>
            ) : tab === 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                      <TableCell>Nombre</TableCell><TableCell>Email</TableCell>
                      <TableCell>Rol</TableCell><TableCell>Estado</TableCell><TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usuarios.map((u) => (
                      <TableRow key={u._id} hover>
                        <TableCell>{u.nombre}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Chip label={u.rol} size="small"
                            sx={{ backgroundColor: u.rol === 'admin' ? '#1b5e20' : '#e8f5e9',
                                  color: u.rol === 'admin' ? 'white' : '#2E7D32' }} />
                        </TableCell>
                        <TableCell>
                          <Chip label={u.verificado ? 'Verificado' : 'Pendiente'} size="small"
                            color={u.verificado ? 'success' : 'warning'} />
                        </TableCell>
                        <TableCell>
                          {!u.verificado && (
                            <Button size="small" startIcon={<CheckCircleIcon />}
                              onClick={() => handleVerificar(u._id, u.nombre)} sx={{ color: '#2E7D32' }}>
                              Verificar
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                      <TableCell>Título</TableCell><TableCell>Categoría</TableCell>
                      <TableCell>Solicitante</TableCell><TableCell>Estado</TableCell><TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {necs.map((n) => (
                      <TableRow key={n._id} hover>
                        <TableCell>{n.titulo}</TableCell>
                        <TableCell>{n.categoria}</TableCell>
                        <TableCell>{n.solicitante?.nombre || '-'}</TableCell>
                        <TableCell>
                          <Chip label={n.estado} size="small" color={n.estado === 'abierta' ? 'success' : 'default'} />
                        </TableCell>
                        <TableCell>
                          <Button size="small" startIcon={<DeleteIcon />} color="error"
                            onClick={() => handleEliminar(n._id, n.titulo)}>
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}