import jwt from 'jsonwebtoken';
import { tokenVerificationErrors } from '../utils/tokenManager.js';

export const requireToken = (req, res, next) => {
   try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) throw new Error('No Bearer.');

      const payload = jwt.verify(token, process.env.JWT_SERCRET);
      req.uid = payload.uid;

      next();
   } catch (err) {
      console.log(err);
      return res.status(401).json(tokenVerificationErrors[err.message] || err.message);
   }
};
