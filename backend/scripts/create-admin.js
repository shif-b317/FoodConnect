import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createInterface } from 'node:readline';
import User from '../src/models/User.js';

dotenv.config();

function promptSecret(label) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') {
    throw new Error('Run this command in an interactive terminal so the password can be entered without echo.');
  }
  process.stdout.write(label);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve, reject) => {
    let value = '';
    const finish = (error) => {
      process.stdin.off('data', onData);
      process.stdin.setRawMode(false);
      process.stdout.write('\n');
      if (error) reject(error);
      else resolve(value);
    };
    const onData = (chunk) => {
      for (const char of chunk.toString('utf8')) {
        if (char === '\u0003') return finish(new Error('Admin creation cancelled.'));
        if (char === '\r' || char === '\n') return finish();
        if (char === '\u007f' || char === '\b') value = value.slice(0, -1);
        else if (char >= ' ') value += char;
      }
    };
    process.stdin.on('data', onData);
  });
}

const prompt = createInterface({ input: process.stdin, output: process.stdout });
try {
  const email = (await prompt.question('Admin email: ')).trim().toLowerCase();
  prompt.close();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Enter a valid email address.');
  const password = await promptSecret('Admin password (minimum 12 characters): ');
  if (password.length < 12) throw new Error('Admin password must be at least 12 characters.');
  if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in backend/.env before creating an admin.');

  await mongoose.connect(process.env.MONGODB_URI);
  if (await User.exists({ email })) throw new Error('An account with this email already exists. Choose a new admin email.');
  await User.create({ name: 'FOOD CONNECT Admin', email, passwordHash: await bcrypt.hash(password, 12), role: 'admin' });
  console.log(`Admin account created for ${email}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  prompt.close();
  if (mongoose.connection.readyState) await mongoose.disconnect();
}
