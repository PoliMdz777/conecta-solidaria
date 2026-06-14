const router  = require('express').Router();
const { body } = require('express-validator');
const auth    = require('../middlewares/auth');
const ctrl    = require('../controllers/donacionController');

router.get('/',  auth, ctrl.getAll);
router.post('/', auth, [
  body('necesidad').notEmpty().withMessage('Necesidad requerida'),
  body('descripcionArticulo').notEmpty().withMessage('Descripción del artículo requerida'),
  body('cantidad').isInt({ min: 1 }).withMessage('Cantidad debe ser mayor a 0'),
], ctrl.create);

module.exports = router;