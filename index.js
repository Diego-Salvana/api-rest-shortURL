import 'dotenv/config';
import express from 'express';
import './database/conect_db.js';
import authRouter from './routes/auth.route.js';

const app = express();

app.use(express.json());
app.use('/api/v1', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT} 🔥`));
