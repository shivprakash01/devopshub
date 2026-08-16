import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Node on Windows resolving MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (err) {
  // Use default system DNS if setServers is restricted
}

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/devopshub';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[Database] 🚀 MongoDB Connected Successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.log(`[Database] Notice: MongoDB Atlas / local service not connected (${error.message}). Running with Resilient In-Memory Data Store.`);
    return false;
  }
};
