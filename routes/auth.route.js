import { Router } from 'express';
import { infoUser, login, logout, refreshToken, register } from '../controllers/auth.controller.js';
import { requireToken } from '../middlewares/validationToken.js';
import { validationRefreshToken } from '../middlewares/validationRefreshToken.js';
import { bodyLoginValidation, bodyRegisterValidation } from '../middlewares/validatorManager.js';

const router = Router();

router.post('/register', bodyRegisterValidation, register);
router.post('/login', bodyLoginValidation, login);
router.get('/protected', requireToken, infoUser);
router.get('/refresh', validationRefreshToken, refreshToken);
router.get('/logout', logout);

export default router;
