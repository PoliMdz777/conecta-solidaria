const { validationResult } = require('express-validator');
const Donacion  = require('../models/Donacion');
const Necesidad = require('../models/Necesidad');
const logger    = require('../utils/logger');

exports.getAll = async (req, res) => {
  try {
    const filtro = req.user.rol === 'admin' ? {} : { colaborador: req.user.id };
    const donaciones = await Donacion.find(filtro)
      .populate('necesidad', 'titulo')
      .populate('colaborador', 'nombre email')
      .sort({ createdAt: -1 });
    res.json(donaciones);
  } catch (err) {
    logger.error(`Error al obtener donaciones: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array()[0].msg });

  try {
    const { necesidad: necesidadId, descripcionArticulo, cantidad } = req.body;

    const necesidad = await Necesidad.findById(necesidadId);
    if (!necesidad || necesidad.estado !== 'abierta')
      return res.status(400).json({ error: 'Necesidad no disponible' });

    const donacion = await Donacion.create({
      necesidad: necesidadId,
      colaborador: req.user.id,
      descripcionArticulo,
      cantidad,
    });

    // Actualizar progreso
    necesidad.progreso = Math.min(necesidad.progreso + Number(cantidad), necesidad.meta);
    await necesidad.save();

    logger.info(`Donación registrada por ${req.user.email} a necesidad ${necesidadId}`);
    res.status(201).json(donacion);
  } catch (err) {
    logger.error(`Error al crear donación: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};