# GearGuard Project Structure

This document describes the complete structure of the GearGuard project after separating frontend and backend.

## Directory Structure

```
GearGuard/
├── backend/                    # Node.js/Express Backend API
│   ├── config/
│   │   └── database.js         # MongoDB connection configuration
│   ├── controllers/            # Request handlers (business logic)
│   │   ├── auth.controller.js
│   │   ├── equipment.controller.js
│   │   ├── requests.controller.js
│   │   ├── teams.controller.js
│   │   └── users.controller.js
│   ├── middleware/             # Express middleware
│   │   └── auth.middleware.js  # JWT authentication & authorization
│   ├── models/                 # MongoDB/Mongoose models
│   │   ├── Equipment.model.js
│   │   ├── Request.model.js
│   │   ├── Team.model.js
│   │   └── User.model.js
│   ├── routes/                 # API route definitions
│   │   ├── auth.routes.js
│   │   ├── equipment.routes.js
│   │   ├── requests.routes.js
│   │   ├── teams.routes.js
│   │   └── users.routes.js
│   ├── scripts/
│   │   └── seed.js             # Database seeding script
│   ├── .env                    # Environment variables (create this)
│   ├── .gitignore
│   ├── package.json
│   ├── README.md
│   └── server.js               # Main server entry point
│
├── frontend/                   # React Frontend Application
│   ├── src/
│   │   ├── api/                # API integration layer
│   │   │   ├── authApi.js
│   │   │   ├── axios.js        # Axios instance with interceptors
│   │   │   ├── equipmentApi.js
│   │   │   ├── requestsApi.js
│   │   │   └── teamsApi.js
│   │   ├── components/         # React components
│   │   │   ├── calendar/       # Calendar-related components
│   │   │   ├── common/         # Reusable UI components
│   │   │   ├── equipment/      # Equipment components
│   │   │   ├── kanban/         # Kanban board components
│   │   │   ├── layout/         # Layout components
│   │   │   ├── requests/       # Request components
│   │   │   └── teams/           # Team components
│   │   ├── contexts/           # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── data/
│   │   │   └── mockData.js     # Mock data (fallback)
│   │   ├── pages/              # Page components
│   │   │   ├── CalendarPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── EquipmentPage.jsx
│   │   │   ├── KanbanPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RequestsPage.jsx
│   │   │   └── TeamsPage.jsx
│   │   ├── utils/              # Utility functions
│   │   │   ├── dataUtils.js    # Data normalization utilities
│   │   │   └── dateUtils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   ├── public/
│   ├── .env                    # Environment variables (create this)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── README.md                   # Main project documentation
├── SETUP.md                    # Setup instructions
└── PROJECT_STRUCTURE.md        # This file
```

## Backend Architecture

### Models (MongoDB/Mongoose)
- **User**: Authentication and user management
- **Equipment**: Equipment inventory
- **Team**: Maintenance teams
- **Request**: Maintenance requests

### API Endpoints

#### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user (protected)

#### Equipment (`/api/equipment`)
- `GET /` - Get all equipment
- `GET /:id` - Get equipment by ID
- `GET /:id/requests/count` - Get open requests count
- `POST /` - Create equipment (manager only)
- `PUT /:id` - Update equipment (manager only)
- `DELETE /:id` - Delete equipment (manager only)

#### Teams (`/api/teams`)
- `GET /` - Get all teams
- `GET /:id` - Get team by ID
- `POST /` - Create team (manager only)
- `PUT /:id` - Update team (manager only)
- `DELETE /:id` - Delete team (manager only)
- `POST /:id/members` - Add member (manager only)
- `DELETE /:id/members/:userId` - Remove member (manager only)

#### Requests (`/api/requests`)
- `GET /` - Get all requests (with filters)
- `GET /:id` - Get request by ID
- `POST /` - Create request
- `PUT /:id` - Update request
- `PATCH /:id/status` - Update request status
- `PATCH /:id/approve-edit` - Approve/reject edit (manager only)
- `DELETE /:id` - Delete request (manager only)

#### Users (`/api/users`)
- `GET /` - Get all users (manager only)
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user (manager only)

## Frontend Architecture

### API Layer
- All API calls go through the `api/` directory
- Automatic fallback to mock data if `VITE_API_BASE_URL` is not set
- Response normalization to handle backend format

### State Management
- React Context API for global state
- `AuthContext` for authentication
- `ToastContext` for notifications

### Data Handling
- `dataUtils.js` normalizes data from backend (populated objects) vs mock data (IDs)
- Handles both MongoDB ObjectIds and string IDs

## Key Features

### Authentication
- JWT-based authentication
- Role-based access control (Manager, Technician, User)
- Protected routes with middleware

### Data Flow
1. Frontend makes API call through `api/` layer
2. API layer checks for `VITE_API_BASE_URL`
3. If set, calls backend API; otherwise uses mock data
4. Response is normalized to consistent format
5. Components use normalized data

### Database
- MongoDB with Mongoose ODM
- Automatic ObjectId to string conversion
- Populated references for related data
- Indexes for performance

## Environment Variables

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gearguard
JWT_SECRET=your-super-secret-jwt-key
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## Development Workflow

1. Start MongoDB (local or Atlas)
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm run dev`
4. Seed database (optional): `cd backend && node scripts/seed.js`

## Code Quality

- ✅ No linting errors
- ✅ Proper error handling
- ✅ Response normalization
- ✅ Type safety with data utilities
- ✅ Consistent code structure

## Next Steps

1. Set up environment variables
2. Install dependencies in both folders
3. Start MongoDB
4. Run seed script
5. Start both servers
6. Test the application


