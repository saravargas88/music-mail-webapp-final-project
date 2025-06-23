import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.DSN);
await mongoose.connection.db.collection('users').dropIndex('email_1');
console.log(' dropped email_1 ');
await mongoose.disconnect();