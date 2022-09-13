import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const { Schema, model } = mongoose;

const userSchema = new Schema({
   email: {
      type: String,
      require: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: { unique: true },
   },
   password: { type: String, require: true },
});

userSchema.pre('save', async function (next) {
   const user = this;

   if (!user.isModified('password')) return;

   try {
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(user.password, salt);
      user.password = hash;
      next();
   } catch (err) {
      console.log(err);
      throw new Error('Falló el hash de contraseña.');
   }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
   return await bcryptjs.compare(candidatePassword, this.password);
};

export const User = model('User', userSchema);
