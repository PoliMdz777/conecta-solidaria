const router  = require('express').Router();
const { body } = require('express-validator');
const auth    = require('../middlewares/auth');
const ctrl    = require('../controllers/notificacionController');

//Gestion de notificaciones

//Consultar todas las notis
router.get('/',    auth, ctrl.getAll);

//Crear notificacion
router.post('/', auth, [
  body('usuario').notEmpty().withMessage('Usuario requerido'),
  body('mensaje').notEmpty().withMessage('Mensaje requerido'),
], ctrl.create);

//Leer y desactivas una notificacion
router.patch('/:id/leida',      auth, ctrl.marcarLeida);
router.patch('/:id/desactivar', auth, ctrl.desactivar);

module.exports = router;
