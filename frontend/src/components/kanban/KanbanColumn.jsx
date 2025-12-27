import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';
import StatusBadge from '../common/StatusBadge';

const KanbanColumn = ({ status, statusLabel, requests, onRequestClick }) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const statusLabels = {
    pending: 'Pending',
    approved: 'Approved',
    assigned: 'Assigned',
    'in-progress': 'In Progress',
    repaired: 'Repaired',
    scrap: 'Scrap',
  };

  const statusColors = {
    pending: 'bg-yellow-50/80 border-yellow-300',
    approved: 'bg-gray-50/80 border-gray-300',
    assigned: 'bg-purple-50/80 border-purple-300',
    'in-progress': 'bg-orange-50/80 border-orange-300',
    repaired: 'bg-green-50/80 border-green-300',
    scrap: 'bg-red-50/80 border-red-300',
  };

  return (
    <div className="flex flex-col h-full">
      <div className={`p-5 rounded-t-xl border-b-2 ${statusColors[status] || 'bg-gray-50/80 border-gray-300'} backdrop-blur-sm`}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-lg">{statusLabel || statusLabels[status] || status}</h3>
          <span className="bg-white px-3 py-1.5 rounded-full text-sm font-bold text-gray-700 shadow-sm">
            {requests.length}
          </span>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 p-4 space-y-3 overflow-y-auto ${statusColors[status] || 'bg-gray-50/80'} rounded-b-xl min-h-[500px] max-h-[calc(100vh-250px)]`}
      >
        <SortableContext items={requests.map(r => r.id || r._id)} strategy={verticalListSortingStrategy}>
          {requests.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No requests
            </div>
          ) : (
            requests.map(request => (
              <KanbanCard
                key={request.id}
                request={request}
                onClick={() => onRequestClick(request)}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;

