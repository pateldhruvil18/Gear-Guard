// Utility functions to normalize data from API (populated) vs mock data (IDs)

export const getEquipmentName = (request, mockEquipment = []) => {
  if (typeof request.equipment === 'object' && request.equipment?.name) {
    // Backend API - populated equipment
    return request.equipment.name;
  }
  // Mock data - equipment is an ID
  const equipment = mockEquipment.find(eq => eq.id === request.equipment);
  return equipment?.name || 'Unknown Equipment';
};

export const getEquipmentId = (request) => {
  if (typeof request.equipment === 'object' && request.equipment?._id) {
    return request.equipment._id;
  }
  return request.equipment;
};

export const getTeamName = (request, mockTeams = []) => {
  if (typeof request.maintenanceTeam === 'object' && request.maintenanceTeam?.name) {
    // Backend API - populated team
    return request.maintenanceTeam.name;
  }
  // Mock data - team is an ID
  const team = mockTeams.find(t => t.id === request.maintenanceTeam);
  return team?.name || 'Unknown Team';
};

export const getTeamId = (request) => {
  if (typeof request.maintenanceTeam === 'object' && request.maintenanceTeam?._id) {
    return request.maintenanceTeam._id;
  }
  return request.maintenanceTeam;
};

export const getTeamMembers = (request, mockTeams = [], mockUsers = []) => {
  if (typeof request.maintenanceTeam === 'object' && request.maintenanceTeam?.members) {
    // Backend API - populated team with members
    return request.maintenanceTeam.members.map(m => ({
      id: m._id || m.id,
      name: m.name,
      email: m.email,
      avatar: m.avatar,
    }));
  }
  // Mock data - team is an ID, members are IDs
  const team = mockTeams.find(t => t.id === request.maintenanceTeam);
  if (!team) return [];
  return team.members.map(memberId => {
    const user = mockUsers.find(u => u.id === memberId);
    return user ? { id: user.id, name: user.name, email: user.email, avatar: user.avatar } : null;
  }).filter(Boolean);
};

export const getTechnician = (request, mockUsers = []) => {
  if (!request.assignedTechnician) return null;
  
  if (typeof request.assignedTechnician === 'object' && request.assignedTechnician?.name) {
    // Backend API - populated technician
    return {
      id: request.assignedTechnician._id || request.assignedTechnician.id,
      name: request.assignedTechnician.name,
      email: request.assignedTechnician.email,
      avatar: request.assignedTechnician.avatar,
    };
  }
  // Mock data - technician is an ID
  const technician = mockUsers.find(u => u.id === request.assignedTechnician);
  return technician || null;
};

export const getTechnicianId = (request) => {
  if (!request.assignedTechnician) return null;
  if (typeof request.assignedTechnician === 'object' && request.assignedTechnician?._id) {
    return request.assignedTechnician._id;
  }
  return request.assignedTechnician;
};

export const normalizeId = (item) => {
  if (!item) return null;
  if (typeof item === 'object' && item._id) {
    return item._id.toString();
  }
  if (typeof item === 'object' && item.id) {
    return item.id.toString();
  }
  return item?.toString() || null;
};


