const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const dotenv     = require('dotenv');
const logger     = require('./utils/logger');

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando correctamente' });
});

// Middleware de errores global
app.use((err, req, res, next) => {
  logger.error(`${err.message} | Ruta: ${req.originalUrl}`);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Conexión a MongoDB
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