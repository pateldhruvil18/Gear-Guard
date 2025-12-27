import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaCalendar, FaUser } from 'react-icons/fa';
import Avatar from '../common/Avatar';
import { formatDate, isOverdue } from '../../utils/dateUtils';

const KanbanCard = ({ request, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: request.id || request._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const equipmentName = request.equipmentName || request.equipment?.name || 'Unknown Equipment';
  const technician = request.assignedTechnician;
  const overdue = isOverdue(request.scheduledDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`bg-white rounded-xl shadow-md border border-gray-100 p-4 cursor-move hover:shadow-xl hover:border-primary-200 transition-all duration-200 ${
        overdue ? 'border-l-4 border-l-red-500 bg-red-50' : ''
      }`}
    >
      <div className="mb-2">
        <h4 className="font-semibold text-gray-900 text-sm mb-1">{request.subject}</h4>
        {overdue && (
          <span className="text-xs text-red-600 font-medium">Overdue</span>
        )}
      </div>

      <div className="space-y-2 text-xs text-gray-600">
        <div>
          <span className="font-medium">Equipment: </span>
          <span>{equipmentName}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCalendar className="text-gray-400" />
          <span>{formatDate(request.scheduledDate)}</span>
        </div>
        {technician && (
          <div className="flex items-center gap-2">
            <FaUser className="text-gray-400" />
            <Avatar name={technician.name || technician.email} size="sm" />
            <span>{technician.name || technician.email}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanCard;

