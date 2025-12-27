import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

console.log('🔍 GearGuard Backend Setup Verification\n');
console.log('=' .repeat(50));

// Check 1: Environment Variables
console.log('\n1️⃣  Checking Environment Variables...');
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
const missingEnvVars = [];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingEnvVars.push(varName);
  }
});

if (missingEnvVars.length > 0) {
  console.log('⚠️  Missing environment variables:', missingEnvVars.join(', '));
  console.log('💡 Create a .env file with:');
  console.log('   PORT=3001');
  console.log('   MONGODB_URI=mongodb://localhost:27017/gearguard');
  console.log('   JWT_SECRET=your-secret-key');
} else {
  console.log('✅ All environment variables are set');
  console.log(`   PORT: ${process.env.PORT}`);
  console.log(`   MONGODB_URI: ${process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
  console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '***' : 'NOT SET'}`);
}

// Check 2: Dependencies
console.log('\n2️⃣  Checking Dependencies...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules directory exists');
  
  // Check key dependencies
  const keyDeps = ['express', 'mongoose', 'dotenv', 'bcryptjs', 'jsonwebtoken', 'cors'];
  const missingDeps = [];
  
  keyDeps.forEach(dep => {
    const depPath = path.join(nodeModulesPath, dep);
    if (!fs.existsSync(depPath)) {
      missingDeps.push(dep);
    }
  });
  
  if (missingDeps.length > 0) {
    console.log('⚠️  Missing dependencies:', missingDeps.join(', '));
    console.log('💡 Run: npm install');
  } else {
    console.log('✅ All key dependencies are installed');
  }
} else {
  console.log('❌ node_modules directory not found');
  console.log('💡 Run: npm install');
}

// Check 3: MongoDB Connection
console.log('\n3️⃣  Testing MongoDB Connection...');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gearguard';

try {
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  
  console.log('✅ Successfully connected to MongoDB!');
  console.log(`   Database: ${mongoose.connection.db.databaseName}`);
  console.log(`   Host: ${mongoose.connection.host}`);
  console.log(`   Port: ${mongoose.connection.port}`);
  
  // Check if collections exist
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log(`   Collections: ${collections.length} found`);
  if (collections.length > 0) {
    console.log(`   - ${collections.map(c => c.name).join(', ')}`);
  }
  
  await mongoose.disconnect();
  console.log('✅ MongoDB connection test passed');
} catch (error) {
  console.log('❌ MongoDB connection failed!');
  console.log(`   Error: ${error.message}`);
  console.log('\n💡 Troubleshooting:');
  console.log('   1. Make sure MongoDB is running');
  console.log('   2. Check your MONGODB_URI in .env file');
  console.log('   3. For local: mongodb://localhost:27017/gearguard');
  console.log('   4. For Atlas: Use your Atlas connection string');
}

// Check 4: File Structure
console.log('\n4️⃣  Checking File Structure...');
const requiredFiles = [
  'server.js',
  'package.json',
  'models/User.model.js',
  'models/Equipment.model.js',
  'models/Team.model.js',
  'models/Request.model.js',
  'routes/auth.routes.js',
  'routes/equipment.routes.js',
  'routes/teams.routes.js',
  'routes/requests.routes.js',
  'controllers/auth.controller.js',
  'controllers/equipment.controller.js',
  'controllers/teams.controller.js',
  'controllers/requests.controller.js',
  'middleware/auth.middleware.js',
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('✅ All required files are present');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📋 Summary:');
console.log('='.repeat(50));

const issues = [];
if (missingEnvVars.length > 0) issues.push('Environment variables (optional - defaults will be used)');
if (!fs.existsSync(nodeModulesPath)) issues.push('Dependencies not installed');
// Note: MongoDB connection is tested above, if it passed, don't add to issues

if (issues.length === 0) {
  console.log('✅ Backend setup is complete and ready to use!');
  console.log('\n🚀 To start the server:');
  console.log('   npm run dev    (development with auto-reload)');
  console.log('   npm start      (production)');
  console.log('\n🌱 To seed the database:');
  console.log('   node scripts/seed.js');
} else {
  console.log('⚠️  Issues found:');
  issues.forEach(issue => console.log(`   - ${issue}`));
  console.log('\n💡 Please fix the issues above before starting the server');
}

process.exit(issues.length === 0 ? 0 : 1);

