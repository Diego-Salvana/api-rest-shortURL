import jwt from 'jsonwebtoken';
import { tokenVerificationErrors } from '../utils/tokenManager.js';

export const validationRefreshToken = (req, res, next) => {
   try {
      const refreshTokenCookie = req.cookies.refreshToken;
      if (!refreshTokenCookie) throw new Error('No Bearer.');

      const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
      req.uid = uid;

      next();
   } catch (err) {
      console.log(err);
      return res.status(401).json(tokenVerificationErrors[err.message] || err.message);
   }
};
