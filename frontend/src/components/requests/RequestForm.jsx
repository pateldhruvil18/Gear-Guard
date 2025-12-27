import React, { useState, useEffect } from 'react';
import { equipmentApi } from '../../api/equipmentApi';

const RequestForm = ({ request, onSubmit, onCancel }) => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [useManualEquipment, setUseManualEquipment] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    equipment: '',
    equipmentName: '',
    type: 'corrective',
    scheduledDate: '',
    description: '',
  });

  useEffect(() => {
    fetchEquipment();
    if (request) {
      setFormData({
        subject: request.subject || '',
        equipment: request.equipment?._id || request.equipment || '',
        equipmentName: request.equipmentName || '',
        type: request.type || 'corrective',
        scheduledDate: request.scheduledDate ? new Date(request.scheduledDate).toISOString().split('T')[0] : '',
        description: request.description || '',
      });
      setUseManualEquipment(!!request.equipmentName || !request.equipment);
    }
  }, [request]);

  const fetchEquipment = async () => {
    try {
      const response = await equipmentApi.getAll();
      setEquipmentList(response.data || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setEquipmentList([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure either equipment or equipmentName is provided
    if (!useManualEquipment && !formData.equipment) {
      alert('Please select equipment or enter equipment name manually');
      return;
    }
    
    if (useManualEquipment && !formData.equipmentName.trim()) {
      alert('Please enter equipment name');
      return;
    }

    const submitData = {
      ...formData,
      equipment: useManualEquipment ? null : formData.equipment,
      equipmentName: useManualEquipment ? formData.equipmentName : null,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      <div>
        <label className="label">Subject *</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label className="label">Request Type *</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="corrective">Corrective (Breakdown)</option>
          <option value="preventive">Preventive (Routine Checkup)</option>
        </select>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <label className="label mb-0">Equipment *</label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useManualEquipment}
              onChange={(e) => {
                setUseManualEquipment(e.target.checked);
                if (e.target.checked) {
                  setFormData(prev => ({ ...prev, equipment: '', equipmentName: '' }));
                } else {
                  setFormData(prev => ({ ...prev, equipmentName: '' }));
                }
              }}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <span className="text-sm text-gray-600">Enter manually</span>
          </label>
        </div>
        
        {useManualEquipment ? (
          <input
            type="text"
            name="equipmentName"
            value={formData.equipmentName}
            onChange={handleChange}
            className="input"
            placeholder="Enter equipment name (e.g., CNC Machine #1, Server Rack A)"
            required
          />
        ) : (
          <select
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select Equipment</option>
            {equipmentList.map(eq => (
              <option key={eq._id || eq.id} value={eq._id || eq.id}>
                {eq.name} {eq.serialNumber ? `(${eq.serialNumber})` : ''}
              </option>
            ))}
          </select>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {useManualEquipment 
            ? 'Enter the equipment name manually. Manager will assign a team.'
            : 'Select from existing equipment or enter manually using the checkbox above.'}
        </p>
      </div>

      <div>
        <label className="label">Scheduled Date *</label>
        <input
          type="date"
          name="scheduledDate"
          value={formData.scheduledDate}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input"
          rows="4"
          placeholder="Describe the maintenance request..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="submit" className="flex-1 btn btn-primary">
          {request ? 'Update' : 'Create'} Request
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RequestForm;

