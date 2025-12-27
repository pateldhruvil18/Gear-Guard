import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaUserTie,
  FaTools,
  FaClipboardList,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
} from 'react-icons/fa';
import MainLayout from '../components/layout/MainLayout';
import Loading from '../components/common/Loading';
import { usersApi } from '../api/usersApi';
import { teamsApi } from '../api/teamsApi';
import { requestsApi } from '../api/requestsApi';
import { useAuth } from '../contexts/AuthContext';
import Avatar from '../components/common/Avatar';

const ManagerDashboardPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [teams, setTeams] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTechnicians: 0,
    totalTeams: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    inProgressRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh dashboard data every 30 seconds to show latest status updates
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, teamsRes, requestsRes] = await Promise.all([
        usersApi.getAll(),
        teamsApi.getAll(),
        requestsApi.getAll(),
      ]);

      const allUsers = usersRes.data || [];
      const allTeams = teamsRes.data || [];
      const allRequests = requestsRes.data || [];

      // Filter users and technicians
      const regularUsers = allUsers.filter(u => u.role === 'user');
      const techUsers = allUsers.filter(u => u.role === 'technician');

      setUsers(regularUsers);
      setTechnicians(techUsers);
      setTeams(allTeams);
      setRequests(allRequests);

      setStats({
        totalUsers: regularUsers.length,
        totalTechnicians: techUsers.length,
        totalTeams: allTeams.length,
        pendingRequests: allRequests.filter(r => r.status === 'pending').length,
        approvedRequests: allRequests.filter(r => r.status === 'approved').length,
        inProgressRequests: allRequests.filter(r => r.status === 'in-progress').length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Manager Dashboard">
        <Loading />
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Manager Dashboard">
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6 border border-gray-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}! 👋</h2>
          <p className="text-gray-700 font-medium">Manage your team, approve requests, and monitor maintenance operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <StatCard
            icon={FaUsers}
            title="Total Users"
            value={stats.totalUsers}
            color="bg-purple-500"
          />
          <StatCard
            icon={FaTools}
            title="Technicians"
            value={stats.totalTechnicians}
            color="bg-green-500"
          />
          <StatCard
            icon={FaUserTie}
            title="Teams"
            value={stats.totalTeams}
            color="bg-blue-500"
          />
          <StatCard
            icon={FaExclamationTriangle}
            title="Pending Requests"
            value={stats.pendingRequests}
            color="bg-yellow-500"
            link="/requests?status=pending"
          />
          <StatCard
            icon={FaCheckCircle}
            title="Approved"
            value={stats.approvedRequests}
            color="bg-green-500"
            link="/requests?status=approved"
          />
          <StatCard
            icon={FaClock}
            title="In Progress"
            value={stats.inProgressRequests}
            color="bg-orange-500"
            link="/requests?status=in-progress"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FaUsers className="text-gray-600" />
                Users ({users.length})
              </h3>
              <Link to="/requests" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                View All
              </Link>
            </div>
            {users.length === 0 ? (
              <p className="text-gray-500 text-center py-8 font-medium">No users registered</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {users.slice(0, 10).map((userItem) => (
                  <div
                    key={userItem._id || userItem.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Avatar name={userItem.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{userItem.name}</p>
                      <p className="text-sm text-gray-600 truncate">{userItem.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Technicians Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FaTools className="text-gray-600" />
                Team Members ({technicians.length})
              </h3>
              <Link to="/teams" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                Manage Teams
              </Link>
            </div>
            {technicians.length === 0 ? (
              <p className="text-gray-500 text-center py-8 font-medium">No technicians registered</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {technicians.map((tech) => (
                  <div
                    key={tech._id || tech.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar name={tech.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{tech.name}</p>
                        <p className="text-sm text-gray-600 truncate">{tech.email}</p>
                      </div>
                    </div>
                    {tech.skills && tech.skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {tech.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Teams Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FaUserTie className="text-gray-600" />
              Maintenance Teams ({teams.length})
            </h3>
            <Link to="/teams" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              Manage Teams
            </Link>
          </div>
          {teams.length === 0 ? (
            <p className="text-gray-500 text-center py-8 font-medium">No teams created yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team) => (
                <div
                  key={team._id || team.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                >
                  <h4 className="font-bold text-gray-900 mb-1">{team.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{team.description || 'No description'}</p>
                  <p className="text-xs text-gray-500">
                    {team.members?.length || 0} member{team.members?.length !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              to="/requests?status=pending"
              className="btn btn-primary text-center flex items-center justify-center gap-2"
            >
              <FaExclamationTriangle />
              Pending Requests
            </Link>
            <Link
              to="/kanban"
              className="btn btn-secondary text-center flex items-center justify-center gap-2"
            >
              <FaClipboardList />
              Kanban Board
            </Link>
            <Link
              to="/teams"
              className="btn btn-secondary text-center flex items-center justify-center gap-2"
            >
              <FaUsers />
              Manage Teams
            </Link>
            <Link
              to="/requests"
              className="btn btn-secondary text-center flex items-center justify-center gap-2"
            >
              <FaCheckCircle />
              All Requests
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const StatCard = ({ icon: Icon, title, value, color, link }) => {
  const content = (
    <div className="card group cursor-pointer hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
          <p className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`${color} p-4 rounded-xl shadow-lg`}>
          <Icon className="text-white text-2xl" />
        </div>
      </div>
    </div>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }

  return content;
};

export default ManagerDashboardPage;

