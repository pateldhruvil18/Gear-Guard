import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaWrench, FaCalendar, FaMapMarkerAlt, FaBuilding, FaTools, FaEdit, FaTrash } from 'react-icons/fa';
import { equipmentApi } from '../../api/equipmentApi';
import { formatDate } from '../../utils/dateUtils';
import { normalizeId } from '../../utils/dataUtils';

const EquipmentCard = ({ equipment, onEdit, onDelete, canEdit = false }) => {
  const [requestsCount, setRequestsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const equipmentId = normalizeId(equipment._id || equipment.id);
        const response = await equipmentApi.getRequestsCount(equipmentId);
        setRequestsCount(response.data.count || 0);
      } catch (error) {
        console.error('Error fetching requests count:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCount();
  }, [equipment]);

  const equipmentId = normalizeId(equipment._id || equipment.id);
  const teamName = equipment.defaultMaintenanceTeam?.name || 'Not Assigned';

  return (
    <div className="card group hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:from-gray-200 group-hover:to-gray-300 transition-all shadow-sm">
              <FaTools className="text-gray-700 text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{equipment.name}</h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">SN: {equipment.serialNumber}</p>
            </div>
          </div>
        </div>
        <Link
          to={`/requests?equipment=${equipmentId}`}
          className="relative btn btn-primary flex items-center gap-2 w-full sm:w-auto flex-shrink-0 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-600 hover:border-gray-700"
        >
          <FaWrench className="text-lg" />
          <span className="hidden sm:inline font-bold">Maintenance</span>
          <span className="sm:hidden font-bold">Maint.</span>
          {!loading && requestsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-xl animate-pulse ring-2 ring-white">
              {requestsCount}
            </span>
          )}
        </Link>
      </div>

      <div className="space-y-2.5 text-sm mb-4">
        {equipment.purchaseDate && (
          <div className="flex items-center gap-2.5 text-gray-700">
            <FaCalendar className="text-gray-400 flex-shrink-0" />
            <span className="font-medium">Purchase: <span className="text-gray-600">{formatDate(equipment.purchaseDate)}</span></span>
          </div>
        )}
        {equipment.location && (
          <div className="flex items-center gap-2.5 text-gray-700">
            <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" />
            <span className="font-medium">{equipment.location}</span>
          </div>
        )}
        {equipment.department && (
          <div className="flex items-center gap-2.5 text-gray-700">
            <FaBuilding className="text-gray-400 flex-shrink-0" />
            <span className="font-medium">{equipment.department}</span>
          </div>
        )}
        {equipment.category && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500 font-medium">Category: </span>
            <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-md ml-1">{equipment.category}</span>
          </div>
        )}
        {equipment.defaultMaintenanceTeam && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500 font-medium">Default Team: </span>
            <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-md ml-1">{teamName}</span>
          </div>
        )}
        {equipment.warrantyInfo && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500 font-medium">Warranty: </span>
            <span className="text-xs text-gray-700">{equipment.warrantyInfo}</span>
          </div>
        )}
      </div>

      {canEdit && (
        <div className="mt-5 pt-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={() => onEdit(equipment)}
            className="flex-1 btn btn-secondary text-sm flex items-center justify-center gap-2"
          >
            <FaEdit />
            Edit
          </button>
          <button
            onClick={() => onDelete(equipmentId)}
            className="flex-1 btn btn-danger text-sm flex items-center justify-center gap-2"
          >
            <FaTrash />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default EquipmentCard;
