import jwt from 'jsonwebtoken';

export const requireToken = (req, res, next) => {
   console.log(req.headers);
   try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) throw new Error('No Bearer.');

      const payload = jwt.verify(token, process.env.JWT_SERCRET);
      req.uid = payload.uid;

      next();
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
