import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VERDE = '#2E7D32';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const drawerContent = (
    <Box onClick={handleDrawerToggle} sx={{ width: 250, textAlign: 'center', py: 2 }}>

      <Box
        component={Link}
        to="/"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          textDecoration: 'none',
          color: VERDE,
          mb: 2,
        }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt="Logo ConectaSolidaria"
          sx={{ width: 32, height: 32, borderRadius: '50%' }}
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          ConectaSolidaria
        </Typography>
      </Box>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/dashboard">
            <ListItemText primary="Explorar" />
          </ListItemButton>
        </ListItem>

        {user ? (
          <>
            {user.rol === 'admin' && (
              <>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/admin">
                    <ListItemText primary="Admin" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/reportes">
                    <ListItemText primary="Reportes" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/organizaciones">
                    <ListItemText primary="Organizaciones" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/notificaciones">
                <ListItemText primary="Notificaciones" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/perfil">
                <ListItemText primary="Mi Perfil" />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Cerrar sesión" sx={{ color: 'error.main' }} />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/login">
                <ListItemText primary="Iniciar sesión" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/register">
                <ListItemText primary="Registrarse" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: VERDE }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo y Titulo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              color: 'white',
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="Logo ConectaSolidaria"
              sx={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                display: 'block',
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'inherit',
                lineHeight: 1,
              }}
            >
              ConectaSolidaria
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
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
                    <Button color="inherit" component={Link} to="/organizaciones">
                      Organizaciones
                    </Button>
                  </>
                )}
                <Button color="inherit" component={Link} to="/notificaciones">
                  Notificaciones
                </Button>
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

          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          anchor="right"
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
}