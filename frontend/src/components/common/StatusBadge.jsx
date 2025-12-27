import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { label: 'Pending Approval', className: 'badge-pending' },
    approved: { label: 'Approved', className: 'badge-approved' },
    assigned: { label: 'Assigned', className: 'badge-assigned' },
    'in-progress': { label: 'In Progress', className: 'badge-in-progress' },
    repaired: { label: 'Repaired', className: 'badge-repaired' },
    scrap: { label: 'Scrap', className: 'badge-scrap' },
    // Legacy support
    new: { label: 'Pending Approval', className: 'badge-pending' },
  };

  const config = statusConfig[status] || { label: status, className: 'badge-pending' };

  return <span className={`badge ${config.className}`}>{config.label}</span>;
};

export default StatusBadge;

