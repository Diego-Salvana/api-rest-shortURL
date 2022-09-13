import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { generateRefreshToken, generateToken } from '../utils/tokenManager.js';

export const register = async (req, res) => {
   console.log(req.body);
   const { email, password } = req.body;

   try {
      //Alternativa buscando en db por email (requiere de 2 consultas)
      // let user = await User.findOne({ email });
      // if (user) throw { code: 11000 };

      const newUser = new User({ email, password });
      await newUser.save();

      //enviar jwt

      return res.status(201).json({ token: 'JWT' });
   } catch (err) {
      console.log(err);

      //Alternativa mongoose. Error code 11000: llave única duplicada
      if (err.code === 11000) return res.status(400).json({ error: 'Ya existe este usuario.' });

      return res.status(500).json({ error: 'Error de servidor.' });
   }
};

export const login = async (req, res) => {
   console.log(req.body);

   const { email, password } = req.body;

   try {
      const user = await User.findOne({ email });
      if (!user) return res.status(403).json({ error: 'No existe el usuario.' });

      const comparePassword = await user.comparePassword(password);
      if (!comparePassword) return res.status(403).json({ error: 'Contraseña incorrecta.' });

      //Generar JWT
      //const { token, expiresIn } = generateToken(user._id);
      generateRefreshToken(user._id, res);

      return res.json({ login: 'ok' });
   } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error de servidor.' });
   }
};

export const infoUser = async (req, res) => {
   try {
      const user = await User.findById(req.uid).lean();

      return res.json({ email: user.email });
   } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error de servidor.' });
   }
};

export const refreshToken = (req, res) => {
   try {
      const refreshTokenCookie = req.cookies.refreshToken;
      if (!refreshTokenCookie) throw new Error('No Bearer.');

      const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
      const { token, expiresIn } = generateToken(uid);

      res.json({ token, expiresIn });
   } catch (err) {
      console.log(err);

      const tokenVerificationErrors = {
         'invalid signature': 'La firma del JWT no es válida',
         'jwt expired': 'JWT expirado',
         'invalid token': 'Token no válido',
         'jwt malformed': 'Formato JWT no válido',
         'No Bearer': 'No existe el token, usa Bearer',
      };

      return res.status(401).json(tokenVerificationErrors[err.message] || err.message);
   }
};

export const logout = (req, res) => {
   res.clearCookie('refreshToken');
   return res.json({ logout: 'ok' });
};
