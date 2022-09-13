import { Router } from 'express';
import { infoUser, login, logout, refreshToken, register } from '../controllers/auth.controller.js';
import { body } from 'express-validator';
import { validationResultExpress } from '../middlewares/validationResultExpress.js';
import { requireToken } from '../middlewares/validationToken.js';

const router = Router();

router.post(
   '/register',
   [
      body('email', 'Formato de email incorrecto.').trim().isEmail().normalizeEmail(),
      body('password', 'Tamaño mínimo 5 caracteres.').trim().isLength({ min: 5 }),
      body('password').custom((value, { req }) => {
         if (value !== req.body.repassword) throw new Error('Las contraseñas no coinciden.');
         return value;
      }),
   ],
   validationResultExpress,
   register
);

router.post(
   '/login',
   [
      body('email', 'Formato de email incorrecto.').trim().isEmail().normalizeEmail(),
      body('password', 'Tamaño mínimo 5 caracteres.').trim().isLength({ min: 5 }),
   ],
   validationResultExpress,
   login
);

router.get('/protected', requireToken, infoUser);
router.get('/refresh', refreshToken);
router.get('/logout', logout);

export default router;
