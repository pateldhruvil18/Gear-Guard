import React from 'react';
import { FaCalendar, FaUser, FaTools, FaCheckCircle } from 'react-icons/fa';
import StatusBadge from '../common/StatusBadge';
import Avatar from '../common/Avatar';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import { mockEquipment, mockTeams, mockUsers } from '../../data/mockData';

const RequestDetailModal = ({ request, onClose, onUpdate }) => {
  const equipment = mockEquipment.find(eq => eq.id === request.equipment);
  const team = mockTeams.find(t => t.id === request.maintenanceTeam);
  const technician = mockUsers.find(u => u.id === request.assignedTechnician);
  const overdue = isOverdue(request.scheduledDate);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{request.subject}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={request.status} />
                {overdue && (
                  <span className="text-sm text-red-700 font-bold bg-red-100 px-3 py-1 rounded-full">Overdue</span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all text-2xl ml-4"
            >
              ×
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Equipment Information</h3>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                <p className="text-gray-700">
                  <span className="font-medium">Name: </span>
                  {equipment?.name || 'Unknown'}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Serial Number: </span>
                  {equipment?.serialNumber || 'N/A'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FaCalendar />
                  <span className="font-medium">Scheduled Date</span>
                </div>
                <p className="text-gray-900">{formatDate(request.scheduledDate)}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FaTools />
                  <span className="font-medium">Type</span>
                </div>
                <p className="text-gray-900 capitalize">{request.type}</p>
              </div>
            </div>

            {team && (
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FaUser />
                  <span className="font-medium">Maintenance Team</span>
                </div>
                <p className="text-gray-900">{team.name}</p>
              </div>
            )}

            {technician && (
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FaUser />
                  <span className="font-medium">Assigned Technician</span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar name={technician.name} size="md" />
                  <p className="text-gray-900">{technician.name}</p>
                </div>
              </div>
            )}

            {request.duration && (
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FaCheckCircle />
                  <span className="font-medium">Duration</span>
                </div>
                <p className="text-gray-900">{request.duration} hours</p>
              </div>
            )}

            {request.description && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Description</h3>
                <p className="text-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 font-medium">{request.description}</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button onClick={onClose} className="btn btn-primary w-full">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailModal;

