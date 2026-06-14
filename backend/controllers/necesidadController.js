const { validationResult } = require('express-validator');
const Necesidad = require('../models/Necesidad');
const logger    = require('../utils/logger');

exports.getAll = async (req, res) => {
  try {
    const { categoria, urgencia } = req.query;
    const filtro = { estado: 'abierta' };
    if (categoria && categoria !== 'Todas') filtro.categoria = categoria;
    if (urgencia  && urgencia  !== 'Todas') filtro.urgencia  = urgencia;

    const necesidades = await Necesidad.find(filtro)
      .populate('solicitante', 'nombre email')
      .sort({ createdAt: -1 });

    res.json(necesidades);
  } catch (err) {
    logger.error(`Error al obtener necesidades: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getById = async (req, res) => {
  try {
    const necesidad = await Necesidad.findById(req.params.id)
      .populate('solicitante', 'nombre email');
    if (!necesidad)
      return res.status(404).json({ error: 'Necesidad no encontrada' });
    res.json(necesidad);
  } catch (err) {
    logger.error(`Error al obtener necesidad: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array()[0].msg });

  try {
    const { titulo, descripcion, categoria, urgencia, meta } = req.body;
    const necesidad = await Necesidad.create({
      titulo, descripcion, categoria, urgencia, meta,
      solicitante: req.user.id,
    });
    logger.info(`Nueva necesidad creada: ${titulo} por ${req.user.email}`);
    res.status(201).json(necesidad);
  } catch (err) {
    logger.error(`Error al crear necesidad: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.update = async (req, res) => {
  try {
    const necesidad = await Necesidad.findById(req.params.id);
    if (!necesidad)
      return res.status(404).json({ error: 'Necesidad no encontrada' });
    if (necesidad.solicitante.toString() !== req.user.id && req.user.rol !== 'admin')
      return res.status(403).json({ error: 'No autorizado' });

    const actualizada = await Necesidad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizada);
  } catch (err) {
    logger.error(`Error al actualizar necesidad: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.remove = async (req, res) => {
  try {
    const necesidad = await Necesidad.findById(req.params.id);
    if (!necesidad)
      return res.status(404).json({ error: 'Necesidad no encontrada' });
    if (necesidad.solicitante.toString() !== req.user.id && req.user.rol !== 'admin')
      return res.status(403).json({ error: 'No autorizado' });

    await Necesidad.findByIdAndDelete(req.params.id);
    logger.info(`Necesidad eliminada: ${req.params.id}`);
    res.json({ mensaje: 'Necesidad eliminada correctamente' });
  } catch (err) {
    logger.error(`Error al eliminar necesidad: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};