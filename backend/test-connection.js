import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gearguard';

console.log('🔍 Testing MongoDB connection...');
console.log(`📡 Connection string: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('✅ Successfully connected to MongoDB!');
    console.log('✅ Database:', mongoose.connection.db.databaseName);
    console.log('✅ Connection state:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed!');
    console.error('Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Check your MONGODB_URI in .env file');
    console.log('3. For local MongoDB: mongodb://localhost:27017/gearguard');
    console.log('4. For MongoDB Atlas: Use your Atlas connection string');
    process.exit(1);
  });

