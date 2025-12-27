import React, { useState, useEffect } from 'react';
import { teamsApi } from '../api/teamsApi';
import { useToast } from '../contexts/ToastContext';
import MainLayout from '../components/layout/MainLayout';
import Loading from '../components/common/Loading';
import TeamCard from '../components/teams/TeamCard';
import TeamForm from '../components/teams/TeamForm';
import { FaPlus } from 'react-icons/fa';
import { usersApi } from '../api/usersApi';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teamsRes, techniciansRes] = await Promise.all([
        teamsApi.getAll(),
        usersApi.getAll({ role: 'technician' }),
      ]);
      setTeams(teamsRes.data);
      setTechnicians(techniciansRes.data || []);
    } catch (error) {
      showToast('Error fetching data', 'error');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTeam(null);
    setShowForm(true);
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) {
      return;
    }

    try {
      await teamsApi.delete(id);
      showToast('Team deleted successfully', 'success');
      fetchData();
    } catch (error) {
      showToast('Error deleting team', 'error');
      console.error('Error deleting team:', error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingTeam) {
        await teamsApi.update(editingTeam.id, formData);
        showToast('Team updated successfully', 'success');
      } else {
        await teamsApi.create(formData);
        showToast('Team created successfully', 'success');
      }
      setShowForm(false);
      setEditingTeam(null);
      fetchData();
    } catch (error) {
      showToast('Error saving team', 'error');
      console.error('Error saving team:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTeam(null);
  };

  const handleAddMember = async (teamId, userId) => {
    try {
      await teamsApi.addMember(teamId, userId);
      showToast('Member added successfully', 'success');
      fetchData();
    } catch (error) {
      showToast('Error adding member', 'error');
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (teamId, userId) => {
    try {
      await teamsApi.removeMember(teamId, userId);
      showToast('Member removed successfully', 'success');
      fetchData();
    } catch (error) {
      showToast('Error removing member', 'error');
      console.error('Error removing member:', error);
    }
  };

  if (showForm) {
    return (
      <MainLayout title={editingTeam ? 'Edit Team' : 'Add Team'}>
        <div className="max-w-2xl mx-auto">
          <TeamForm
            team={editingTeam}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Maintenance Teams">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">All Teams</h2>
          <button onClick={handleCreate} className="btn btn-primary flex items-center gap-2">
            <FaPlus />
            Add Team
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : teams.length === 0 ? (
          <div className="card text-center py-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-600 text-lg font-semibold">No teams found</p>
            <p className="text-gray-500 text-sm mt-2">Create your first maintenance team to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map(team => (
              <TeamCard
                key={team.id}
                team={team}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddMember={handleAddMember}
                onRemoveMember={handleRemoveMember}
                availableUsers={technicians}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TeamsPage;

