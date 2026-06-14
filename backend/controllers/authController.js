const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User   = require('../models/User');
const logger = require('../utils/logger');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array()[0].msg });

  try {
    const { nombre, email, password, rol } = req.body;

    const existe = await User.findOne({ email });
    if (existe)
      return res.status(400).json({ error: 'El correo ya está registrado' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ nombre, email, passwordHash, rol });

    const token = jwt.sign(
      { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    logger.info(`Nuevo usuario registrado: ${email}`);
    res.status(201).json({ token, usuario: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol } });
  } catch (err) {
    logger.error(`Error en registro: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array()[0].msg });

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: 'Credenciales incorrectas' });

    const valida = await bcrypt.compare(password, user.passwordHash);
    if (!valida)
      return res.status(400).json({ error: 'Credenciales incorrectas' });

    const token = jwt.sign(
      { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    logger.info(`Login exitoso: ${email}`);
    res.json({ token, usuario: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol } });
  } catch (err) {
    logger.error(`Error en login: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};