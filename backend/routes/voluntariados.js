const router  = require('express').Router();
const { body } = require('express-validator');
const auth    = require('../middlewares/auth');
const ctrl    = require('../controllers/voluntariadoController');

router.get('/',  auth, ctrl.getAll);
router.post('/', auth, [
  body('necesidad').notEmpty().withMessage('Necesidad requerida'),
  body('horasOfrecidas').isInt({ min: 1 }).withMessage('Horas deben ser mayor a 0'),
  body('fechaInicio').notEmpty().withMessage('Fecha de inicio requerida'),
], ctrl.create);

module.exports = router;