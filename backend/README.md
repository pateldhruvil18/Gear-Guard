# GearGuard Backend API

Backend API for GearGuard Maintenance Management System built with Node.js, Express, and MongoDB.

## Features

- RESTful API endpoints
- JWT-based authentication
- MongoDB database with Mongoose ODM
- Role-based access control (Manager, Technician, User)
- CRUD operations for Equipment, Teams, and Requests
- Request status workflow management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gearguard
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

3. Make sure MongoDB is running on your system (or use MongoDB Atlas connection string)

4. Seed the database with initial data (optional):
```bash
node scripts/seed.js
```

5. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Equipment
- `GET /api/equipment` - Get all equipment (protected)
- `GET /api/equipment/:id` - Get equipment by ID (protected)
- `GET /api/equipment/:id/requests/count` - Get open requests count (protected)
- `POST /api/equipment` - Create equipment (manager only)
- `PUT /api/equipment/:id` - Update equipment (manager only)
- `DELETE /api/equipment/:id` - Delete equipment (manager only)

### Teams
- `GET /api/teams` - Get all teams (protected)
- `GET /api/teams/:id` - Get team by ID (protected)
- `POST /api/teams` - Create team (manager only)
- `PUT /api/teams/:id` - Update team (manager only)
- `DELETE /api/teams/:id` - Delete team (manager only)
- `POST /api/teams/:id/members` - Add member to team (manager only)
- `DELETE /api/teams/:id/members/:userId` - Remove member from team (manager only)

### Requests
- `GET /api/requests` - Get all requests with filters (protected)
- `GET /api/requests/:id` - Get request by ID (protected)
- `POST /api/requests` - Create request (protected)
- `PUT /api/requests/:id` - Update request (protected)
- `PATCH /api/requests/:id/status` - Update request status (protected)
- `PATCH /api/requests/:id/approve-edit` - Approve/reject edit (manager only)
- `DELETE /api/requests/:id` - Delete request (manager only)

### Users
- `GET /api/users` - Get all users (manager only)
- `GET /api/users/:id` - Get user by ID (protected)
- `PUT /api/users/:id` - Update user (protected)
- `DELETE /api/users/:id` - Delete user (manager only)

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Database Models

### User
- name, email, password, role, avatar

### Equipment
- name, serialNumber, purchaseDate, warrantyInfo, location, department, assignedEmployee, defaultMaintenanceTeam, category

### Team
- name, description, members[]

### Request
- subject, description, equipment, type, scheduledDate, duration, status, maintenanceTeam, assignedTechnician, createdBy, completedAt

## Default Users (from seed)

- **Manager**: manager@gearguard.com / password123
- **Technician**: mike@gearguard.com / password123
- **Technician**: sarah@gearguard.com / password123
- **User**: user@gearguard.com / password123

## MongoDB Connection

The backend connects to MongoDB using the connection string in `.env`. You can use:
- Local MongoDB: `mongodb://localhost:27017/gearguard`
- MongoDB Atlas: Your Atlas connection string

Make sure MongoDB is running before starting the server.


