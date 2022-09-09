import mongoose from 'mongoose';

try {
   await mongoose.connect(process.env.URI_MONGO);
   console.log('Conectado a db 📖');
} catch (err) {
   console.log(`Error al conectar a db: ${err}`);
}
