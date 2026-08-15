const Donacion     = require('../models/Donacion');
const Voluntariado = require('../models/Voluntariado');
const Necesidad    = require('../models/Necesidad');
const User         = require('../models/User');
const logger       = require('../utils/logger');

// Reporte 1: Donaciones agrupadas por categoría de necesidad
exports.donacionesPorCategoria = async (req, res) => {
  try {
    const resultado = await Donacion.aggregate([
      {
        $lookup: {
          from: 'necesidads', // Mongoose pluraliza el nombre del modelo Necesidad
          localField: 'necesidad',
          foreignField: '_id',
          as: 'necesidadInfo',
        },
      },
      { $unwind: '$necesidadInfo' },
      {
        $group: {
          _id: '$necesidadInfo.categoria',
          totalDonaciones: { $sum: 1 },
          totalCantidad: { $sum: '$cantidad' },
        },
      },
      { $sort: { totalCantidad: -1 } },
    ]);
    res.json(resultado);
  } catch (err) {
    logger.error(`Error en reporte donacionesPorCategoria: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Reporte 2: Top colaboradores (donaciones + voluntariados combinados)
exports.topColaboradores = async (req, res) => {
  try {
    const donaciones = await Donacion.aggregate([
      { $group: { _id: '$colaborador', totalDonaciones: { $sum: 1 } } },
    ]);
    const voluntariados = await Voluntariado.aggregate([
      { $group: { _id: '$colaborador', totalVoluntariados: { $sum: 1 } } },
    ]);

    const mapa = {};
    donaciones.forEach((d) => {
      mapa[d._id] = { donaciones: d.totalDonaciones, voluntariados: 0 };
    });
    voluntariados.forEach((v) => {
      if (!mapa[v._id]) mapa[v._id] = { donaciones: 0, voluntariados: 0 };
      mapa[v._id].voluntariados = v.totalVoluntariados;
    });

    const userIds = Object.keys(mapa);
    const usuarios = await User.find({ _id: { $in: userIds } }).select('nombre email');

    const resultado = usuarios
      .map((u) => ({
        _id: u._id,
        nombre: u.nombre,
        email: u.email,
        donaciones: mapa[u._id]?.donaciones || 0,
        voluntariados: mapa[u._id]?.voluntariados || 0,
        totalContribuciones: (mapa[u._id]?.donaciones || 0) + (mapa[u._id]?.voluntariados || 0),
      }))
      .sort((a, b) => b.totalContribuciones - a.totalContribuciones)
      .slice(0, 10);

    res.json(resultado);
  } catch (err) {
    logger.error(`Error en reporte topColaboradores: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Reporte 3: Necesidades de urgencia alta y su progreso
exports.necesidadesUrgentes = async (req, res) => {
  try {
    const resultado = await Necesidad.aggregate([
      { $match: { urgencia: 'alta', estado: 'abierta' } },
      {
        $project: {
          titulo: 1,
          categoria: 1,
          meta: 1,
          progreso: 1,
          porcentajeCompletado: {
            $round: [{ $multiply: [{ $divide: ['$progreso', '$meta'] }, 100] }, 1],
          },
        },
      },
      { $sort: { porcentajeCompletado: 1 } }, // las menos avanzadas primero
    ]);
    res.json(resultado);
  } catch (err) {
    logger.error(`Error en reporte necesidadesUrgentes: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Reporte 4: Usuarios agrupados por rol y estado de verificación
exports.usuariosPorRolEstado = async (req, res) => {
  try {
    const resultado = await User.aggregate([
      {
        $group: {
          _id: { rol: '$rol', verificado: '$verificado' },
          total: { $sum: 1 },
        },
      },
      { $sort: { '_id.rol': 1 } },
    ]);
    res.json(resultado);
  } catch (err) {
    logger.error(`Error en reporte usuariosPorRolEstado: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};