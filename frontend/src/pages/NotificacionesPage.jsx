import { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Paper, List, ListItem, ListItemText,
  Chip, Button, CircularProgress, Divider
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getNotificaciones, marcarLeida } from '../services/notificacionesService';

export default function NotificacionesPage() {
  const { user, cargando } = useAuth();
  const navigate = useNavigate();

  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = () => {
    getNotificaciones()
      .then(({ data }) => setNotifs(data))
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

  const handleMarcarLeida = async (id) => {
    try {
      await marcarLeida(id);
      setNotifs(notifs.map((n) => n._id === id ? { ...n, leida: true } : n));
    } catch {}
  };

  return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h5" fontWeight="bold" mb={3}>Notificaciones</Typography>

        <Paper elevation={2} sx={{ borderRadius: 3, p: 3 }}>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress sx={{ color: '#2E7D32' }} /></Box>
          ) : notifs.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No tienes notificaciones.
            </Typography>
          ) : (
            <List disablePadding>
              {notifs.map((n, i) => (
                <Box key={n._id}>
                  <ListItem
                    sx={{ py: 2, backgroundColor: n.leida ? 'transparent' : '#e8f5e9', borderRadius: 2 }}
                    secondaryAction={
                      !n.leida && (
                        <Button size="small" onClick={() => handleMarcarLeida(n._id)} sx={{ color: '#2E7D32' }}>
                          Marcar leída
                        </Button>
                      )
                    }
                  >
                    <ListItemText
                      primary={n.mensaje}
                      secondary={
                        <>
                          <Chip label={n.tipo} size="small" sx={{ mr: 1, mt: 0.5 }} />
                          {new Date(n.createdAt).toLocaleDateString()}
                        </>
                      }
                    />
                  </ListItem>
                  {i < notifs.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  );
}