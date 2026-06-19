import { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Avatar, Divider, Chip, Button, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import GroupsIcon  from '@mui/icons-material/Groups';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDonaciones }    from '../services/donacionesService';
import { getVoluntariados } from '../services/voluntariadosService';

export default function PerfilPage() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [donaciones,    setDonaciones]    = useState([]);
  const [voluntariados, setVoluntariados] = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([getDonaciones(), getVoluntariados()])
      .then(([d, v]) => { setDonaciones(d.data); setVoluntariados(v.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Typography mb={2}>Debes iniciar sesión.</Typography>
        <Button variant="contained" onClick={() => navigate('/login')} sx={{ backgroundColor: '#2E7D32' }}>Iniciar sesión</Button>
      </Paper>
    </Box>
  );

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Avatar sx={{ width: 72, height: 72, backgroundColor: '#2E7D32', fontSize: 32 }}>
              {user.nombre ? user.nombre.charAt(0).toUpperCase() : <PersonIcon />}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight="bold">{user.nombre}</Typography>
              <Typography color="text.secondary">{user.email}</Typography>
              <Chip label={user.rol === 'admin' ? 'Administrador' : 'Usuario'} size="small"
                sx={{ mt: 1, backgroundColor: user.rol === 'admin' ? '#1b5e20' : '#e8f5e9',
                      color: user.rol === 'admin' ? 'white' : '#2E7D32' }} />
            </Box>
            <Button variant="outlined" color="error" onClick={handleLogout}>Cerrar sesión</Button>
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          {[
            { icon: <VolunteerActivismIcon />, label: 'Donaciones',    valor: donaciones.length },
            { icon: <GroupsIcon />,            label: 'Voluntariados', valor: voluntariados.length },
          ].map((stat) => (
            <Paper key={stat.label} elevation={1} sx={{ p: 3, borderRadius: 3, flexGrow: 1, textAlign: 'center', minWidth: 140 }}>
              <Box sx={{ color: '#2E7D32', mb: 1 }}>{stat.icon}</Box>
              <Typography variant="h4" fontWeight="bold">{stat.valor}</Typography>
              <Typography color="text.secondary" variant="body2">{stat.label}</Typography>
            </Paper>
          ))}
        </Box>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>Historial de actividad</Typography>
          <Divider sx={{ mb: 2 }} />
          {loading ? (
            <Box textAlign="center" py={2}><CircularProgress sx={{ color: '#2E7D32' }} /></Box>
          ) : donaciones.length === 0 && voluntariados.length === 0 ? (
            <Typography color="text.secondary" textAlign="center">No tienes actividad registrada aún.</Typography>
          ) : (
            <List disablePadding>
              {donaciones.map((d, i) => (
                <Box key={d._id}>
                  <ListItem disablePadding sx={{ py: 1 }}>
                    <Box sx={{ mr: 2, color: '#2E7D32' }}><VolunteerActivismIcon /></Box>
                    <ListItemText
                      primary={`Donaste ${d.descripcionArticulo} (x${d.cantidad}) a "${d.necesidad?.titulo}"`}
                      secondary={new Date(d.createdAt).toLocaleDateString()} />
                  </ListItem>
                  {i < donaciones.length - 1 && <Divider />}
                </Box>
              ))}
              {voluntariados.map((v, i) => (
                <Box key={v._id}>
                  <ListItem disablePadding sx={{ py: 1 }}>
                    <Box sx={{ mr: 2, color: '#2E7D32' }}><GroupsIcon /></Box>
                    <ListItemText
                      primary={`Te ofreciste ${v.horasOfrecidas}h de voluntario en "${v.necesidad?.titulo}"`}
                      secondary={new Date(v.createdAt).toLocaleDateString()} />
                  </ListItem>
                  {i < voluntariados.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  );
}