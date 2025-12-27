import Request from '../models/Request.model.js';

export const getAllRequests = async (req, res) => {
  try {
    const { equipment, status, type, team } = req.query;
    const filter = {};

    // Only show requests created by users (not managers)
    const User = (await import('../models/User.model.js')).default;
    const manager = await User.findOne({ role: 'manager' });
    if (manager) {
      filter.createdBy = { $ne: manager._id };
    }

    if (equipment) filter.equipment = equipment;
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (team) filter.maintenanceTeam = team;

    const requests = await Request.find(filter)
      .populate('equipment', 'name serialNumber')
      .populate({
        path: 'maintenanceTeam',
        select: 'name description members',
        populate: {
          path: 'members',
          select: 'name email avatar role'
        }
      })
      .populate('assignedTechnician', 'name email avatar')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('equipment', 'name serialNumber location department')
      .populate('maintenanceTeam', 'name description members')
      .populate('assignedTechnician', 'name email avatar role')
      .populate('createdBy', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRequest = async (req, res) => {
  try {
    // Only users can create requests, managers cannot
    if (req.user.role === 'manager') {
      return res.status(403).json({ 
        message: 'Managers cannot create requests. Please approve and assign existing requests.' 
      });
    }

    // Validate that either equipment ID or equipmentName is provided
    if (!req.body.equipment && !req.body.equipmentName) {
      return res.status(400).json({ 
        message: 'Either equipment ID or equipment name is required' 
      });
    }

    const requestData = {
      ...req.body,
      createdBy: req.user._id,
      status: 'pending', // New requests start as pending
      assignedTechnician: null,
      approvedBy: null,
      approvedAt: null,
      maintenanceTeam: null, // Will be assigned by manager
    };

    const request = await Request.create(requestData);
    const populatedRequest = await Request.findById(request._id)
      .populate('equipment', 'name serialNumber')
      .populate('maintenanceTeam', 'name description')
      .populate('assignedTechnician', 'name email avatar')
      .populate('createdBy', 'name email');

    res.status(201).json({ success: true, data: populatedRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRequest = async (req, res) => {
  try {
    const { requiresApproval, ...updateData } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // If requires approval and user is not manager, store pending edit
    if (requiresApproval && req.user.role !== 'manager') {
      request.pendingEdit = { ...updateData, requestedAt: new Date() };
      request.editApprovalStatus = 'pending';
      await request.save();
    } else {
      // Direct update (for managers or when approval not required)
      Object.assign(request, updateData);
      request.pendingEdit = null;
      request.editApprovalStatus = null;
      await request.save();
    }

    const populatedRequest = await Request.findById(request._id)
      .populate('equipment', 'name serialNumber')
      .populate('maintenanceTeam', 'name description')
      .populate('assignedTechnician', 'name email avatar')
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      data: populatedRequest,
      requiresApproval: requiresApproval && req.user.role !== 'manager',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveEdit = async (req, res) => {
  try {
    const { approve } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (!request.pendingEdit) {
      return res.status(400).json({ message: 'No pending edit to approve' });
    }

    if (approve) {
      Object.assign(request, request.pendingEdit);
      request.editApprovalStatus = 'approved';
      request.editApprovedAt = new Date();
    } else {
      request.editApprovalStatus = 'rejected';
      request.editRejectedAt = new Date();
    }

    request.pendingEdit = null;
    await request.save();

    const populatedRequest = await Request.findById(request._id)
      .populate('equipment', 'name serialNumber')
      .populate('maintenanceTeam', 'name description')
      .populate('assignedTechnician', 'name email avatar')
      .populate('createdBy', 'name email');

    res.json({ success: true, data: populatedRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ success: true, message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveRequest = async (req, res) => {
  try {
    // Only managers can approve requests
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can approve requests' });
    }

    const { maintenanceTeam } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ 
        message: `Request is already ${request.status}. Only pending requests can be approved.` 
      });
    }

    if (!maintenanceTeam) {
      return res.status(400).json({ 
        message: 'Maintenance team is required for approval' 
      });
    }

    // Manager approves and assigns team
    request.status = 'approved';
    request.approvedBy = req.user._id;
    request.approvedAt = new Date();
    request.maintenanceTeam = maintenanceTeam;

    await request.save();

    const populatedRequest = await Request.findById(request._id)
      .populate('equipment', 'name serialNumber')
      .populate('maintenanceTeam', 'name description members')
      .populate('assignedTechnician', 'name email avatar')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email');

    res.json({ success: true, data: populatedRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptTask = async (req, res) => {
  try {
    // Only technicians can accept tasks
    if (req.user.role !== 'technician') {
      return res.status(403).json({ message: 'Only technicians can accept tasks' });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'approved') {
      return res.status(400).json({ 
        message: `Request is ${request.status}. Only approved requests can be accepted.` 
      });
    }

    // Check if technician is in the assigned team
    const Team = (await import('../models/Team.model.js')).default;
    const team = await Team.findById(request.maintenanceTeam).populate('members');
    
    const isTeamMember = team.members.some(
      member => member._id.toString() === req.user._id.toString()
    );

    if (!isTeamMember) {
      return res.status(403).json({ 
        message: 'You are not a member of the assigned maintenance team' 
      });
    }

    // Technician accepts the task
    request.status = 'assigned';
    request.assignedTechnician = req.user._id;

    await request.save();

    const populatedRequest = await Request.findById(request._id)
      .populate('equipment', 'name serialNumber')
      .populate('maintenanceTeam', 'name description members')
      .populate('assignedTechnician', 'name email avatar')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email');

    res.json({ success: true, data: populatedRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status, duration, technicianDescription } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Validate status transition based on user role
    let validTransitions = {};
    
    if (req.user.role === 'technician') {
      // Technicians can: assigned → in-progress → repaired/scrap
      validTransitions = {
        'assigned': ['in-progress'],
        'in-progress': ['repaired', 'scrap'],
        'repaired': [],
        'scrap': [],
      };
    } else if (req.user.role === 'manager') {
      // Managers can change any status
      validTransitions = {
        'pending': ['approved', 'rejected'],
        'approved': ['assigned', 'rejected'],
        'assigned': ['in-progress', 'rejected'],
        'in-progress': ['repaired', 'scrap'],
        'repaired': [],
        'scrap': [],
      };
    }

    if (!validTransitions[request.status]?.includes(status)) {
      return res.status(400).json({
        message: `Invalid status transition from ${request.status} to ${status}`,
      });
    }

    // Only assigned technician can update their own tasks
    if (req.user.role === 'technician') {
      if (request.assignedTechnician?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          message: 'You can only update tasks assigned to you' 
        });
      }
    }

    request.status = status;
    if (duration !== undefined) request.duration = duration;
    if (technicianDescription !== undefined) request.technicianDescription = technicianDescription;

    if (status === 'repaired' || status === 'scrap') {
      request.completedAt = new Date();
    }

    await request.save();

    const populatedRequest = await Request.findById(request._id)
      .populate('equipment', 'name serialNumber')
      .populate('maintenanceTeam', 'name description')
      .populate('assignedTechnician', 'name email avatar')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email');

    res.json({ success: true, data: populatedRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addUserFeedback = async (req, res) => {
  try {
    const { feedback, rating } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only the user who created the request can add feedback
    if (request.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'You can only provide feedback on your own requests' 
      });
    }

    // Only allow feedback on completed requests
    if (request.status !== 'repaired' && request.status !== 'scrap') {
      return res.status(400).json({ 
        message: 'Feedback can only be provided on completed requests' 
      });
    }

    request.userFeedback = feedback;
    if (rating !== undefined) {
      request.feedbackRating = rating;
    }

    await request.save();

    const populatedRequest = await Request.findById(request._id)
      .populate('equipment', 'name serialNumber')
      .populate('maintenanceTeam', 'name description')
      .populate('assignedTechnician', 'name email avatar')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email');

    res.json({ success: true, data: populatedRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


