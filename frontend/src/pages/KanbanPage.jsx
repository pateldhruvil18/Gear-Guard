import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { requestsApi } from '../api/requestsApi';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import Loading from '../components/common/Loading';
import KanbanColumn from '../components/kanban/KanbanColumn';
import { normalizeId } from '../utils/dataUtils';

const KanbanPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { user, isManager, isTechnician, isUser } = useAuth();

  // Only enable drag for technicians
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // Fetch only requests that were manually added (equipmentName is not null)
      const response = await requestsApi.getAll({ isManualEquipment: true });
      // Also filter to only show user-created requests (not manager-created)
      let filteredRequests = response.data.filter(req => {
        // Only show requests created by users (role !== 'manager')
        return req.createdBy?.role !== 'manager';
      });

      // If technician, show tasks assigned to them OR approved tasks from their team
      if (isTechnician() && user) {
        const userId = normalizeId(user.id || user._id);
        filteredRequests = filteredRequests.filter(req => {
          const assignedTechId = normalizeId(req.assignedTechnician?._id || req.assignedTechnician);
          // Show if: assigned to them OR (approved status and they're in the assigned team)
          if (assignedTechId === userId) {
            return true;
          }
          // Show approved requests that could be assigned to them (they're in the team)
          if (req.status === 'approved' && req.maintenanceTeam) {
            // Check if user is in the maintenance team
            const teamMembers = req.maintenanceTeam?.members || [];
            return teamMembers.some(member => {
              const memberId = normalizeId(member._id || member);
              return memberId === userId;
            });
          }
          return false;
        });
      }

      setRequests(filteredRequests);
    } catch (error) {
      showToast('Error fetching requests', 'error');
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColumns = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'approved', label: 'Approved', color: 'blue' },
    { value: 'assigned', label: 'Assigned', color: 'purple' },
    { value: 'in-progress', label: 'In Progress', color: 'orange' },
    { value: 'repaired', label: 'Repaired', color: 'green' },
    { value: 'scrap', label: 'Scrap', color: 'red' },
  ];

  const getRequestsByStatus = (status) => {
    return requests.filter(req => req.status === status);
  };

  const handleDragEnd = async (event) => {
    // Only technicians can drag and change status
    if (!isTechnician()) {
      return;
    }

    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Check if dragging to a different column
    const activeRequest = requests.find(r => normalizeId(r.id || r._id) === activeId);
    const overStatusObj = statusColumns.find(col => col.value === overId);

    if (!activeRequest || !overStatusObj) {
      return;
    }

    const overStatus = overStatusObj.value;

    // Don't allow moving to the same status
    if (activeRequest.status === overStatus) {
      return;
    }

    // Verify technician can work on this task
    if (user) {
      const userId = normalizeId(user.id || user._id);
      const assignedTechId = normalizeId(activeRequest.assignedTechnician?._id || activeRequest.assignedTechnician);
      
      // For approved status, check if technician is in the assigned team
      if (activeRequest.status === 'approved') {
        if (overStatus !== 'assigned') {
          showToast('You can only move approved tasks to assigned status', 'error');
          return;
        }
        // Check if user is in the maintenance team
        const teamMembers = activeRequest.maintenanceTeam?.members || [];
        const isInTeam = teamMembers.some(member => {
          const memberId = normalizeId(member._id || member);
          return memberId === userId;
        });
        if (!isInTeam) {
          showToast('You can only accept tasks from your assigned team', 'error');
          return;
        }
      } else {
        // For other statuses, verify technician is assigned to this task
        if (assignedTechId !== userId) {
          showToast('You can only update tasks assigned to you', 'error');
          return;
        }
      }
    }

    // Validate status transition for technicians
    const validTransitions = {
      'pending': [],
      'approved': ['assigned'], // Technicians can accept approved tasks
      'assigned': ['in-progress'], // Technicians can start working
      'in-progress': ['repaired', 'scrap'], // Technicians can complete or scrap
      'repaired': [],
      'scrap': [],
    };

    if (!validTransitions[activeRequest.status]?.includes(overStatus)) {
      showToast('Invalid status transition', 'error');
      return;
    }

    try {
      // If moving from approved to assigned, we need to accept the task first
      if (activeRequest.status === 'approved' && overStatus === 'assigned') {
        // Accept the task (this will assign the technician)
        await requestsApi.acceptTask(activeId);
        showToast('Task accepted and assigned to you', 'success');
      } else {
        // For other status updates, use the regular update status endpoint
        // Optimistically update UI
        setRequests(prevRequests => {
          const updatedRequests = prevRequests.map(req =>
            (req.id || req._id) === activeId ? { ...req, status: overStatus } : req
          );
          return updatedRequests;
        });

        // Update via API
        await requestsApi.updateStatus(activeId, overStatus);
        showToast('Request status updated', 'success');
      }
      
      // Refresh to ensure consistency and show updated data
      fetchRequests();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating request status', 'error');
      console.error('Error updating request status:', error);
      // Revert on error
      fetchRequests();
    }
  };

  if (loading) {
    return (
      <MainLayout title="Kanban Board">
        <Loading />
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Kanban Board">
      <div className="h-full overflow-hidden">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Kanban Board</h2>
          <p className="text-gray-600">
            {isTechnician() 
              ? 'Drag and drop approved tasks to accept them, or update status of your assigned tasks'
              : isManager()
              ? 'View all task statuses. Technicians can accept approved tasks and update their status.'
              : 'View your task statuses and progress'}
          </p>
        </div>
        <DndContext
        sensors={isTechnician() ? sensors : []}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 h-full overflow-y-auto pb-4">
            {statusColumns.map(statusObj => (
              <SortableContext
                key={statusObj.value}
                id={statusObj.value}
                items={getRequestsByStatus(statusObj.value).map(r => r.id || r._id)}
                strategy={verticalListSortingStrategy}
              >
                <KanbanColumn
                  status={statusObj.value}
                  statusLabel={statusObj.label}
                  requests={getRequestsByStatus(statusObj.value)}
                  onRequestClick={(request) => {
                    // Could navigate to request detail page
                    console.log('Request clicked:', request);
                  }}
                />
              </SortableContext>
            ))}
          </div>
        </DndContext>
      </div>
    </MainLayout>
  );
};

export default KanbanPage;

