import { body, validationResult } from 'express-validator';
import axios from 'axios';

const validationResultExpress = (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

   next();
};

export const bodyLinkValidator = [
   body('longLink', 'Formato de link incorrecto')
      .trim()
      .notEmpty()
      .custom(async (value) => {
         try {
            if (!value.startsWith('https://')) value = `https://${value}`;

            await axios.get(value);
            return value;
         } catch (err) {
            console.log(err);
            throw new Error('not found longLink 404');
         }
      }),
   validationResultExpress,
];

export const bodyRegisterValidation = [
   body('email', 'Formato de email incorrecto.').trim().isEmail().normalizeEmail(),
   body('password', 'Tamaño mínimo 5 caracteres.').trim().isLength({ min: 5 }),
   body('password').custom((value, { req }) => {
      if (value !== req.body.repassword) throw new Error('Las contraseñas no coinciden.');
      return value;
   }),
   validationResultExpress,
];

export const bodyLoginValidation = [
   body('email', 'Formato de email incorrecto.').trim().isEmail().normalizeEmail(),
   body('password', 'Tamaño mínimo 5 caracteres.').trim().isLength({ min: 5 }),
   validationResultExpress,
];
