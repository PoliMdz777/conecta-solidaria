const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const dotenv   = require('dotenv');
const logger   = require('./utils/logger');

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Rutas
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/necesidades',   require('./routes/necesidades'));
app.use('/api/donaciones',    require('./routes/donaciones'));
app.use('/api/voluntariados', require('./routes/voluntariados'));
app.use('/api/usuarios',      require('./routes/usuarios'));
app.use('/api/reportes', require('./routes/reportes'));

app.use('/api/organizaciones', require('./routes/organizaciones'));
app.use('/api/notificaciones', require('./routes/notificaciones'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando correctamente' });
});

// Middleware de errores global
app.use((err, req, res, next) => {
  logger.error(`${err.message} | Ruta: ${req.originalUrl}`);
  res.status(500).json({ error: 'Error interno del servidor' });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('Conectado a MongoDB Atlas');
    app.listen(process.env.PORT, () => {
      logger.info(`Servidor corriendo en puerto ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    logger.error(`Error al conectar a MongoDB: ${err.message}`);
    process.exit(1);
  });