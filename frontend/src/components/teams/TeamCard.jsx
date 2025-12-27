import React, { useState } from 'react';
import { FaUsers, FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import Avatar from '../common/Avatar';
import { normalizeId } from '../../utils/dataUtils';

const TeamCard = ({
  team,
  onEdit,
  onDelete,
  onAddMember,
  onRemoveMember,
  availableUsers,
}) => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  // Filter team members from available users based on member IDs
  const teamMembers = availableUsers.filter(u => {
    const userId = normalizeId(u._id || u.id);
    return team.members?.some(memberId => normalizeId(memberId) === userId);
  });

  const handleAddMember = () => {
    if (selectedUserId) {
      onAddMember(normalizeId(team._id || team.id), normalizeId(selectedUserId));
      setSelectedUserId('');
      setShowAddMember(false);
    }
  };

  const availableToAdd = availableUsers.filter(u => {
    const userId = normalizeId(u._id || u.id);
    return !team.members?.some(memberId => normalizeId(memberId) === userId);
  });

  return (
    <div className="card group">
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <FaUsers className="text-white text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{team.name}</h3>
            {team.description && (
              <p className="text-sm text-gray-600 font-medium">{team.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">
            Members ({teamMembers.length})
          </p>
          {availableToAdd.length > 0 && (
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="text-xs text-gray-700 hover:text-gray-900 font-semibold flex items-center gap-1"
            >
              <FaPlus />
              Add Member
            </button>
          )}
        </div>

        {showAddMember && (
          <div className="mb-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="input text-sm mb-3 bg-white"
            >
              <option value="">Select technician...</option>
              {availableToAdd.map(user => (
                <option key={user._id || user.id} value={user._id || user.id}>
                  {user.name} {user.skills && user.skills.length > 0 && `(${user.skills.join(', ')})`}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleAddMember}
                className="btn btn-primary text-sm py-2 px-4 flex-1"
                disabled={!selectedUserId}
              >
                Add Member
              </button>
              <button
                onClick={() => {
                  setShowAddMember(false);
                  setSelectedUserId('');
                }}
                className="btn btn-secondary text-sm py-2 px-4"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {teamMembers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {teamMembers.map(member => (
              <div
                key={member._id || member.id}
                className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition-all group/member"
              >
                <Avatar name={member.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-700 group-hover/member:text-gray-900 block truncate">{member.name}</span>
                  {member.skills && member.skills.length > 0 && (
                    <span className="text-xs text-gray-500">{member.skills.slice(0, 2).join(', ')}</span>
                  )}
                </div>
                <button
                  onClick={() => onRemoveMember(normalizeId(team._id || team.id), normalizeId(member._id || member.id))}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 transition-all flex-shrink-0"
                  title="Remove member"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 font-medium text-center py-4 bg-gray-50 rounded-lg">No members assigned</p>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onEdit(team)}
          className="flex-1 btn btn-secondary text-sm flex items-center justify-center gap-2"
        >
          <FaEdit />
          Edit
        </button>
        <button
          onClick={() => onDelete(normalizeId(team._id || team.id))}
          className="flex-1 btn btn-danger text-sm flex items-center justify-center gap-2"
        >
          <FaTrash />
          Delete
        </button>
      </div>
    </div>
  );
};

export default TeamCard;

