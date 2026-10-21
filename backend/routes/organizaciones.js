const router  = require('express').Router();
const { body } = require('express-validator');
const auth    = require('../middlewares/auth');
const ctrl    = require('../controllers/organizacionController');

//Consultar todas las organizaciones y una en especifico
router.get('/',     auth, ctrl.getAll);
router.get('/:id',  auth, ctrl.getOne);

//Registrar una nueva organización
router.post('/', auth, [
  body('nombre').notEmpty().withMessage('Nombre requerido'),
  body('direccion').notEmpty().withMessage('Dirección requerida'),
  body('telefono').notEmpty().withMessage('Teléfono requerido'),
], ctrl.create);

//Actualizar una organización
router.put('/:id', auth, [
  body('nombre').optional().notEmpty(),
], ctrl.update);

//Desactivar una organización
router.patch('/:id/desactivar', auth, ctrl.desactivar);

module.exports = router;
