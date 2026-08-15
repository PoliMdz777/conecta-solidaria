const router = require('express').Router();
const auth   = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const ctrl   = require('../controllers/reporteController');

// Todos los reportes requieren una sesión de administrador
router.get('/donaciones-por-categoria', auth, isAdmin, ctrl.donacionesPorCategoria);
router.get('/top-colaboradores',        auth, isAdmin, ctrl.topColaboradores);
router.get('/necesidades-urgentes',     auth, isAdmin, ctrl.necesidadesUrgentes);
router.get('/usuarios-por-rol',         auth, isAdmin, ctrl.usuariosPorRolEstado);

module.exports = router;