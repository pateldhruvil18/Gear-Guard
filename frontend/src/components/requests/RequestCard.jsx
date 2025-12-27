import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendar, FaUser, FaEdit, FaTrash, FaComment, FaStar } from 'react-icons/fa';
import StatusBadge from '../common/StatusBadge';
import Avatar from '../common/Avatar';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { requestsApi } from '../../api/requestsApi';
import { teamsApi } from '../../api/teamsApi';
import { normalizeId } from '../../utils/dataUtils';

const RequestCard = ({ request, onEdit, onDelete, onStatusChange, onApproveEdit, onApproveRequest, onAcceptTask }) => {
  const { user, isManager, isTechnician, isUser } = useAuth();
  const { showToast } = useToast();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDescriptionForm, setShowDescriptionForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showTeamSelection, setShowTeamSelection] = useState(false);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [technicianDescription, setTechnicianDescription] = useState(request.technicianDescription || '');
  const [userFeedback, setUserFeedback] = useState(request.userFeedback || '');
  const [feedbackRating, setFeedbackRating] = useState(request.feedbackRating || 0);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowStatusMenu(false);
      }
    };

    if (showStatusMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusMenu]);

  useEffect(() => {
    if (showTeamSelection && isManager()) {
      fetchTeams();
    }
  }, [showTeamSelection, isManager]);

  const fetchTeams = async () => {
    try {
      const response = await teamsApi.getAll();
      setTeams(response.data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const equipmentName = request.equipmentName || request.equipment?.name || 'Unknown Equipment';
  const teamName = request.maintenanceTeam?.name || 'Not Assigned';
  const teamMembers = request.maintenanceTeam?.members || [];
  const technician = request.assignedTechnician;
  const overdue = isOverdue(request.scheduledDate);

  const canAcceptTask = isTechnician() && 
    teamMembers.some(m => normalizeId(m?._id || m) === normalizeId(user?.id || user?._id)) && 
    request.status === 'approved';

  const canUpdateStatus = isTechnician() && 
    request.assignedTechnician && 
    normalizeId(request.assignedTechnician?._id || request.assignedTechnician) === normalizeId(user?.id || user?._id) &&
    ['assigned', 'in-progress'].includes(request.status);

  const validTransitions = {
    'assigned': ['in-progress'],
    'in-progress': ['repaired', 'scrap'],
    repaired: [],
    scrap: [],
  };

  const handleStatusUpdate = async (newStatus) => {
    if (validTransitions[request.status]?.includes(newStatus)) {
      // If completing task (repaired/scrap), show description form
      if (['repaired', 'scrap'].includes(newStatus) && !request.technicianDescription) {
        setShowDescriptionForm(true);
        setShowStatusMenu(false);
        return;
      }
      
      onStatusChange(normalizeId(request), newStatus);
      setShowStatusMenu(false);
    }
  };

  const handleDescriptionSubmit = async () => {
    if (!technicianDescription.trim()) {
      showToast('Please provide a description', 'error');
      return;
    }

    try {
      const newStatus = request.status === 'in-progress' ? 'repaired' : request.status;
      await requestsApi.updateStatus(normalizeId(request), newStatus, { technicianDescription });
      showToast('Task completed with description', 'success');
      setShowDescriptionForm(false);
      if (onStatusChange) {
        onStatusChange(normalizeId(request), newStatus, { technicianDescription });
      }
    } catch (error) {
      showToast('Error updating task', 'error');
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!userFeedback.trim()) {
      showToast('Please provide feedback', 'error');
      return;
    }

    if (feedbackRating === 0) {
      showToast('Please provide a rating', 'error');
      return;
    }

    try {
      await requestsApi.addFeedback(normalizeId(request), userFeedback, feedbackRating);
      showToast('Feedback submitted successfully', 'success');
      setShowFeedbackForm(false);
    } catch (error) {
      showToast('Error submitting feedback', 'error');
    }
  };

  return (
    <div className={`card group ${overdue ? 'overdue' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900">{request.subject}</h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={request.status} />
            {overdue && (
              <span className="text-xs text-red-700 font-bold bg-red-100 px-2 py-0.5 rounded-full">Overdue</span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 text-sm mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <span className="font-semibold text-gray-700">Equipment: </span>
          <span className="text-gray-900 font-medium">{equipmentName}</span>
        </div>
        <div className="flex items-center gap-2.5 text-gray-700">
          <FaCalendar className="text-gray-400 flex-shrink-0" />
          <span className="font-medium">{formatDate(request.scheduledDate)}</span>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <span className="font-semibold text-gray-600">Type: </span>
            <span className="capitalize font-medium text-gray-900">{request.type}</span>
          </div>
          {request.duration && (
            <div>
              <span className="font-semibold text-gray-600">Duration: </span>
              <span className="font-medium text-gray-900">{request.duration}h</span>
            </div>
          )}
        </div>
        {teamName && (
          <div>
            <span className="font-semibold text-gray-600">Team: </span>
            <span className="font-medium text-gray-900">{teamName}</span>
          </div>
        )}
        {technician && (
          <div className="flex items-center gap-2.5 pt-2 border-t border-gray-100">
            <FaUser className="text-gray-400 flex-shrink-0" />
            <Avatar name={technician.name || technician.email} size="sm" />
            <span className="font-medium text-gray-900">{technician.name || technician.email}</span>
          </div>
        )}
        {request.description && (
          <div className="bg-gray-50 rounded-lg p-3 mt-2">
            <p className="text-sm text-gray-700"><strong>Problem Description:</strong> {request.description}</p>
          </div>
        )}
        {request.technicianDescription && (
          <div className="bg-green-50 rounded-lg p-3 mt-2">
            <p className="text-sm text-gray-700"><strong>Technician Notes:</strong> {request.technicianDescription}</p>
          </div>
        )}
        {request.userFeedback && (
          <div className="bg-purple-50 rounded-lg p-3 mt-2">
            <div className="flex items-center gap-2 mb-1">
              <FaStar className="text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">User Feedback ({request.feedbackRating}/5)</span>
            </div>
            <p className="text-sm text-gray-700">{request.userFeedback}</p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        {/* Approval status badge for users */}
        {isUser() && request.pendingEdit && (
          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            {request.editApprovalStatus === 'pending' && (
              <p className="text-sm text-yellow-800 font-semibold">
                ⏳ Changes pending admin approval
              </p>
            )}
            {request.editApprovalStatus === 'approved' && (
              <p className="text-sm text-green-800 font-semibold">
                ✅ Your changes were approved by admin
              </p>
            )}
            {request.editApprovalStatus === 'rejected' && (
              <p className="text-sm text-red-800 font-semibold">
                ❌ Your changes were rejected by admin
              </p>
            )}
          </div>
        )}

        {/* Manager approval buttons for pending edits */}
        {isManager() && request.pendingEdit && request.editApprovalStatus === 'pending' && (
          <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-800 font-semibold mb-2">
              🔔 User has requested changes - Review required
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onApproveEdit && onApproveEdit(normalizeId(request), true)}
                className="flex-1 btn bg-green-600 hover:bg-green-700 text-white text-sm font-semibold"
              >
                Approve Changes
              </button>
              <button
                onClick={() => onApproveEdit && onApproveEdit(normalizeId(request), false)}
                className="flex-1 btn bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
              >
                Reject Changes
              </button>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
          {/* Manager: Approve pending requests */}
          {isManager() && request.status === 'pending' && (
            <>
              {!showTeamSelection ? (
                <button
                  onClick={() => setShowTeamSelection(true)}
                  className="flex-1 btn bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold shadow-lg"
                >
                  ✓ Approve & Assign Team
                </button>
              ) : (
                <div className="w-full space-y-2">
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full input"
                  >
                    <option value="">Select Maintenance Team</option>
                    {teams.map(team => (
                      <option key={team._id || team.id} value={team._id || team.id}>
                        {team.name} - {team.description}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!selectedTeam) {
                          showToast('Please select a team', 'error');
                          return;
                        }
                        onApproveRequest && onApproveRequest(normalizeId(request), normalizeId(selectedTeam));
                        setShowTeamSelection(false);
                        setSelectedTeam('');
                      }}
                      className="flex-1 btn bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setShowTeamSelection(false);
                        setSelectedTeam('');
                      }}
                      className="flex-1 btn btn-secondary text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Technician: Accept approved tasks */}
          {canAcceptTask && (
            <button
              onClick={() => onAcceptTask && onAcceptTask(normalizeId(request))}
              className="flex-1 btn bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white text-sm font-semibold shadow-lg"
            >
              ✓ Accept Task
            </button>
          )}

          {/* Technician: Update status for assigned tasks */}
          {canUpdateStatus && (
            <div className="relative flex-1" ref={menuRef}>
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="w-full btn btn-secondary text-sm font-semibold"
              >
                Update Status
              </button>
              {showStatusMenu && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                  {validTransitions[request.status]?.map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      className="w-full text-left px-4 py-3 hover:bg-primary-50 hover:text-primary-700 transition-colors text-sm font-medium capitalize border-b border-gray-100 last:border-0"
                    >
                      Mark as {status.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User: Provide feedback on completed tasks */}
          {isUser() && ['repaired', 'scrap'].includes(request.status) && !request.userFeedback && (
            <button
              onClick={() => setShowFeedbackForm(true)}
              className="flex-1 btn bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white text-sm font-semibold shadow-lg"
            >
              <FaComment className="inline mr-2" />
              Provide Feedback
            </button>
          )}

          {/* Users can edit their requests */}
          {isUser() && request.status === 'pending' && !request.pendingEdit && (
            <button
              onClick={() => onEdit(request)}
              className="flex-1 btn btn-secondary text-sm font-semibold"
            >
              <FaEdit className="inline mr-2" />
              Edit Request
            </button>
          )}

          {/* Manager: Delete option */}
          {isManager() && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
                  onDelete(normalizeId(request));
                }
              }}
              className="btn btn-danger text-sm px-4 py-2.5 flex items-center gap-2"
              title="Delete Request"
            >
              <FaTrash />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
        </div>

        {/* Technician Description Form */}
        {showDescriptionForm && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Task Completion Description</h4>
            <textarea
              value={technicianDescription}
              onChange={(e) => setTechnicianDescription(e.target.value)}
              placeholder="Describe what was done, parts replaced, issues found, etc."
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 text-sm"
              rows="4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleDescriptionSubmit}
                className="flex-1 btn bg-green-600 hover:bg-green-700 text-white text-sm font-semibold"
              >
                Submit & Complete
              </button>
              <button
                onClick={() => {
                  setShowDescriptionForm(false);
                  setTechnicianDescription(request.technicianDescription || '');
                }}
                className="flex-1 btn btn-secondary text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* User Feedback Form */}
        {showFeedbackForm && (
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Provide Feedback</h4>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFeedbackRating(rating)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      feedbackRating >= rating
                        ? 'bg-yellow-400 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={userFeedback}
              onChange={(e) => setUserFeedback(e.target.value)}
              placeholder="Share your experience with this maintenance request..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 text-sm"
              rows="4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleFeedbackSubmit}
                className="flex-1 btn bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold"
              >
                Submit Feedback
              </button>
              <button
                onClick={() => {
                  setShowFeedbackForm(false);
                  setUserFeedback(request.userFeedback || '');
                  setFeedbackRating(request.feedbackRating || 0);
                }}
                className="flex-1 btn btn-secondary text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCard;

