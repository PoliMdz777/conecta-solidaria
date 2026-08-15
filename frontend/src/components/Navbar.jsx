import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VERDE = '#2E7D32';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: VERDE }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
        >
          ConectaSolidaria
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="inherit" component={Link} to="/dashboard">
            Explorar
          </Button>

          {user ? (
            <>
              {user.rol === 'admin' && (
                <>
                  <Button color="inherit" component={Link} to="/admin">
                    Admin
                  </Button>
                  <Button color="inherit" component={Link} to="/reportes">
                    Reportes
                  </Button>
                </>
              )}
              <Button color="inherit" component={Link} to="/perfil">
                Mi Perfil
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Iniciar sesión
              </Button>
              <Button
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
                component={Link}
                to="/register"
              >
                Registrarse
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}