import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh' }}>

{/* Hero */}
      <Box
        sx={{
          color: 'white',
          py: 12,
          textAlign: 'center',
          position: 'relative',
          backgroundImage: `linear-gradient(rgba(27, 94, 32, 0.85), rgba(18, 55, 21, 0.90)), url(/hero-bg.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              fontSize: { xs: '2rem', sm: '2.8rem', md: '3.2rem' }
            }}
          >
            Conecta tu ayuda con quien la necesita
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.95,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            Publica necesidades, dona artículos o hazte voluntario.<br />
            Juntos hacemos más.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: '#1b5e20',
                fontWeight: 'bold',
                px: 3,
                '&:hover': { backgroundColor: '#f1f8e9' }
              }}
              onClick={() => navigate('/dashboard')}
            >
              Explorar necesidades
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: 'white',
                borderColor: 'white',
                borderWidth: 2,
                fontWeight: 'bold',
                px: 3,
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
              onClick={() => navigate('/register')}
            >
              Unirme ahora
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Cómo funciona */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" mb={5} color="#1b5e20">
          ¿Cómo funciona?
        </Typography>
        <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
          {[
            { num: '1', titulo: 'Regístrate', desc: 'Crea tu cuenta gratis en minutos.' },
            { num: '2', titulo: 'Explora', desc: 'Encuentra necesidades cerca de ti por categoría.' },
            { num: '3', titulo: 'Ayuda', desc: 'Dona artículos o regístrate como voluntario.' },
          ].map((item) => (
            <Grid item xs={12} sm={4} key={item.num}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    backgroundColor: '#2E7D32',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 'bold',
                    mb: 2,
                  }}
                >
                  {item.num}
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="#2e7d32">
                  {item.titulo}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}