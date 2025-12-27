// Mock Users
export const mockUsers = [
  {
    id: '1',
    name: 'John Manager',
    email: 'manager@gearguard.com',
    role: 'manager',
    avatar: null,
  },
  {
    id: '2',
    name: 'Mike Technician',
    email: 'mike@gearguard.com',
    role: 'technician',
    avatar: null,
  },
  {
    id: '3',
    name: 'Sarah Technician',
    email: 'sarah@gearguard.com',
    role: 'technician',
    avatar: null,
  },
  {
    id: '4',
    name: 'Tom User',
    email: 'user@gearguard.com',
    role: 'user',
    avatar: null,
  },
];

// Mock Departments
export const mockDepartments = [
  { id: '1', name: 'Production' },
  { id: '2', name: 'IT' },
  { id: '3', name: 'Maintenance' },
  { id: '4', name: 'Warehouse' },
];

// Mock Locations
export const mockLocations = [
  { id: '1', name: 'Building A' },
  { id: '2', name: 'Building B' },
  { id: '3', name: 'Warehouse' },
  { id: '4', name: 'Office' },
];

// Mock Maintenance Teams
export const mockTeams = [
  {
    id: '1',
    name: 'Mechanics',
    description: 'Mechanical maintenance team',
    members: ['2'], // Mike Technician
  },
  {
    id: '2',
    name: 'Electricians',
    description: 'Electrical maintenance team',
    members: ['3'], // Sarah Technician
  },
  {
    id: '3',
    name: 'IT Support',
    description: 'IT equipment maintenance',
    members: ['2', '3'], // Both technicians
  },
];

// Mock Equipment
export const mockEquipment = [
  {
    id: '1',
    name: 'CNC Machine #1',
    serialNumber: 'CNC-001',
    purchaseDate: '2020-01-15',
    warrantyInfo: '3 years warranty',
    location: '1',
    department: '1',
    assignedEmployee: '4',
    defaultMaintenanceTeam: '1',
    category: 'Manufacturing Equipment',
  },
  {
    id: '2',
    name: 'Server Rack A',
    serialNumber: 'SRV-001',
    purchaseDate: '2021-03-20',
    warrantyInfo: '5 years warranty',
    location: '4',
    department: '2',
    assignedEmployee: null,
    defaultMaintenanceTeam: '3',
    category: 'IT Equipment',
  },
  {
    id: '3',
    name: 'Forklift #3',
    serialNumber: 'FL-003',
    purchaseDate: '2019-06-10',
    warrantyInfo: '2 years warranty',
    location: '3',
    department: '4',
    assignedEmployee: null,
    defaultMaintenanceTeam: '1',
    category: 'Warehouse Equipment',
  },
  {
    id: '4',
    name: 'HVAC System',
    serialNumber: 'HVAC-001',
    purchaseDate: '2020-11-05',
    warrantyInfo: '4 years warranty',
    location: '1',
    department: '3',
    assignedEmployee: null,
    defaultMaintenanceTeam: '2',
    category: 'Facilities Equipment',
  },
];

// Mock Maintenance Requests
export const mockRequests = [
  {
    id: '1',
    subject: 'CNC Machine Overheating',
    equipment: '1',
    type: 'corrective',
    scheduledDate: '2024-12-28',
    duration: null,
    status: 'pending',
    maintenanceTeam: '1',
    assignedTechnician: null,
    createdAt: '2024-12-27T10:00:00Z',
    description: 'Machine overheating during operation',
  },
  {
    id: '2',
    subject: 'Monthly Server Maintenance',
    equipment: '2',
    type: 'preventive',
    scheduledDate: '2024-12-30',
    duration: null,
    status: 'pending',
    maintenanceTeam: '3',
    assignedTechnician: null,
    createdAt: '2024-12-20T08:00:00Z',
    description: 'Regular monthly maintenance check',
  },
  {
    id: '3',
    subject: 'Forklift Hydraulic Issue',
    equipment: '3',
    type: 'corrective',
    scheduledDate: '2024-12-26',
    duration: 2,
    status: 'repaired',
    maintenanceTeam: '1',
    assignedTechnician: '2',
    createdAt: '2024-12-25T14:00:00Z',
    completedAt: '2024-12-26T16:00:00Z',
    description: 'Hydraulic system not working properly',
  },
  {
    id: '4',
    subject: 'HVAC Filter Replacement',
    equipment: '4',
    type: 'preventive',
    scheduledDate: '2025-01-05',
    duration: null,
    status: 'in-progress',
    maintenanceTeam: '2',
    assignedTechnician: '3',
    createdAt: '2024-12-15T09:00:00Z',
    description: 'Quarterly filter replacement',
  },
];

