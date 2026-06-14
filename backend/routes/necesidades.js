const router  = require('express').Router();
const { body } = require('express-validator');
const auth    = require('../middlewares/auth');
const ctrl    = require('../controllers/necesidadController');

router.get('/',     ctrl.getAll);
router.get('/:id',  ctrl.getById);
router.post('/', auth, [
  body('titulo').notEmpty().withMessage('Título requerido'),
  body('descripcion').notEmpty().withMessage('Descripción requerida'),
  body('categoria').notEmpty().withMessage('Categoría requerida'),
  body('meta').isInt({ min: 1 }).withMessage('Meta debe ser mayor a 0'),
], ctrl.create);
router.put('/:id',    auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;