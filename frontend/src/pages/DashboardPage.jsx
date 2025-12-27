import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaTools,
  FaUsers,
  FaClipboardList,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaPlus,
} from 'react-icons/fa';
import MainLayout from '../components/layout/MainLayout';
import Loading from '../components/common/Loading';
import { equipmentApi } from '../api/equipmentApi';
import { teamsApi } from '../api/teamsApi';
import { requestsApi } from '../api/requestsApi';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, isOverdue } from '../utils/dateUtils';
import ManagerDashboardPage from './ManagerDashboardPage';

const DashboardPage = () => {
  const { user, isUser, isManager } = useAuth();
  const [stats, setStats] = useState({
    equipment: 0,
    teams: 0,
    requests: 0,
    openRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    newRequests: 0,
    pendingApprovals: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
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
      const [equipmentRes, teamsRes, requestsRes] = await Promise.all([
        equipmentApi.getAll(),
        teamsApi.getAll(),
        requestsApi.getAll(),
      ]);

      const equipment = equipmentRes.data;
      const teams = teamsRes.data;
      const requests = requestsRes.data;

      const openRequests = requests.filter(
        r => r.status === 'new' || r.status === 'in-progress'
      ).length;
      const pendingRequests = requests.filter(r => r.status === 'new').length;
      const inProgressRequests = requests.filter(r => r.status === 'in-progress').length;
      const newRequests = requests.filter(r => r.status === 'new').length;
      const pendingApprovals = requests.filter(
        r => r.pendingEdit && r.editApprovalStatus === 'pending'
      ).length;

      setStats({
        equipment: equipment.length,
        teams: teams.length,
        requests: requests.length,
        openRequests,
        pendingRequests,
        inProgressRequests,
        newRequests,
        pendingApprovals,
      });

      // Get recent requests (last 5)
      const recent = requests
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);
      setRecentRequests(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Dashboard">
        <Loading />
      </MainLayout>
    );
  }

  // Show manager dashboard for managers
  if (isManager()) {
    return <ManagerDashboardPage />;
  }

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6 border border-gray-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}! 👋</h2>
          <p className="text-gray-700 font-medium">
            {isUser() 
              ? "Track your maintenance requests and pending work" 
              : "Here's an overview of your maintenance system"}
          </p>
        </div>

        {isUser() ? (
          // User Dashboard - Focus on pending work and approvals
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              icon={FaClipboardList}
              title="Total Requests"
              value={stats.requests}
              color="bg-purple-500"
              link="/requests"
            />
            <StatCard
              icon={FaExclamationTriangle}
              title="Pending (New)"
              value={stats.newRequests}
              color="bg-blue-500"
              link="/requests?status=new"
            />
            <StatCard
              icon={FaClock}
              title="In Progress"
              value={stats.inProgressRequests}
              color="bg-yellow-500"
              link="/requests?status=in-progress"
            />
            <StatCard
              icon={FaCheckCircle}
              title="Awaiting Approval"
              value={stats.pendingApprovals}
              color="bg-orange-500"
              link="/requests"
            />
          </div>
        ) : (
          // Manager/Technician Dashboard - Full stats
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={FaTools}
              title="Equipment"
              value={stats.equipment}
              color="bg-blue-500"
              link="/equipment"
            />
            <StatCard
              icon={FaUsers}
              title="Teams"
              value={stats.teams}
              color="bg-green-500"
              link="/teams"
            />
            <StatCard
              icon={FaClipboardList}
              title="Total Requests"
              value={stats.requests}
              color="bg-purple-500"
              link="/requests"
            />
            <StatCard
              icon={FaExclamationTriangle}
              title="Open Requests"
              value={stats.openRequests}
              color="bg-yellow-500"
              link="/requests?status=in-progress"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-5">Recent Requests</h3>
            {recentRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-12 font-medium">No recent requests</p>
            ) : (
              <div className="space-y-3">
                {recentRequests.map(request => {
                  const equipmentName = request.equipmentName || request.equipment?.name || 'Unknown Equipment';
                  const overdue = isOverdue(request.scheduledDate);
                  return (
                    <Link
                      key={request._id || request.id}
                      to="/requests"
                      className="block p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 group-hover:text-gray-700 transition-colors">{request.subject}</p>
                          <p className="text-sm text-gray-600 font-medium mt-1">{equipmentName}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xs text-gray-500 font-medium">
                            {formatDate(request.scheduledDate)}
                          </p>
                          {overdue && (
                            <span className="inline-block mt-2 text-xs text-red-700 font-bold bg-red-100 px-2 py-1 rounded-full">
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-5">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/requests"
                className="block w-full btn btn-primary text-left flex items-center gap-3 font-semibold"
              >
                {isUser() ? (
                  <>
                    <FaPlus className="text-lg" />
                    Create New Request
                  </>
                ) : (
                  <>
                    <FaClipboardList className="text-lg" />
                    View All Requests
                  </>
                )}
              </Link>
              {!isUser() && (
                <>
                  <Link
                    to="/kanban"
                    className="block w-full btn btn-secondary text-left flex items-center gap-3 font-semibold"
                  >
                    <FaClock className="text-lg" />
                    Open Kanban Board
                  </Link>
                  <Link
                    to="/calendar"
                    className="block w-full btn btn-secondary text-left flex items-center gap-3 font-semibold"
                  >
                    <FaCheckCircle className="text-lg" />
                    View Calendar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const StatCard = ({ icon: Icon, title, value, color, link }) => {
  const content = (
    <div className="card group cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mt-3 group-hover:text-gray-700 transition-colors">{value}</p>
        </div>
        <div className={`${color} p-5 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="text-white text-3xl" />
        </div>
      </div>
    </div>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }

  return content;
};

export default DashboardPage;

