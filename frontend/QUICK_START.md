# 🚀 Quick Start Guide - GearGuard

## Running the Application

### Step 1: Install Dependencies (if not already installed)

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required dependencies including React, Vite, Tailwind CSS, and other packages.

### Step 2: Start Development Server

Run the development server:

```bash
npm run dev
```

The application will start and you'll see output like:

```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 3: Open in Browser

Open your browser and navigate to:

```
http://localhost:5173
```

## 📝 Available Commands

### Development
```bash
npm run dev          # Start development server (hot reload enabled)
```

### Production
```bash
npm run build        # Build for production (creates 'dist' folder)
npm run preview      # Preview production build locally
```

## 🔐 Login Credentials (Demo)

The application includes demo users. You can use any of these:

### Manager Account
- **Email:** manager@gearguard.com
- **Password:** (any password works in demo mode)

### Technician Account
- **Email:** mike@gearguard.com or sarah@gearguard.com
- **Password:** (any password works in demo mode)

### User Account
- **Email:** user@gearguard.com
- **Password:** (any password works in demo mode)

**Note:** On the login page, you can click on any user in the "Quick Login" section for instant login!

## 🎯 What to Try

1. **Login** with any demo user
2. **Dashboard** - View overview and statistics
3. **Equipment** - Create and manage equipment
4. **Teams** - Create maintenance teams (Manager only)
5. **Requests** - Create maintenance requests
6. **Kanban Board** - Drag & drop requests between statuses
7. **Calendar** - View and schedule preventive maintenance

## ⚠️ Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port (5174, 5175, etc.). Check the terminal output for the actual port.

### Clear Cache (if needed)

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For Windows PowerShell:
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### Build Issues

If you encounter build issues:

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# For Windows:
Remove-Item -Recurse -Force node_modules\.vite
```

## 📦 Project Structure

```
GearGuard/
├── src/
│   ├── api/              # API integration layer
│   ├── components/       # React components
│   ├── contexts/         # React Context providers
│   ├── data/            # Mock data
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   └── App.jsx          # Main app component
├── public/              # Static assets
├── index.html           # HTML template
└── package.json         # Dependencies
```

## 🌐 Connecting to Backend API

The application uses mock data by default. To connect to a real backend:

1. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://your-api-url.com/api
```

2. The API layer will automatically switch to real API calls when this variable is set.

## ✨ Features

- ✅ Equipment Management (CRUD)
- ✅ Maintenance Teams
- ✅ Maintenance Requests
- ✅ Kanban Board (Drag & Drop)
- ✅ Calendar View
- ✅ Role-based Access Control
- ✅ Real-time Status Updates
- ✅ Search & Filters
- ✅ Responsive Design

Enjoy using GearGuard! 🎉

