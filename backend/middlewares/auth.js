const jwt    = require('jsonwebtoken');
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token      = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.error(`Token inválido: ${err.message}`);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};