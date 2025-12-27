import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';
import Team from '../models/Team.model.js';
import Equipment from '../models/Equipment.model.js';
import Request from '../models/Request.model.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gearguard');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Team.deleteMany({});
    await Equipment.deleteMany({});
    await Request.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create only manager user
    const manager = await User.create({
      name: 'Dhruvil Patel',
      email: 'dhp123@gmail.com',
      password: 'dhp@123',
      role: 'manager',
    });

    console.log('👥 Created manager user: Dhruvil Patel');
    console.log('✅ Database seeded successfully!');
    console.log('📝 Manager credentials:');
    console.log('   Email: dhp123@gmail.com');
    console.log('   Password: dhp@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();


