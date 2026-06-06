import { Card, CardContent, CardActions, Typography, Button, Chip, LinearProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const COLORES_URGENCIA = {
  alta:  '#d32f2f',
  media: '#f57c00',
  baja:  '#388e3c',
};

export default function NecesidadCard({ necesidad }) {
  const navigate = useNavigate();

  const {
    _id,
    titulo = 'Sin título',
    descripcion = '',
    categoria = 'General',
    urgencia = 'baja',
    meta = 100,
    progreso = 0,
  } = necesidad;

  const porcentaje = Math.min((progreso / meta) * 100, 100);

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Chip label={categoria} size="small" sx={{ backgroundColor: '#e8f5e9' }} />
          <Chip
            label={urgencia.toUpperCase()}
            size="small"
            sx={{ backgroundColor: COLORES_URGENCIA[urgencia], color: 'white' }}
          />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          {titulo}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {descripcion.length > 100 ? descripcion.slice(0, 100) + '...' : descripcion}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Progreso: {progreso} / {meta}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={porcentaje}
          sx={{ mt: 0.5, borderRadius: 5, height: 8 }}
        />
      </CardContent>

      <CardActions>
        <Button
          size="small"
          variant="contained"
          sx={{ backgroundColor: '#2E7D32' }}
          onClick={() => navigate(`/necesidad/${_id}`)}
        >
          Ver más
        </Button>
      </CardActions>
    </Card>
  );
}