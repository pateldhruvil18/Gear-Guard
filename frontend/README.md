# GearGuard - Maintenance Management System

A comprehensive web-based maintenance management system for tracking equipment, managing maintenance teams, and handling maintenance requests.

## Features

### 🔧 Equipment Management
- Create, view, update, and delete equipment
- Equipment fields: Name, Serial Number, Purchase Date, Warranty Info, Location, Department, Default Maintenance Team
- Search and filter equipment
- Smart "Maintenance" button on each equipment card showing open request count

### 👥 Maintenance Teams
- Create and manage multiple maintenance teams (Mechanics, Electricians, IT Support, etc.)
- Assign technicians to teams
- Team listing with member preview

### 📋 Maintenance Requests
- Two request types: Corrective (Breakdown) and Preventive (Routine Checkup)
- Auto-fill logic: When equipment is selected, automatically fills maintenance team based on equipment's default team
- Status workflow: New → In Progress → Repaired / Scrap
- Only valid status transitions allowed

### 📊 Kanban Board (Primary View)
- Drag and drop cards between status columns
- Columns: New, In Progress, Repaired, Scrap
- Each card shows: Subject, Equipment name, Technician avatar, Overdue indicator

### 📅 Calendar View
- Shows only Preventive maintenance requests
- Display on scheduled date
- Click on date → open request creation modal (Managers only)
- Click event → open request details

### 🎨 Visual Indicators
- Red highlight/border for overdue requests
- Avatar of assigned technician
- Status color-coded tags

## Tech Stack

- **Framework**: React (Vite)
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **HTTP Client**: Axios
- **Drag & Drop**: @dnd-kit
- **Calendar**: FullCalendar
- **Icons**: React Icons

## Roles & Permissions

### Manager
- Full access to all features
- Can schedule preventive maintenance
- Can manage teams and equipment

### Technician
- Can view Kanban board and Calendar
- Can pick requests from assigned maintenance team
- Can update request status

### User
- Can create maintenance requests
- Can view equipment and requests
- Limited access to other features

## Quick Start

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5173
```

### Available Commands

```bash
npm run dev          # Start development server (recommended for development)
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Demo Login

The application includes demo users. On the login page, you can:
- Use any email from the quick login section
- Password is not validated in demo mode (enter any password)
- Click on a user card in "Quick Login" section for instant login

**Demo Users:**
- Manager: manager@gearguard.com
- Technician: mike@gearguard.com or sarah@gearguard.com  
- User: user@gearguard.com

## Demo Users

The application includes demo users for testing:

- **Manager**: manager@gearguard.com (Password: any)
- **Technician**: mike@gearguard.com (Password: any)
- **User**: user@gearguard.com (Password: any)

## API Integration

The application uses mock data by default. To connect to a backend API:

1. Create a `.env` file:
```
VITE_API_BASE_URL=http://localhost:3001/api
```

2. The API layer is ready in `src/api/` and will automatically switch to real API calls when `VITE_API_BASE_URL` is set.

## Project Structure

```
src/
├── api/              # API integration layer
├── components/       # Reusable components
│   ├── common/      # Common UI components
│   ├── equipment/   # Equipment-related components
│   ├── teams/       # Team-related components
│   ├── requests/    # Request-related components
│   ├── kanban/      # Kanban board components
│   ├── calendar/    # Calendar components
│   └── layout/      # Layout components
├── contexts/        # React Context providers
├── data/           # Mock data
├── pages/          # Page components
├── utils/          # Utility functions
└── App.jsx         # Main application component
```

## Features Implementation Status

✅ Equipment Management (CRUD, search, filters, Maintenance button)
✅ Maintenance Teams (CRUD, member assignment)
✅ Maintenance Requests (CRUD, auto-fill logic, status workflow)
✅ Kanban Board with drag & drop
✅ Calendar View for preventive maintenance
✅ Visual indicators (overdue, avatars, color-coded tags)
✅ Role-based access control
✅ Toast notifications
✅ Loading states
✅ Responsive design

## License

This project is part of a development demonstration.

