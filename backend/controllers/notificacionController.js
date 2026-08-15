const { validationResult } = require('express-validator');
const Notificacion = require('../models/Notificacion');
const logger        = require('../utils/logger');

exports.getAll = async (req, res) => {
  try {
    // Usuario normal ve solo las suyas; admin ve todas
    const filtro = req.user.rol === 'admin'
      ? { activo: true }
      : { usuario: req.user.id, activo: true };
    const notifs = await Notificacion.find(filtro).sort({ createdAt: -1 });
    res.json(notifs);
  } catch (err) {
    logger.error(`Error al obtener notificaciones: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
  try {
    const notif = await Notificacion.create(req.body);
    res.status(201).json(notif);
  } catch (err) {
    logger.error(`Error al crear notificación: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Marcar como leída (el "update" natural de una notificación)
exports.marcarLeida = async (req, res) => {
  try {
    const notif = await Notificacion.findByIdAndUpdate(req.params.id, { leida: true }, { new: true });
    if (!notif) return res.status(404).json({ error: 'Notificación no encontrada' });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Soft delete
exports.desactivar = async (req, res) => {
  try {
    const notif = await Notificacion.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
    if (!notif) return res.status(404).json({ error: 'Notificación no encontrada' });
    res.json({ mensaje: 'Notificación desactivada' });
  } catch (err) {
    logger.error(`Error al desactivar notificación: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};