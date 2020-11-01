const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');

router.post('/auth/sign-up',
    [
        check('names', 'El nombre es obligatorio').not().isEmpty(),
        check('surnames', 'El apellido es obligatorio').not().isEmpty(),
        check('email', 'El email debe ser válido').isEmail(),
        check('password', 'La contraseña debe contener al menos 6 caracteres').isLength({ min: 6 })
    ],
    authController.signUp
);

router.post('/auth/log-in',
    [
        check('email', 'Email no válido').isEmail(),
        check('password', 'Contraseña no válida').not().isEmpty()
    ],
    authController.logIn
);

module.exports = router;