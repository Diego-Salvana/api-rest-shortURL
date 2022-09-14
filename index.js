import 'dotenv/config';
import express from 'express';
import './database/conect_db.js';
import authRouter from './routes/auth.route.js';
import linkRouter from './routes/link.route.js';
import redirectRouter from './routes/redirect.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const whiteList = [process.env.ORIGIN1]; //Dominios permitidos por CORS

app.use(
   cors({
      origin: function (origin, callback) {
         if (!origin || whiteList.includes(origin)) return callback(null, origin);
         return callback(`Error de CORS origin ${origin} No autorizado`);
      },
   })
);

app.use(express.json());
app.use(cookieParser());

app.use('/nano', redirectRouter); //Ejemplo back redirect
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/links', linkRouter);

//Sólo para probar el login/token
app.use(express.static('public'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT} 🔥`));
