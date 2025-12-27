import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { requestsApi } from '../api/requestsApi';
import { useToast } from '../contexts/ToastContext';
import MainLayout from '../components/layout/MainLayout';
import Loading from '../components/common/Loading';
import RequestCard from '../components/requests/RequestCard';
import RequestForm from '../components/requests/RequestForm';
import { FaPlus, FaFilter } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { normalizeId } from '../utils/dataUtils';

const RequestsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    type: searchParams.get('type') || '',
    equipment: searchParams.get('equipment') || '',
  });
  const { showToast } = useToast();
  const { isManager, isTechnician, isUser } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [requests, filters]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestsApi.getAll();
      setRequests(response.data);
    } catch (error) {
      showToast('Error fetching requests', 'error');
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...requests];

    if (filters.status) {
      filtered = filtered.filter(req => req.status === filters.status);
    }

    if (filters.type) {
      filtered = filtered.filter(req => req.type === filters.type);
    }

    if (filters.equipment) {
      filtered = filtered.filter(req => req.equipment === filters.equipment);
    }

    setFilteredRequests(filtered);
  };

  const handleCreate = () => {
    // Only users can create requests, managers cannot
    if (isManager()) {
      showToast('Managers cannot create requests. Please approve and assign existing requests.', 'info');
      return;
    }
    setEditingRequest(null);
    setShowForm(true);
  };

  const handleEdit = (request) => {
    // Check if there's already a pending edit
    if (request.pendingEdit && request.editApprovalStatus === 'pending') {
      showToast('This request already has pending changes awaiting approval', 'warning');
      return;
    }
    setEditingRequest(request);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    // Only managers can delete
    if (!isManager()) {
      showToast('You do not have permission to delete requests', 'error');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
      return;
    }

    try {
      const normalizedId = normalizeId(id);
      await requestsApi.delete(normalizedId);
      showToast('Request deleted successfully', 'success');
      // Remove from local state immediately
      setRequests(prev => prev.filter(req => normalizeId(req._id || req.id) !== normalizedId));
      setFilteredRequests(prev => prev.filter(req => normalizeId(req._id || req.id) !== normalizedId));
      // Refresh requests list
      await fetchRequests();
    } catch (error) {
      showToast('Error deleting request', 'error');
      console.error('Error deleting request:', error);
      // Still refresh to ensure UI is in sync
      fetchRequests();
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingRequest) {
        // For users, edits require approval. For managers/technicians, direct update
        const requiresApproval = isUser();
        const response = await requestsApi.update(editingRequest.id, formData, requiresApproval);
        
        if (response.requiresApproval) {
          showToast('Edit request submitted. Waiting for admin approval.', 'info');
        } else {
          showToast('Request updated successfully', 'success');
        }
      } else {
        // Users can create requests
        await requestsApi.create(formData);
        showToast('Request created successfully', 'success');
      }
      setShowForm(false);
      setEditingRequest(null);
      fetchRequests();
    } catch (error) {
      showToast('Error saving request', 'error');
      console.error('Error saving request:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRequest(null);
  };

  const handleStatusChange = async (id, newStatus, additionalData = {}) => {
    try {
      await requestsApi.updateStatus(id, newStatus, additionalData);
      showToast('Request status updated successfully', 'success');
      fetchRequests();
    } catch (error) {
      showToast('Error updating request status', 'error');
      console.error('Error updating request status:', error);
    }
  };

  const handleApproveRequest = async (id, maintenanceTeam) => {
    try {
      await requestsApi.approveRequest(id, maintenanceTeam);
      showToast('Request approved and team assigned successfully', 'success');
      fetchRequests();
    } catch (error) {
      showToast('Error approving request', 'error');
      console.error('Error approving request:', error);
    }
  };

  const handleAcceptTask = async (id) => {
    try {
      await requestsApi.acceptTask(id);
      showToast('Task accepted successfully', 'success');
      fetchRequests();
    } catch (error) {
      showToast('Error accepting task', 'error');
      console.error('Error accepting task:', error);
    }
  };

  const handleApproveEdit = async (id, approve) => {
    try {
      await requestsApi.approveEdit(id, approve);
      showToast(`Edit request ${approve ? 'approved' : 'rejected'} successfully`, 'success');
      fetchRequests();
    } catch (error) {
      showToast(`Error ${approve ? 'approving' : 'rejecting'} edit request`, 'error');
      console.error('Error approving edit:', error);
    }
  };

  if (showForm) {
    return (
      <MainLayout title={editingRequest ? 'Edit Request' : 'Add Request'}>
        <div className="max-w-2xl mx-auto">
          <RequestForm
            request={editingRequest}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Maintenance Requests">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">{isUser() ? 'My Requests' : isManager() ? 'Pending Approvals' : 'All Requests'}</h2>
          {!isManager() && (
            <button onClick={handleCreate} className="btn btn-primary flex items-center gap-2 w-full sm:w-auto">
              <FaPlus />
              Create Request
            </button>
          )}
        </div>

        <div className="card bg-gradient-to-br from-gray-50 to-white">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-primary-600" />
            <span className="font-bold text-gray-900">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="repaired">Repaired</option>
              <option value="scrap">Scrap</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="input"
            >
              <option value="">All Types</option>
              <option value="corrective">Corrective</option>
              <option value="preventive">Preventive</option>
            </select>
            <button
              onClick={() => setFilters({ status: '', type: '', equipment: '' })}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : filteredRequests.length === 0 ? (
          <div className="card text-center py-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-600 text-lg font-semibold">No requests found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or create a new request</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-visible">
            {filteredRequests.map(req => (
              <RequestCard
                key={req.id || req._id}
                request={req}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onApproveEdit={handleApproveEdit}
                onApproveRequest={handleApproveRequest}
                onAcceptTask={handleAcceptTask}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default RequestsPage;

