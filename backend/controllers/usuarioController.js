const User   = require('../models/User');
const logger = require('../utils/logger');

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    logger.error(`Error al obtener perfil: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    logger.error(`Error al obtener usuarios: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.verificar = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { verificado: true },
      { new: true }
    ).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    logger.info(`Usuario verificado: ${user.email}`);
    res.json(user);
  } catch (err) {
    logger.error(`Error al verificar usuario: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};