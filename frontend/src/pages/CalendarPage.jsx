import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { requestsApi } from '../api/requestsApi';
import { useToast } from '../contexts/ToastContext';
import MainLayout from '../components/layout/MainLayout';
import Loading from '../components/common/Loading';
import RequestModal from '../components/calendar/RequestModal';
import RequestDetailModal from '../components/calendar/RequestDetailModal';
import { useAuth } from '../contexts/AuthContext';

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { showToast } = useToast();
  const { isManager } = useAuth();

  useEffect(() => {
    fetchPreventiveRequests();
  }, []);

  const fetchPreventiveRequests = async () => {
    try {
      setLoading(true);
      const response = await requestsApi.getAll({ type: 'preventive' });
      const preventiveRequests = response.data;

      const calendarEvents = preventiveRequests.map(request => ({
        id: request.id,
        title: request.subject,
        date: request.scheduledDate,
        backgroundColor: getStatusColor(request.status),
        borderColor: getStatusColor(request.status),
        extendedProps: {
          request,
        },
      }));

      setEvents(calendarEvents);
    } catch (error) {
      showToast('Error fetching preventive maintenance', 'error');
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: '#3b82f6', // blue
      'in-progress': '#f59e0b', // yellow
      repaired: '#10b981', // green
      scrap: '#ef4444', // red
    };
    return colors[status] || '#6b7280';
  };

  const handleDateClick = (arg) => {
    if (isManager()) {
      setSelectedDate(arg.dateStr);
      setShowCreateModal(true);
    }
  };

  const handleEventClick = (arg) => {
    setSelectedRequest(arg.event.extendedProps.request);
    setShowDetailModal(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    setSelectedDate(null);
    fetchPreventiveRequests();
  };

  const handleCancel = () => {
    setShowCreateModal(false);
    setSelectedDate(null);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };

  if (loading) {
    return (
      <MainLayout title="Preventive Maintenance Calendar">
        <Loading />
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Preventive Maintenance Calendar">
      <div className="space-y-4 animate-fade-in">
        <div className="card bg-gradient-to-br from-gray-50 to-white">
          <div className="mb-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
            <p className="text-sm text-gray-700 font-medium">
              💡 Click on a date to schedule preventive maintenance (Managers only)
            </p>
          </div>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek',
            }}
            editable={false}
            selectable={isManager()}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            height="auto"
          />
        </div>

        {showCreateModal && (
          <RequestModal
            scheduledDate={selectedDate}
            onSuccess={handleCreateSuccess}
            onCancel={handleCancel}
          />
        )}

        {showDetailModal && selectedRequest && (
          <RequestDetailModal
            request={selectedRequest}
            onClose={handleCloseDetail}
            onUpdate={fetchPreventiveRequests}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default CalendarPage;

