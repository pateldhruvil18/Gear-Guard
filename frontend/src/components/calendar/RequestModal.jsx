import React from 'react';
import RequestForm from '../requests/RequestForm';
import { requestsApi } from '../../api/requestsApi';
import { useToast } from '../../contexts/ToastContext';

const RequestModal = ({ scheduledDate, onSuccess, onCancel }) => {
  const { showToast } = useToast();

  const handleSubmit = async (formData) => {
    try {
      const requestData = {
        ...formData,
        type: 'preventive',
        scheduledDate: scheduledDate || formData.scheduledDate,
      };
      await requestsApi.create(requestData);
      showToast('Preventive maintenance scheduled successfully', 'success');
      onSuccess();
    } catch (error) {
      showToast('Error scheduling preventive maintenance', 'error');
      console.error('Error creating request:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Schedule Preventive Maintenance</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all text-2xl"
            >
              ×
            </button>
          </div>
          <RequestForm
            request={{ type: 'preventive', scheduledDate }}
            onSubmit={handleSubmit}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestModal;

