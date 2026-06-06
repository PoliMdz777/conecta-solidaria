import { useState } from 'react';
import {
  Container, Box, Typography, Paper, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon       from '@mui/icons-material/Block';
import DeleteIcon      from '@mui/icons-material/Delete';
import { useAuth }     from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const USUARIOS_DEMO = [
  { _id: 'u1', nombre: 'María López',   email: 'maria@mail.com',  rol: 'user',  verificado: true  },
  { _id: 'u2', nombre: 'Carlos Ruiz',   email: 'carlos@mail.com', rol: 'user',  verificado: false },
  { _id: 'u3', nombre: 'Ana González',  email: 'ana@mail.com',    rol: 'admin', verificado: true  },
];

const NECESIDADES_DEMO = [
  { _id: 'n1', titulo: 'Despensa para familias', estado: 'abierta', categoria: 'Alimentos', solicitante: 'Cruz Roja' },
  { _id: 'n2', titulo: 'Ropa de invierno',       estado: 'abierta', categoria: 'Ropa',      solicitante: 'Albergue Esperanza' },
  { _id: 'n3', titulo: 'Voluntarios parque',     estado: 'cerrada', categoria: 'Voluntariado', solicitante: 'Vecinos Unidos' },
];

export default function AdminPage() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [tab, setTab]     = useState(0);
  const [mensaje, setMensaje] = useState('');

  if (!user || user.rol !== 'admin') {
    return (
      <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh',
                 display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography mb={2}>Acceso restringido a administradores.</Typography>
          <Button variant="contained" onClick={() => navigate('/dashboard')}
            sx={{ backgroundColor: '#2E7D32' }}>
            Volver al inicio
          </Button>
        </Paper>
      </Box>
    );
  }

  const accion = (texto) => { setMensaje(texto); setTimeout(() => setMensaje(''), 3000); };

  return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">

        <Typography variant="h5" fontWeight="bold" mb={3}>
          Panel de administración
        </Typography>

        {mensaje && <Alert severity="success" sx={{ mb: 2 }}>{mensaje}</Alert>}

        <Paper elevation={2} sx={{ borderRadius: 3 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}
            sx={{ borderBottom: 1, borderColor: 'divider',
                  '& .MuiTab-root.Mui-selected': { color: '#2E7D32' },
                  '& .MuiTabs-indicator': { backgroundColor: '#2E7D32' } }}>
            <Tab label={`Usuarios (${USUARIOS_DEMO.length})`} />
            <Tab label={`Necesidades (${NECESIDADES_DEMO.length})`} />
          </Tabs>

          <Box sx={{ p: 3 }}>

            {/* Tab Usuarios */}
            {tab === 0 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Rol</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {USUARIOS_DEMO.map((u) => (
                      <TableRow key={u._id} hover>
                        <TableCell>{u.nombre}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Chip label={u.rol} size="small"
                            sx={{ backgroundColor: u.rol === 'admin' ? '#1b5e20' : '#e8f5e9',
                                  color: u.rol === 'admin' ? 'white' : '#2E7D32' }} />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={u.verificado ? 'Verificado' : 'Pendiente'}
                            size="small"
                            color={u.verificado ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {!u.verificado && (
                              <Button size="small" startIcon={<CheckCircleIcon />}
                                onClick={() => accion(`Usuario ${u.nombre} verificado`)}
                                sx={{ color: '#2E7D32' }}>
                                Verificar
                              </Button>
                            )}
                            <Button size="small" startIcon={<BlockIcon />} color="warning"
                              onClick={() => accion(`Usuario ${u.nombre} bloqueado`)}>
                              Bloquear
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Tab Necesidades */}
            {tab === 1 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                      <TableCell>Título</TableCell>
                      <TableCell>Categoría</TableCell>
                      <TableCell>Solicitante</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {NECESIDADES_DEMO.map((n) => (
                      <TableRow key={n._id} hover>
                        <TableCell>{n.titulo}</TableCell>
                        <TableCell>{n.categoria}</TableCell>
                        <TableCell>{n.solicitante}</TableCell>
                        <TableCell>
                          <Chip
                            label={n.estado}
                            size="small"
                            color={n.estado === 'abierta' ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Button size="small" startIcon={<DeleteIcon />} color="error"
                            onClick={() => accion(`Necesidad "${n.titulo}" eliminada`)}>
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