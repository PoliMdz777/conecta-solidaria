const { validationResult } = require('express-validator');
const Organizacion = require('../models/Organizacion');
const logger        = require('../utils/logger');

exports.getAll = async (req, res) => {
  try {
    const orgs = await Organizacion.find({ activo: true })
      .populate('responsable', 'nombre email');
    res.json(orgs);
  } catch (err) {
    logger.error(`Error al obtener organizaciones: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const org = await Organizacion.findById(req.params.id).populate('responsable', 'nombre email');
    if (!org) return res.status(404).json({ error: 'Organización no encontrada' });
    res.json(org);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
  try {
    const org = await Organizacion.create({ ...req.body, responsable: req.user.id });
    logger.info(`Organización creada por ${req.user.email}: ${org.nombre}`);
    res.status(201).json(org);
  } catch (err) {
    logger.error(`Error al crear organización: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
  try {
    const org = await Organizacion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!org) return res.status(404).json({ error: 'Organización no encontrada' });
    res.json(org);
  } catch (err) {
    logger.error(`Error al actualizar organización: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Soft delete: cambia activo a false en vez de borrar el documento
exports.desactivar = async (req, res) => {
  try {
    const org = await Organizacion.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
    if (!org) return res.status(404).json({ error: 'Organización no encontrada' });
    logger.info(`Organización desactivada por ${req.user.email}: ${org.nombre}`);
    res.json({ mensaje: 'Organización desactivada', organizacion: org });
  } catch (err) {
    logger.error(`Error al desactivar organización: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};