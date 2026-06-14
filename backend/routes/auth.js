const router = require('express').Router();
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

router.post('/register', [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres'),
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Contraseña requerida'),
], login);

module.exports = router;