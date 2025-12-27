import React, { useState, useEffect } from 'react';
import { equipmentApi } from '../api/equipmentApi';
import { teamsApi } from '../api/teamsApi';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import Loading from '../components/common/Loading';
import EquipmentCard from '../components/equipment/EquipmentCard';
import EquipmentForm from '../components/equipment/EquipmentForm';
import { FaPlus, FaSearch, FaTools } from 'react-icons/fa';
import { normalizeId } from '../utils/dataUtils';

const EquipmentPage = () => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();
  const { isManager } = useAuth();

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [equipment, searchTerm]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await equipmentApi.getAll();
      setEquipment(response.data || []);
    } catch (error) {
      showToast('Error fetching equipment', 'error');
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...equipment];

    if (searchTerm) {
      filtered = filtered.filter(
        eq =>
          eq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          eq.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          eq.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          eq.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          eq.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEquipment(filtered);
  };

  const handleCreate = () => {
    // Only managers can create equipment
    if (!isManager()) {
      showToast('Only managers can add equipment', 'error');
      return;
    }
    setEditingEquipment(null);
    setShowForm(true);
  };

  const handleEdit = (equipment) => {
    // Only managers can edit equipment
    if (!isManager()) {
      showToast('Only managers can edit equipment', 'error');
      return;
    }
    setEditingEquipment(equipment);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    // Only managers can delete equipment
    if (!isManager()) {
      showToast('Only managers can delete equipment', 'error');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this equipment? This action cannot be undone.')) {
      return;
    }

    try {
      const normalizedId = normalizeId(id);
      await equipmentApi.delete(normalizedId);
      showToast('Equipment deleted successfully', 'success');
      // Remove from local state immediately
      setEquipment(prev => prev.filter(eq => normalizeId(eq._id || eq.id) !== normalizedId));
      setFilteredEquipment(prev => prev.filter(eq => normalizeId(eq._id || eq.id) !== normalizedId));
      // Refresh equipment list
      await fetchEquipment();
    } catch (error) {
      showToast('Error deleting equipment', 'error');
      console.error('Error deleting equipment:', error);
      fetchEquipment();
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingEquipment) {
        const normalizedId = normalizeId(editingEquipment._id || editingEquipment.id);
        await equipmentApi.update(normalizedId, formData);
        showToast('Equipment updated successfully', 'success');
      } else {
        await equipmentApi.create(formData);
        showToast('Equipment created successfully', 'success');
      }
      setShowForm(false);
      setEditingEquipment(null);
      fetchEquipment();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error saving equipment', 'error');
      console.error('Error saving equipment:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEquipment(null);
  };

  if (showForm) {
    return (
      <MainLayout title={editingEquipment ? 'Edit Equipment' : 'Add Equipment'}>
        <div className="max-w-3xl mx-auto">
          <EquipmentForm
            equipment={editingEquipment}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Equipment Management">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Equipment Management</h2>
            <p className="text-gray-600">Manage and track all equipment in your organization</p>
          </div>
          {isManager() && (
            <button 
              onClick={handleCreate} 
              className="btn btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <FaPlus />
              Add Equipment
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="card bg-gradient-to-br from-gray-50 to-white">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search by name, serial number, category, location, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-12 w-full bg-white border-gray-300 focus:border-gray-600"
            />
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : filteredEquipment.length === 0 ? (
          <div className="card text-center py-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTools className="text-gray-600 text-3xl" />
            </div>
            <p className="text-gray-700 text-lg font-semibold mb-2">
              {searchTerm ? 'No equipment found' : 'No equipment registered'}
            </p>
            <p className="text-gray-500 text-sm">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : isManager() 
                  ? 'Click "Add Equipment" to register your first equipment'
                  : 'Contact your manager to add equipment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredEquipment.map(eq => (
              <EquipmentCard
                key={eq._id || eq.id}
                equipment={eq}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={isManager()}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default EquipmentPage;
