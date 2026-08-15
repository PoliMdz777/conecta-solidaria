import { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Paper, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, CircularProgress, Button
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  getDonacionesPorCategoria, getTopColaboradores,
  getNecesidadesUrgentes, getUsuariosPorRol
} from '../services/reportesService';

export default function ReportesPage() {
  const { user, cargando } = useAuth();
  const navigate = useNavigate();

  const [porCategoria, setPorCategoria] = useState([]);
  const [topColab,     setTopColab]     = useState([]);
  const [urgentes,     setUrgentes]     = useState([]);
  const [porRol,       setPorRol]       = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    if (cargando) return;
    if (!user || user.rol !== 'admin') { setLoading(false); return; }

    Promise.all([
      getDonacionesPorCategoria(),
      getTopColaboradores(),
      getNecesidadesUrgentes(),
      getUsuariosPorRol(),
    ])
      .then(([a, b, c, d]) => {
        setPorCategoria(a.data);
        setTopColab(b.data);
        setUrgentes(c.data);
        setPorRol(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cargando, user]);

  if (cargando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
        <CircularProgress sx={{ color: '#2E7D32' }} />
      </Box>
    );
  }

  if (!user || user.rol !== 'admin') return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Typography mb={2}>Acceso restringido a administradores.</Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ backgroundColor: '#2E7D32' }}>
          Volver
        </Button>
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h5" fontWeight="bold" mb={3}>Reportes</Typography>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress sx={{ color: '#2E7D32' }} /></Box>
        ) : (
          <Grid container spacing={3}>

            {/* Reporte 1: Donaciones por categoría */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>Donaciones por categoría</Typography>
                {porCategoria.length === 0 ? (
                  <Typography color="text.secondary">Aún no hay donaciones registradas.</Typography>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Categoría</TableCell>
                          <TableCell align="right">Donaciones</TableCell>
                          <TableCell align="right">Cantidad total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {porCategoria.map((r) => (
                          <TableRow key={r._id}>
                            <TableCell>{r._id}</TableCell>
                            <TableCell align="right">{r.totalDonaciones}</TableCell>
                            <TableCell align="right">{r.totalCantidad}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </Grid>

            {/* Reporte 2: Top colaboradores */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>Top colaboradores</Typography>
                {topColab.length === 0 ? (
                  <Typography color="text.secondary">Aún no hay colaboradores registrados.</Typography>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Nombre</TableCell>
                          <TableCell align="right">Donaciones</TableCell>
                          <TableCell align="right">Voluntariados</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topColab.map((r) => (
                          <TableRow key={r._id}>
                            <TableCell>{r.nombre}</TableCell>
                            <TableCell align="right">{r.donaciones}</TableCell>
                            <TableCell align="right">{r.voluntariados}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </Grid>

            {/* Reporte 3: Necesidades urgentes */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Necesidades urgentes (menor avance primero)
                </Typography>
                {urgentes.length === 0 ? (
                  <Typography color="text.secondary">No hay necesidades de urgencia alta abiertas.</Typography>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Título</TableCell>
                          <TableCell align="right">Progreso</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {urgentes.map((r) => (
                          <TableRow key={r._id}>
                            <TableCell>{r.titulo}</TableCell>
                            <TableCell align="right">
                              {r.progreso}/{r.meta} ({r.porcentajeCompletado}%)
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </Grid>

            {/* Reporte 4: Usuarios por rol y estado */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>Usuarios por rol y estado</Typography>
                {porRol.length === 0 ? (
                  <Typography color="text.secondary">No hay usuarios registrados.</Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {porRol.map((r, i) => (
                      <Chip
                        key={i}
                        label={`${r._id.rol} · ${r._id.verificado ? 'Verificado' : 'Pendiente'}: ${r.total}`}
                        sx={{ backgroundColor: r._id.verificado ? '#e8f5e9' : '#fff3e0' }}
                      />
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>

          </Grid>
        )}
      </Container>
    </Box>
  );
}