const { validationResult } = require('express-validator');
const Voluntariado = require('../models/Voluntariado');
const Necesidad    = require('../models/Necesidad');
const logger       = require('../utils/logger');

exports.getAll = async (req, res) => {
  try {
    const filtro = req.user.rol === 'admin' ? {} : { colaborador: req.user.id };
    const voluntariados = await Voluntariado.find(filtro)
      .populate('necesidad', 'titulo')
      .populate('colaborador', 'nombre email')
      .sort({ createdAt: -1 });
    res.json(voluntariados);
  } catch (err) {
    logger.error(`Error al obtener voluntariados: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array()[0].msg });

  try {
    const { necesidad: necesidadId, horasOfrecidas, fechaInicio } = req.body;

    const necesidad = await Necesidad.findById(necesidadId);
    if (!necesidad || necesidad.estado !== 'abierta')
      return res.status(400).json({ error: 'Necesidad no disponible' });

    const voluntariado = await Voluntariado.create({
      necesidad: necesidadId,
      colaborador: req.user.id,
      horasOfrecidas,
      fechaInicio,
    });

    necesidad.progreso = Math.min(necesidad.progreso + Number(horasOfrecidas), necesidad.meta);
    await necesidad.save();

    logger.info(`Voluntariado registrado por ${req.user.email}`);
    res.status(201).json(voluntariado);
  } catch (err) {
    logger.error(`Error al crear voluntariado: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};