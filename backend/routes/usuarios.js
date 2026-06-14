const router  = require('express').Router();
const auth    = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const ctrl    = require('../controllers/usuarioController');

router.get('/me',           auth,          ctrl.getMe);
router.get('/',             auth, isAdmin, ctrl.getAll);
router.patch('/:id/verificar', auth, isAdmin, ctrl.verificar);

module.exports = router;