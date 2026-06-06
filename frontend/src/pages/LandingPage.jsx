import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: '#f1f8e9', minHeight: '100vh' }}>

      {/* Hero */}
      <Box sx={{ backgroundColor: '#2E7D32', color: 'white', py: 10, textAlign: 'center' }}>
        <Container>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Conecta tu ayuda con quien la necesita
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Publica necesidades, dona artículos o hazte voluntario.<br />
            Juntos hacemos más.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              sx={{ backgroundColor: 'white', color: '#2E7D32', fontWeight: 'bold' }}
              onClick={() => navigate('/dashboard')}
            >
              Explorar necesidades
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ color: 'white', borderColor: 'white' }}
              onClick={() => navigate('/register')}
            >
              Unirme ahora
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Cómo funciona */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" mb={4}>
          ¿Cómo funciona?
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            { num: '1', titulo: 'Regístrate', desc: 'Crea tu cuenta gratis en minutos.' },
            { num: '2', titulo: 'Explora', desc: 'Encuentra necesidades cerca de ti por categoría.' },
            { num: '3', titulo: 'Ayuda', desc: 'Dona artículos o regístrate como voluntario.' },
          ].map((item) => (
            <Grid item xs={12} sm={4} key={item.num} textAlign="center">
              <Box
                sx={{
                  width: 60, height: 60, borderRadius: '50%',
                  backgroundColor: '#2E7D32', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 'bold', margin: '0 auto 16px',
                }}
              >
                {item.num}
              </Box>
              <Typography variant="h6" fontWeight="bold">{item.titulo}</Typography>
              <Typography color="text.secondary">{item.desc}</Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}