import React, { useState, useEffect } from 'react';
import { teamsApi } from '../../api/teamsApi';
import { useToast } from '../../contexts/ToastContext';
import { FaTools, FaSave, FaTimes } from 'react-icons/fa';
import { normalizeId } from '../../utils/dataUtils';

const EquipmentForm = ({ equipment, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    purchaseDate: '',
    warrantyInfo: '',
    location: '',
    department: '',
    assignedEmployee: '',
    defaultMaintenanceTeam: '',
    category: '',
  });
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchTeams();
    if (equipment) {
      setFormData({
        name: equipment.name || '',
        serialNumber: equipment.serialNumber || '',
        purchaseDate: equipment.purchaseDate ? new Date(equipment.purchaseDate).toISOString().split('T')[0] : '',
        warrantyInfo: equipment.warrantyInfo || '',
        location: equipment.location || '',
        department: equipment.department || '',
        assignedEmployee: normalizeId(equipment.assignedEmployee?._id || equipment.assignedEmployee) || '',
        defaultMaintenanceTeam: normalizeId(equipment.defaultMaintenanceTeam?._id || equipment.defaultMaintenanceTeam) || '',
        category: equipment.category || '',
      });
    }
  }, [equipment]);

  const fetchTeams = async () => {
    try {
      const response = await teamsApi.getAll();
      setTeams(response.data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      showToast('Error loading teams', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      showToast('Equipment name is required', 'error');
      return;
    }
    if (!formData.serialNumber.trim()) {
      showToast('Serial number is required', 'error');
      return;
    }
    if (!formData.location.trim()) {
      showToast('Location is required', 'error');
      return;
    }
    if (!formData.department.trim()) {
      showToast('Department is required', 'error');
      return;
    }
    if (!formData.defaultMaintenanceTeam) {
      showToast('Default maintenance team is required', 'error');
      return;
    }

    // Prepare form data - only include assignedEmployee if it's a valid ObjectId or empty
    const submitData = { ...formData };
    
    // If assignedEmployee is empty string, set it to null/undefined
    if (!submitData.assignedEmployee || submitData.assignedEmployee.trim() === '') {
      delete submitData.assignedEmployee;
    } else {
      // Validate ObjectId format (24 hex characters)
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(submitData.assignedEmployee.trim())) {
        showToast('Invalid Employee ID format. Please enter a valid User ID or leave empty.', 'error');
        return;
      }
    }

    onSubmit(submitData);
  };

  return (
    <div className="card bg-white shadow-xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
            <FaTools className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {equipment ? 'Edit Equipment' : 'Add New Equipment'}
            </h2>
            <p className="text-sm text-gray-600">Fill in the equipment details below</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="label text-gray-700 font-semibold">Equipment Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input bg-gray-50 focus:bg-white border-gray-300 focus:border-gray-600"
              placeholder="e.g., CNC Machine"
              required
            />
          </div>

          <div>
            <label className="label text-gray-700 font-semibold">Serial Number *</label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              className="input bg-gray-50 focus:bg-white border-gray-300 focus:border-gray-600"
              placeholder="e.g., SN-2024-001"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="label text-gray-700 font-semibold">Purchase Date</label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              className="input bg-gray-50 focus:bg-white border-gray-300 focus:border-gray-600"
            />
          </div>

          <div>
            <label className="label text-gray-700 font-semibold">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input bg-gray-50 focus:bg-white border-gray-300 focus:border-gray-600"
              placeholder="e.g., Manufacturing Equipment"
            />
          </div>
        </div>

        <div>
          <label className="label text-gray-700 font-semibold">Warranty Information</label>
          <input
            type="text"
            name="warrantyInfo"
            value={formData.warrantyInfo}
            onChange={handleChange}
            className="input bg-gray-50 focus:bg-white border-gray-300 focus:border-gray-600"
            placeholder="e.g., 3 years warranty, expires 2027"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="label text-gray-700 font-semibold">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input bg-gray-50 focus:bg-white border-gray-300 focus:border-gray-600"
              placeholder="e.g., Building A, Floor 2"
              required
            />
          </div>

          <div>
            <label className="label text-gray-700 font-semibold">Department *</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="input bg-gray-50 focus:bg-white border-gray-300 focus:border-gray-600"
              placeholder="e.g., Production, IT, Maintenance"
              required
            />
          </div>
        </div>

        <div>
          <label className="label text-gray-700 font-semibold">Default Maintenance Team *</label>
          <select
            name="defaultMaintenanceTeam"
            value={formData.defaultMaintenanceTeam}
            onChange={handleChange}
            className="input bg-gray-50 focus:bg-white border-gray-300 focus:border-gray-600"
            required
          >
            <option value="">Select Maintenance Team</option>
            {teams.map(team => (
              <option key={team._id || team.id} value={normalizeId(team._id || team.id)}>
                {team.name} {team.description && `- ${team.description}`}
              </option>
            ))}
          </select>
          {teams.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">No teams available. Please create teams first.</p>
          )}
        </div>

        <div>
          <label className="label text-gray-700 font-semibold">Assigned Employee (Optional)</label>
          <input
            type="text"
            name="assignedEmployee"
            value={formData.assignedEmployee}
            onChange={handleChange}
            className="input bg-gray-50 focus:bg-white border-gray-300 focus:border-gray-600"
            placeholder="Leave empty or enter valid User ID"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty if not assigning to a specific employee. If assigning, enter a valid User ID.
          </p>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button 
            type="submit" 
            className="flex-1 btn btn-primary flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            <FaSave />
            {equipment ? 'Update Equipment' : 'Create Equipment'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn btn-secondary flex items-center justify-center gap-2"
          >
            <FaTimes />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EquipmentForm;
