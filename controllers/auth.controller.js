import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import {
   generateRefreshToken,
   generateToken,
   tokenVerificationErrors,
} from '../utils/tokenManager.js';

export const register = async (req, res) => {
   const { email, password } = req.body;
   try {
      //Alternativa buscando en db por email (requiere de 2 consultas)
      // let user = await User.findOne({ email });
      // if (user) throw { code: 11000 };

      const newUser = new User({ email, password });
      await newUser.save();

      //enviar jwt (opcional)
      return res.status(201).json({ usuarioCreado: 'ok' });
   } catch (err) {
      console.log(err);

      //Alternativa mongoose. Error code 11000: llave única duplicada
      if (err.code === 11000) return res.status(400).json({ error: 'Ya existe este usuario.' });

      return res.status(500).json({ error: 'Error de servidor.' });
   }
};

export const login = async (req, res) => {
   const { email, password } = req.body;
   try {
      const user = await User.findOne({ email });
      if (!user) return res.status(403).json({ error: 'No existe el usuario.' });

      const comparePassword = await user.comparePassword(password);
      if (!comparePassword) return res.status(403).json({ error: 'Contraseña incorrecta.' });

      //Generar JWT
      const { token, expiresIn } = generateToken(user._id);
      generateRefreshToken(user._id, res);

      return res.json({ token, expiresIn });
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
      const { token, expiresIn } = generateToken(req.uid);
      return res.json({ token, expiresIn });
   } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error de servidor.' });
   }
};

export const logout = (req, res) => {
   res.clearCookie('refreshToken');
   return res.json({ logout: 'ok' });
};
