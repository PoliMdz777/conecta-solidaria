import {
  Container, Box, Typography, Paper, Avatar,
  Divider, Chip, Button, List, ListItem, ListItemText
} from '@mui/material';
import PersonIcon        from '@mui/icons-material/Person';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import GroupsIcon        from '@mui/icons-material/Groups';
import { useAuth }       from '../context/AuthContext';
import { useNavigate }   from 'react-router-dom';

// Historial de ejemplo — vendrá de la API después
const HISTORIAL_DEMO = [
  { id: 1, tipo: 'donacion',     texto: 'Donaste 5 kg de croquetas a "Alimentos para refugio animal"',  fecha: '2026-05-28' },
  { id: 2, tipo: 'voluntariado', texto: 'Te registraste como voluntario en "Limpieza de parque"',        fecha: '2026-05-20' },
  { id: 3, tipo: 'donacion',     texto: 'Donaste ropa de invierno a "Ropa para niños"',                  fecha: '2026-05-15' },
];

export default function PerfilPage() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  if (!user) {
    return (
      <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh',
                 display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography mb={2}>Debes iniciar sesión para ver tu perfil.</Typography>
          <Button variant="contained" onClick={() => navigate('/login')}
            sx={{ backgroundColor: '#2E7D32' }}>
            Iniciar sesión
          </Button>
        </Paper>
      </Box>
    );
  }

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">

        {/* Tarjeta de perfil */}
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Avatar sx={{ width: 72, height: 72, backgroundColor: '#2E7D32', fontSize: 32 }}>
              {user.nombre ? user.nombre.charAt(0).toUpperCase() : <PersonIcon />}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight="bold">{user.nombre}</Typography>
              <Typography color="text.secondary">{user.email}</Typography>
              <Chip
                label={user.rol === 'admin' ? 'Administrador' : 'Usuario'}
                size="small"
                sx={{ mt: 1, backgroundColor: user.rol === 'admin' ? '#1b5e20' : '#e8f5e9',
                      color: user.rol === 'admin' ? 'white' : '#2E7D32' }}
              />
            </Box>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Box>
        </Paper>

        {/* Estadísticas rápidas */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          {[
            { icon: <VolunteerActivismIcon />, label: 'Donaciones',    valor: 2 },
            { icon: <GroupsIcon />,            label: 'Voluntariados', valor: 1 },
          ].map((stat) => (
            <Paper key={stat.label} elevation={1}
              sx={{ p: 3, borderRadius: 3, flexGrow: 1, textAlign: 'center', minWidth: 140 }}>
              <Box sx={{ color: '#2E7D32', mb: 1 }}>{stat.icon}</Box>
              <Typography variant="h4" fontWeight="bold">{stat.valor}</Typography>
              <Typography color="text.secondary" variant="body2">{stat.label}</Typography>
            </Paper>
          ))}
        </Box>

        {/* Historial de actividad */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Historial de actividad
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List disablePadding>
            {HISTORIAL_DEMO.map((item, idx) => (
              <Box key={item.id}>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <Box sx={{ mr: 2, color: '#2E7D32' }}>
                    {item.tipo === 'donacion'
                      ? <VolunteerActivismIcon />
                      : <GroupsIcon />}
                  </Box>
                  <ListItemText
                    primary={item.texto}
                    secondary={item.fecha}
                  />
                </ListItem>
                {idx < HISTORIAL_DEMO.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Paper>

      </Container>
    </Box>
  );
}