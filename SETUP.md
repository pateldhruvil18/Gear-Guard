# GearGuard Setup Guide

This guide will help you set up the GearGuard project with separate frontend and backend folders, connected to MongoDB.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Step 1: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gearguard
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**For MongoDB Atlas:**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string
- Replace `MONGODB_URI` with your Atlas connection string

4. Start MongoDB (if using local installation):
   - Windows: MongoDB should start automatically as a service
   - Mac/Linux: `mongod` or `sudo systemctl start mongod`

5. Seed the database with initial data (optional but recommended):
```bash
node scripts/seed.js
```

This will create:
- 4 users (1 manager, 2 technicians, 1 user)
- 3 teams (Mechanics, Electricians, IT Support)
- 4 equipment items
- 4 maintenance requests

6. Start the backend server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:3001`

## Step 2: Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

**Note:** If you don't create this file or leave it empty, the frontend will use mock data instead of the backend API.

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Step 3: Access the Application

1. Open your browser and navigate to: `http://localhost:5173`

2. Login with one of the seeded users:
   - **Manager**: manager@gearguard.com / password123
   - **Technician**: mike@gearguard.com / password123
   - **Technician**: sarah@gearguard.com / password123
   - **User**: user@gearguard.com / password123

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

**Port Already in Use:**
- Change the `PORT` in backend `.env` file
- Or stop the process using port 3001

**Module Not Found:**
- Run `npm install` in the backend directory
- Make sure you're using Node.js v16 or higher

### Frontend Issues

**API Connection Error:**
- Make sure the backend is running
- Check `VITE_API_BASE_URL` in frontend `.env`
- Check browser console for CORS errors (should be handled by backend)

**Cannot Find Module:**
- Run `npm install` in the frontend directory
- Clear node_modules and reinstall if needed

### Database Issues

**Seed Script Fails:**
- Make sure MongoDB is running
- Check your connection string
- Try dropping the database and running seed again

**Data Not Showing:**
- Check if seed script ran successfully
- Verify MongoDB connection
- Check backend logs for errors

## Project Structure

```
GearGuard/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth and other middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── scripts/        # Utility scripts (seed, etc.)
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/         # API integration
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts
│   │   ├── pages/       # Page components
│   │   └── utils/       # Utility functions
│   └── package.json
└── README.md
```

## Development Workflow

1. Start MongoDB (if using local)
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm run dev`
4. Make changes and see them hot-reload
5. Check console for errors

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## MongoDB Compass

To view and manage your database using MongoDB Compass:

1. Download MongoDB Compass from: https://www.mongodb.com/products/compass
2. Connect using your connection string:
   - Local: `mongodb://localhost:27017`
   - Atlas: Your Atlas connection string
3. Navigate to the `gearguard` database
4. Explore collections: users, equipment, teams, requests

## Next Steps

- Customize the JWT_SECRET for production
- Set up environment-specific configurations
- Add more validation and error handling
- Implement additional features as needed


